AFRAME.registerComponent('handle-grab',{
  schema: {
    pos: {type: 'vec3'},
    number: {type: 'number'},
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
      if(this.data.number != 5) {
        window.rigidBodySleep(this.el.object3D.id);
        window.movePosition({x: this.data.pos.x, y: this.data.pos.y, z: this.data.pos.z}, this.el.object3D.id);
        window.moveRotation({x:-90, y:8, z:0}, this.el.object3D.id);
        window.rigidBodySetKinematic(true, this.el.object3D.id);
      }
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
            attach.setAttribute('sq-kititem', 'item: assets/crystals/crystal' + change.newValue + '.prefab');
            attach.setAttribute(side === 'left' ? 'sq-lefthand' : 'sq-righthand', 'whoToShow: ' + user);
            document.querySelector('a-scene').appendChild(attach);
          }
        }
      }
    });
  });
});
