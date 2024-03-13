class ParkourPlayer{ 
  constructor() {
    this.avatar = "https://models.readyplayer.me/655c7d6f751f07df925dfbfc.glb";
    
    this.container = document.getElementById("intro");
    this.container.setAttribute("sq-playavatar", "tracking: https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario1.trackingsession?v=1700560712360; audio: https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario1.wav?v=1700560714150;avatar: https://models.readyplayer.me/655c7d6f751f07df925dfbfc.glb")
    // Colors: https://pixeljoint.com/forum/forum_posts.asp?TID=12795
    
    this.setupButton("3 -76.25 -1.5", "-80", "1 \n\n Move, Crouch,\nSprint and Jump \n\n(Click to skip intro)", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario3.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario3.wav?v=1700560714150"
    },"#442434");
    
    this.setupButton("7.5 -76.25 -2.5", "0", "2 \n\n Climbing", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario4.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario4.wav?v=1700560714150"
    },"#30346d");
    
    this.setupButton("13 -76.25 -2.5", "0", "3 \n\n Sprint Long-Jump", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario5.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario5.wav?v=1700560714150"
    },"#4e4a4e");
    
    this.setupButton("26 -76.25 -2.5", "0", "4 \n\n Kicker Jump", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario6.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario6.wav?v=1700560714150"
    },"#854c30");
    
    this.setupButton("35 -72.25 14.5", "180", "5 \n\n Crouch Slide", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario7.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario7.wav?v=1700560714150"
    },"#346524");
    
    this.setupButton("60.5 -78.25 14.5", "180", "6 \n\n Climbing In VR", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario8.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario8.wav?v=1700560714150"
    },"#d04648");
    
    this.setupButton("60.5 -78.25 9.5", "0", "7 \n\n Climbing In 2D", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario9.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario9.wav?v=1700560714150"
    },"#757161");
    
    this.setupButton("63.6 -66.75 9.5", "0", "8 \n\n Bonus Climbing", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario10.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario10.wav?v=1700560714150"
    },"#597dce");
    
    this.setupButton("67.2 -68 16.5", "-90", "9 \n\n Choose Your Own\nAdventure", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario11.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario11.wav?v=1700560714150"
    },"#d27d2c");
    
    this.setupButton("68.5 -71 36", "-90", "10 \n\n Side Quest", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario12.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario12.wav?v=1700560714150"
    },"#8595a1");
    
    this.setupButton("552 -77.5 2.5", "90", "11 \n\n Final Level", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario13.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario13.wav?v=1700560714150"
    },"#6daa2c");
    
    this.setupButton("548 -77.5 3", "90", "12 \n\n Intro to Friction", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario14.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario14.wav?v=1700560714150"
    },"#d2aa99");
    
    this.setupButton("544 -77.5 4", "90", "13 \n\n Climb Friction", {
        tracking: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario15.trackingsession?v=1700590352073",
        audio: "https://cdn.glitch.global/649834d7-e76b-4cf2-9cf1-ee904d67b53b/mario15.wav?v=1700560714150"
    },"#6dc2ca");
  }
  setupButton(position, rotationY, stage, player, color) {
    const buttContainer = document.createElement("a-entity");
    buttContainer.setAttribute("position", position);
    buttContainer.setAttribute("rotation", "-30 " + rotationY + " 0");
    const box = document.createElement("a-box");
    box.setAttribute("sq-collider", "");
    box.setAttribute("sq-interactable", "");
    box.setAttribute("scale", "0.8 0.8 0.1");
    box.setAttribute("color", color);
    buttContainer.appendChild(box);
    const text = document.createElement("a-text");
    text.setAttribute("value", "Parkour Stage " + stage);
    text.setAttribute("scale", "0.4 0.4 0.4");
    text.setAttribute("position", "0 0 0.052");
    text.setAttribute("align", "center");
    buttContainer.appendChild(text);
    document.querySelector("a-scene").appendChild(buttContainer);
    let hasClicked = false;
    box.addEventListener("click", () => {
      if(hasClicked) {
        return;
      }
      hasClicked = true;
      window.setText(text.object3D.id, "loading...")
      setTimeout(()=>{
        hasClicked = false;
        window.setText(text.object3D.id, "Parkour Stage " + stage)
      }, 2000);
       window.playAvatar(this.container.object3D.id, player.tracking, player.audio);
       this.playedOne = true;
    });
  }
}

addEventListener("DOMContentLoaded", () => {
  new ParkourPlayer();
});

let EasyMode = false;
AFRAME.registerComponent("toggle-easy", {
  init: function () {
    const text = document.getElementById("easyText");
    this.el.addEventListener("click", () => {
      if(this.el.object3D.userData.isLocalPlayer == false) { return; }
      if (EasyMode) {
        EasyMode = false;
        gravity({x: 0, y: -9.8, z: 0})
        setText(text.object3D.id, "Easy Mode")
      } else {
        EasyMode = true;
        gravity({x: 0, y: -3.71, z: 0})
        setText(text.object3D.id, "Hard Mode")
      }
    });
  },
});