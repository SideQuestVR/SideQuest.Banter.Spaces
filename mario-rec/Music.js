let MusicPlaying = false;
AFRAME.registerComponent("toggle-music", {
  init: function () {
    this.el.addEventListener("click", () => {
      if(this.el.object3D.userData.isLocalPlayer == false) { return; }
      
      let SBH = document.getElementById("SBH-BGM");
      if (MusicPlaying) {
        MusicPlaying = false;
        SBH.components.sound.stopSound();
      } else {
        MusicPlaying = true;
        SBH.components.sound.playSound();
      }
    });
  },
});
