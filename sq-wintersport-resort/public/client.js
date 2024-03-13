class GameSystem {
  constructor() {
    window.addEventListener("DOMContentLoaded", this.init());
  }
  async init() {
    this.fartAudio = new Audio('https://cdn.glitch.global/5489809c-34bd-4b92-9342-4cfaf6289938/fart.mp3?v=1670266820797');
    this.fartAudio.volume = 0.1;
    
    
    this.startAudio = new Audio('https://cdn.glitch.global/b06126ea-d89f-4c04-b5a1-3cbc2ff6115b/starthorn.mp3?v=1675018589232');
    this.startAudio.volume = 0.1;
    
    this.finishAudio = new Audio('https://cdn.glitch.global/5489809c-34bd-4b92-9342-4cfaf6289938/start.mp3?v=1670266291340');
    this.finishAudio.volume = 0.1;
    
    if(window.AframeInjection) {
      await this.awaitExistance(window, 'user');
    }
    await this.setupWebsocket();
    
  }
  showScore(score) {
    const elements = document.querySelectorAll(".scoreboard-score");
    Array.from(elements).forEach(ele => {
       if(window.setText) {
        window.setText(ele.object3D.id, score);
      }
    });
  }
  setupWebsocket(){
    return new Promise(resolve => {
      this.ws = new WebSocket('wss://' + location.host + '/');
      this.ws.onopen = (event) => {
        resolve();
      };
      this.ws.onmessage = (event) => {
        if(typeof event.data === 'string'){
          this.parseMessage(event.data);
        }
      }
      this.ws.onclose =  (event) => {
        setTimeout(() => {
          this.setupWebsocket();
        }, 1000);
      };
    });
  }
  updateTextItem(id, value) {
    const playerNumbers = document.getElementById(id);
    const currentValue = playerNumbers.getAttribute('value');
    if(value !== currentValue) {
      playerNumbers.setAttribute('value', value);
      if(window.setText) {
        window.setText(playerNumbers.object3D.id, value);
      }
    }
  }
  shorten(str, len) {
    if(str.length > len) {
      return str.substr(0, len) + "...";
    } else {
      return str;
    }
  }
  parseMessage(data) {
    const jsonObj = JSON.parse(data);
    const path = jsonObj.path;
    const json = jsonObj.data;
    
    if(path === "fart" ) {
      if(json !== window.user.id) {
        this.playFart(true);
      }
      return;
    }
    
    json.leapOfFaith.length = json.leapOfFaith.length > 8 ? 8 : json.leapOfFaith.length;
    this.updateTextItem('lofLeftText', json.leapOfFaith.map(d => this.shorten(d.name, 12).trim()).join("\n") || "Nothing yet...");
    this.updateTextItem('lofRightText', json.leapOfFaith.map(d => d.score + "m").join("\n"));
    
    json.slideQuest.length = json.slideQuest.length > 8 ? 8 : json.slideQuest.length;
    this.updateTextItem('slideQuestLeftText', json.slideQuest.map(d => this.shorten(d.name, 12).trim()).join("\n") || "Nothing yet...");
    this.updateTextItem('slideQuestRightText', json.slideQuest.map(d => (Math.round(d.score/10)/100) + "s").join("\n"));
    
    json.speedster.length = json.speedster.length > 8 ? 8 : json.speedster.length;
    this.updateTextItem('speedsterLeftText', json.speedster.map(d => this.shorten(d.name, 12).trim()).join("\n") || "Nothing yet...");
    this.updateTextItem('speedsterRightText', json.speedster.map(d => (Math.round(d.score/10)/100) + "s").join("\n"));
    
    json.slideWorks.length = json.slideWorks.length > 8 ? 8 : json.slideWorks.length;
    this.updateTextItem('slideWorksLeftText', json.slideWorks.map(d => this.shorten(d.name, 12).trim()).join("\n") || "Nothing yet...");
    this.updateTextItem('slideWorksRightText', json.slideWorks.map(d => d.score).join("\n"));
    
    json.frosty.length = json.frosty.length > 8 ? 8 : json.frosty.length;
    this.updateTextItem('frostyLeftText', json.frosty.map(d => this.shorten(d.name, 12).trim()).join("\n") || "Nothing yet...");
    this.updateTextItem('frostyRightText', json.frosty.map(d => (Math.round(d.score/10)/100) + "s").join("\n"));
    
    json.bumpJump.length = json.bumpJump.length > 8 ? 8 : json.bumpJump.length;
    this.updateTextItem('bumpJumpLeftText', json.bumpJump.map(d => this.shorten(d.name, 12).trim()).join("\n") || "Nothing yet...");
    this.updateTextItem('bumpJumpRightText', json.bumpJump.map(d => (Math.round(d.score/10)/100) + "s").join("\n"));
    
    json.kids.length = json.kids.length > 8 ? 8 : json.kids.length;
    this.updateTextItem('kidsLeftText', json.kids.map(d => this.shorten(d.name, 12).trim()).join("\n") || "Nothing yet...");
    this.updateTextItem('kidsRightText', json.kids.map(d => (Math.round(d.score/10)/100) + "s").join("\n"));
  }
  setScoreDebounce(score, type, start) {
      // Cancel the previous request to set the score if a new one comes in within 3s. 
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        // Send the LOF score to the server.
        this.send(type, score); 
        // Reset run, the user has to start again after their score is sent.
        window[start] = false;
      }, 3000);
  }
  send(type, score) {
    this.ws.send(JSON.stringify({
      path: 'finish',
      data: {
        type,
        name: window.user ? window.user.name : "Not set...",
        score: score
      }
    }));
   this.showScore((["speedster", "slideQuest", "bumpJump", "kids"].includes(type) ? (Math.round(score/10)/100) + " s" : type === "leapOfFaith" ? score + " m" : score));
   clearTimeout(this.clearScore);
   this.clearScore = setTimeout(()=>{
     this.showScore("-");
   }, 10000);
   this.finishAudio.currentTime = 0;
   this.finishAudio.play();
  }
  awaitExistance(parent, object) {
    return new Promise(resolve => {
      this.waitAndTry(parent, object, resolve);
    })
  }
  waitAndTry(parent, object, callback){
    if(parent[object]) {
        callback();
    }else{
        setTimeout(() => this.waitAndTry(parent, object, callback));
    }
  }
  playFart(skipSend) {
     this.fartAudio.currentTime = 0;
     this.fartAudio.play();
      console.log("fart");
     if(!skipSend) {
       this.ws.send(JSON.stringify({path: 'fart', data: window.user.id}));
     }
  }
  playStart(sound) {
      if(sound) {
        var audio = new Audio(sound);
        audio.volume = 0.1;
        audio.play();
      }else{
        this.startAudio.currentTime = 0;
        this.startAudio.play();
      }
  }
}

