const { WebSocket } = require('@encharm/cws');
const express = require('express');
const http = require('http');
const path = require('path');
const InworldClient = require("@inworld/nodejs-sdk").InworldClient;

class GameServer{
  constructor() {
    this.setupServer();
    this.isConversationActive = false;
    this.client = new InworldClient()
      .setApiKey({
        key: process.env.INWORLD_KEY,
        secret: process.env.INWORLD_SECRET,
      })  
      .setScene("workspaces/default-vpgjcvsdejfanwtgslc9-q/characters/sadie")
      .setOnError((err) => {
        if(err.code === 10) {
          // this.connection = this.client.build();
        }else{
          console.log(err.code);
          console.error(`Error: ${err.message}`);
        }
        this.connection = this.client.build();
      }) 
      .setOnDisconnect(() => console.log('Disconnected'))
      .setOnMessage(p => {
         console.log(p.type);
         this.wss.broadcast(JSON.stringify({path: 'packet', data: p}));    
      });
  
    this.connection = this.client.build();
      
  }
  setupServer() {  
     
    this.app = express();
    
    this.server = http.createServer( this.app );
    
    this.wss = new WebSocket.Server({ noServer: true });
    
    this.server.on('upgrade', (request, socket, head) => {
      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.wss.emit('connection', ws, request);
      });
    });
    
    this.wss.startAutoPing(10000);
    
    this.wss.on('connection', (ws, req) => {
      if(this.isConversationActive && this.wss.clients.length === 1) {
        this.isConversationActive = false;
      }
      ws.on('message', msg => {
        try{
          this.parseMessage(msg, ws);
        }catch(e) {
          console.log("parse error: ", e);
        } 
      });
    });
    
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.server.listen( 3000, function listening(){
        console.log("game started");
    });  
  }
  async parseMessage(msg, ws) {
    let json = JSON.parse(msg);
    switch(json.path) {
      case "talk":
        this.connection.sendText(json.data);
        break;
      case "conversing":
        if(!this.isConversationActive) {
          this.isConversationActive = true;
          ws.send(JSON.stringify({path: 'conversing'}));
        }
        break;
      case "stop-conversing":
        if(this.isConversationActive) {
          this.isConversationActive = false;
          ws.send(JSON.stringify({path: 'stop-conversing'}));
        }
        break;
    }
  }
}

const gameServer = new GameServer();