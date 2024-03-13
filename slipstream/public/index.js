AFRAME.registerComponent('handle-grab',{
  schema: {
    pos: {type: 'vec3'},
    number: {type: 'string'},
  },
  init: function() {
    this.el.addEventListener('grab', () => {
      console.log(this.el.object3D.userData.side, 'grab');
      if(this.el.object3D.userData.side === "left") {
        setPublicSpaceProp(window.user.id + "-left", this.data.number);
      }else{
        setPublicSpaceProp(window.user.id + "-right", this.data.number);
      }
      window.rigidBodySetKinematic(false, this.el.object3D.id);
    });
    this.el.addEventListener('drop', () => {
      console.log(this.el.object3D.userData.side, 'drop');
      if(this.el.object3D.userData.side === "left") {
        setPublicSpaceProp(window.user.id + "-left", -1);
      }else{
        setPublicSpaceProp(window.user.id + "-right", -1);
      }
      //if(this.data.number != 5) {
        window.rigidBodySleep(this.el.object3D.id);
        window.movePosition({x: this.data.pos.x, y: this.data.pos.y, z: this.data.pos.z}, this.el.object3D.id);
        window.moveRotation({x:128.833, y:-44.002, z:94.202 }, this.el.object3D.id); // 128.833 -44.002 94.202
        window.rigidBodySetKinematic(true, this.el.object3D.id);
   //   }
    });
  }
});

const removeExisting = (id) => {
  const existing = document.getElementById(id);
  if(existing) {
    existing.parentElement.removeChild(existing);
  }
}
addEventListener("DOMContentLoaded", () => {
  window.userLeftCallback = async user => {
    removeExisting(user.id + "-left");
    removeExisting(user.id + "-right");
      // 
  }
  AframeInjection.addEventListener('spaceStateChange', e => {
    console.log(e.detail.changes);
    e.detail.changes.forEach(change => {
      if(change.property.endsWith("-left") || change.property.endsWith("-right")) {
        const parts = change.property.split("-");
        const user = parts[0];
        if(user != window.user.id) {
          const side = parts[1];
          removeExisting(change.property);
          if(change.newValue !== "-1") {
            const attach = document.createElement('a-entity');
            attach.id = change.property;
            attach.setAttribute('sq-kititem', 'item: assets/marshmallow/' + change.newValue + '.prefab');
            attach.setAttribute(side === 'left' ? 'sq-lefthand' : 'sq-righthand', 'whoToShow: ' + user);
            document.querySelector('a-scene').appendChild(attach);
          }
        }
      }
    });
  });
});


class Client {
  constructor() {
    this.minVoiceVolume = 0.1;
    this.startTalkingThreshold = 200;
    this.stillTalkingThreshold = 1300;
    this.init();
  }
  async init() {
    await this.setupWebsocket();
    window.transcriptionCallback = (id, msg) => {
      if(id === "aiNPC") {
        console.log(msg);
        if(!msg) {
          setTimeout(() => this.speak(), 3000);
        }else{
          this.send({path: "talk", data: msg});
        }
      }
    };
    this.isStarted = false;
    window.voiceStartedCallback = () => {
      if(this.voiceStarted) {
        this.voiceStarted();
        this.voiceStarted = null;
      }
    }
    window.aframeTriggerCallback = (msg, isLocal) => {
      switch(msg) {
        case "AINpcTriggerEnter":
          this.near = true;
          this.triggerDebounce = setTimeout(() => this.send({path: "conversing"}), 500);
          console.log("triggered!!");
          break;
        case "AINpcTriggerExit":
          this.near = false;
          console.log("triggered exit");
          clearTimeout(this.triggerDebounce);
          this.hasStopped = true;
          if(!this.isStarted && !this.npcTalking) {
            this.send({path: "stop-conversing"});
          }
          window.sendAframeEvent(this.npc.object3D.id, false);
          break;
      }
    }
    this.npc = document.getElementById('npc');
    this.npc.addEventListener("avatar-playback-complete", ()=> {
      console.log("finished speaking");
      this.npcTalking = false;
      if(this.near) {
        console.log("listening...");
        this.waitUntilNotTalking(() => {
          console.log("speaking...");
          this.speak()
        });
      }
    });
  }
  speak() {
    if(!this.isStarted) {
      this.isStarted = true;
      window.startSTT(true);
      this.voiceStarted = () => {
        console.log("Speech detected");
        this.waitUntilNotTalking(() => {
          console.log("Stop speaking");
          window.stopSTT("aiNPC");
          this.isStarted = false;
        });
      }
    }
  }
  waitUntilTalking(callback) {
    return this.waitUntilNotTalking(callback, true);
  }
  waitUntilNotTalking(callback, isOver) {
    clearInterval(this.notTalkingInterval);
    clearTimeout(this.stopSttTimeout);
    const timeoutCallback = () => {
      clearInterval(this.notTalkingInterval);
      callback();
    };
    this.stopSttTimeout = setTimeout(timeoutCallback, this.stillTalkingThreshold);
    this.notTalkingInterval = setInterval(() => {
      const vol = window.userinputs.voiceVolume;
      if(isOver ? vol < this.minVoiceVolume : vol > this.minVoiceVolume) {
        clearTimeout(this.stopSttTimeout);
        this.stopSttTimeout = setTimeout(timeoutCallback, isOver ? this.startTalkingThreshold : this.stillTalkingThreshold);
      }
    }, 100);
  }
  parseMessage(msg) {
    const json = JSON.parse(msg);
    if(json.data && json.data.type === "AUDIO") {
      this.npcTalking = true;
      console.log(json);            
      window.playAudioChunk(this.npc.object3D.id, json.data.audio.chunk, 22050, false);
    }else{
      switch(json.path) {
        case "conversing":
          console.log("following you now");
          window.sendAframeEvent(this.npc.object3D.id, true);
          this.speak();
          break;
        case "stop-conversing":
          window.sendAframeEvent(this.npc.object3D.id);
          break;
      }
    }
  }
  connected() {
    this.isConnected = this.ws && this.ws.readyState === WebSocket.OPEN;
    return this.isConnected;
  }
  send(msg, delay){
    msg.u = window.user;
    if(this.connected()) {
      setTimeout(() => this.ws.send(JSON.stringify(msg)), delay||0)
    }else{
      this.msgBackLog = this.msgBackLog || [];
      this.msgBackLog.push(msg);
    }
  }
  setupWebsocket(){
    return new Promise(resolve => {
      this.ws = new WebSocket('wss://' + location.host + '/');
      this.ws.onopen = (event) => {
        resolve(); 
        console.log("Ws connected!")
        if(this.msgBackLog && this.msgBackLog.length) {
          for(let i = 0; i < this.msgBackLog.length; i++) {
            console.log("sending backlog", this.msgBackLog[i]);
            this.send(this.msgBackLog[i], i * 200);
          }
          this.msgBackLog.length = 0;
        }
      };
      this.ws.onmessage = (event) => {
        if(typeof event.data === 'string'){
          this.parseMessage(event.data);
        }
      } 
      this.ws.onclose =  (event) => {
        console.log("Websocket closed...");
        setTimeout(() => {
          this.setupWebsocket();
        }, 1000);
      };
    });
  }
}
const client = new Client();