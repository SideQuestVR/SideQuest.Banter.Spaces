//This is a script that changes song when you enter an area


AFRAME.registerComponent('music-change-area', {
  schema: {
    FromAudio: {type: 'string'},
    ToAudio: {type: 'string'}
    
  }, 
  // this.data.{name}
  
  init: function () {
    //swap the music track when entering an area
    this.el.addEventListener('trigger-enter', () => {
        if(this.el.object3D.userData.isLocalPlayer == false) { return; }
      
        if (MusicPlaying) //This refrences the global var in Music.js, I hate JS globals
          {
            let Old = document.getElementById(this.data.FromAudio);
            let New = document.getElementById(this.data.ToAudio);
            
            Old.components.sound.stopSound();
            New.components.sound.playSound();
          }
    })
    
    //Revert the audio back to the state it was
    this.el.addEventListener('trigger-exit', () => {
        if(this.el.object3D.userData.isLocalPlayer == false) { return; }
      
        if (MusicPlaying) //This refrences the global var in Music.js, I hate JS globals
          {
            let New = document.getElementById(this.data.FromAudio);
            let Old = document.getElementById(this.data.ToAudio);
            
            Old.components.sound.stopSound();
            New.components.sound.playSound();
          }
    })
  }
});