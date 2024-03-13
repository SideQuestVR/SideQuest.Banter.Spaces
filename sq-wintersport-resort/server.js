const { WebSocket } = require('@encharm/cws');
const express = require('express');
const http = require('http');
const path = require('path');

class GameServer{
  constructor() {
    this.setupServer();
    this.room = {
      leapOfFaith:[],
      speedster:[],
      slideQuest:[],
      slideWorks:[],
      frosty:[],
      bumpJump:[],
      kids:[]
    }
    this.roomKeys = Object.keys(this.room);
    this.interval = 3000;
    setInterval(() => this.tick(), this.interval);
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
    //  ws.send({path: 'initial-state', data: this.room.data});
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
  parseMessage(msg, ws) {
    let json = JSON.parse(msg);
    switch(json.path) {
      case "clear":
        this.room.leapOfFaith.length = 
        this.room.speedster.length = 
        this.room.slideQuest.length = 
        this.room.slideWorks.length = 
        this.room.frosty.length = 
        this.room.bumpJump.length = 
        this.room.kids.length = 0;
        break;
      case "fart":
        this.wss.broadcast(JSON.stringify({path: 'fart', data: json.data}));
        break;
      case "finish":
        if(json.data.type && this.roomKeys.includes(json.data.type)){
          const name = json.data.name || "Not set...";
          const score = json.data.score || 0;
          this.room[json.data.type].push({name, score});
          if(json.data.type === "slideQuest" || json.data.type === "speedster" || json.data.type === "frosty" || json.data.type === "bumpJump" || json.data.type === "kids") {
            this.room[json.data.type].sort((a, b) => a.score - b.score);
          }else{
            this.room[json.data.type].sort((a, b) => b.score - a.score);
          }
          this.room[json.data.type].length = this.room[json.data.type].length > 40 ? 40 : this.room[json.data.type].length;
        }
        break;
    }
  }
  tick() {
     this.wss.broadcast(JSON.stringify({path: 'tick', data: this.room}));
  }
}

const gameServer = new GameServer();