window.gameSystem = new GameSystem();

AFRAME.registerComponent('teleport-handler', {
  schema:{
     pos: {type: 'vec3', default: {x:0, y:0, z:0}}
  },
  init: function(){
    this.el.addEventListener('trigger-enter', ()=>{
      if(this.el.object3D.userData.isLocalPlayer) {
        window.movePlayer(this.data.pos);
      }
    });
  }
});

AFRAME.registerComponent('add-moving-platform', {
  init: function(){
    this.el.addEventListener('startAnimation', () => {
      window.setupMovingPlatform(this.el.object3D.id, {x: -70.93, y: 94.7, z:-239.6226}, 50, 5, 2, 2);
    });
  }
});

AFRAME.registerComponent('set-start', {
  schema:{
     sound: {type: 'string', default: undefined}
  },
  init: function(){
    // Set some global flags when the user enters any of teh start trigger colliders. 
    // This will set window.LeapOfFaithStart to true for instance.
    this.el.addEventListener('trigger-enter', ()=>{
      if(this.el.object3D.userData.isLocalPlayer) {
        console.log('Go!', this.data.sound, this.el.id);
        window[this.el.id + "Go"] = true;
        window[this.el.id + "Time"] = new Date().getTime();
        window.gameSystem.playStart(this.data.sound);
      }
    });
  }
});


