AFRAME.registerComponent("boxwarp", {
  schema: {
    point: { type: "vec3" },
  },
  // this.data.{name}

  init: function () {
    this.el.addEventListener("trigger-enter", () => {
      if(this.el.object3D.userData.isLocalPlayer) {movePlayer(this.data.point);}
    });
  },
});