AFRAME.registerComponent('lof-part', {
  init: function(){
    let timeout;
    this.el.addEventListener('trigger-enter', () => {
      if(window.LeapOfFaithStartGo && !window.hasHitLOF && this.el.object3D.userData.isLocalPlayer) {
        // Set this flag to prevent the next box from triggering, so only the first box hit is triggered.
        window.hasHitLOF = true;
        const score = Number(this.el.id.replace("LOF_", ""));
        window.gameSystem.send('leapOfFaith', score);
        window.LeapOfFaithStartGo = false;
      }
      // Debounce the reset of window.hasHitLOF with a 3s timout, this means if the next box gets 
      // hit within 10s, it will cancel the previous one and set another timeout for 3s so all 
      // next boxes are ignroed if they get triggered within 3s of the previous. The start 
      // trigger is also reset at the same time.
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        window.hasHitLOF = false;
      }, 10000);
    });
  }
});

AFRAME.registerComponent('slideworks-target', {
  schema:{
     score: {type: 'number', default: 0}
  },
  init: function(){
    let timeout;
    this.el.addEventListener('trigger-enter', () => {
      console.log("slideworks finish")
      if(window.SlideWorksStartGo && !window.hasHitSlideWorks && this.el.object3D.userData.isLocalPlayer) {
        window.hasHitSlideWorks = true;
        window.gameSystem.send('slideWorks', this.data.score);
        window.SlideWorksStartGo = false;
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        window.hasHitSlideWorks = false;
      }, 10000);
    });
  }
});

AFRAME.registerComponent('fart', {
  init: function(){
      this.el.addEventListener('trigger-enter', () => {
        console.log("fart");
        if(this.el.object3D.userData.isLocalPlayer) {
            window.gameSystem.playFart();
        }
      });
  }
});

AFRAME.registerComponent('ride-finish', {
  schema:{
     ride: {type: 'string', default: "slideQuest"},
     rideStart: {type: 'string', default: "SlideQuestStart"},
  },
  init: function(){
    this.el.addEventListener('trigger-enter', () => {
      if(window[this.data.rideStart + 'Go'] && this.el.object3D.userData.isLocalPlayer) {
        const now = new Date().getTime();
        const score = now - (window[this.data.rideStart + 'Time'] || now);
        if(score) {
          window.gameSystem.send(this.data.ride, score);
        }
        window[this.data.rideStart + 'Go'] = false;
      }
    });
  }
});





// pool stuff

window.doIOwnCallback = (e,f) => {
  console.log(e,f);
}
const takeOwner = (shouldReset) => {
  let baseid="ball_";
  let numballs=16;
  for(var i=0; i<numballs; i++) {
    var id = baseid+('0' + i).slice(-2);
    requestOwnership(id);
    if(shouldReset) {
      resetNetworkObject(id);
    }
    // doIOwn(id);
  }
}
AFRAME.registerComponent('take-over', {
    init: function () {
        this.el.addEventListener('click', () => takeOwner())
    }
});
AFRAME.registerComponent('reset-cue-ball', {
    init: function () {
        this.el.addEventListener('click', () => {
          takeOwner();
          resetNetworkObject("ball_00");
        })
    }
});
AFRAME.registerComponent('reset-all-balls', {
    init: function () {
        this.el.addEventListener('click', () => takeOwner(true))
    }
});
let cueGrabbed = false, triggered = false;
window.aframeTriggerCallback = (msg, isLocal) => {
  switch(msg) { 
    case "CueGrabbed":
      cueGrabbed = true;
      break;
    case "CueReleased":
      cueGrabbed = false;
      break;
  }
}
window.buttonPressCallback = (button) => {
    if(!triggered && cueGrabbed && (button === "LeftTrigger" || button === "RightTrigger")) {
        sendAframeEvent(document.getElementById("theCue").object3D.id, true);
        triggered = true;
    }else if(triggered && (button === "LeftTriggerRelease" || button === "RightTriggerRelease") ) {
        sendAframeEvent(document.getElementById("theCue").object3D.id);
        triggered = false;
    }
}

