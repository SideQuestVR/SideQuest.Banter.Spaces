
const hideFae = () => {
  const fae = document.getElementById('fae');
  const hideFaeButton = document.getElementById('hideFaeButton');
  const hideFaeButtonText = document.getElementById('hideFaeButtonText');
  fae.parentElement.removeChild(fae);
  hideFaeButton.parentElement.removeChild(hideFaeButton);
  hideFaeButtonText.parentElement.removeChild(hideFaeButtonText);
}
addEventListener("DOMContentLoaded", async (event) => {
  const vid = document.getElementById("video");
  const vidAudio = document.getElementById("videoAudio");
  const loadingText = document.getElementById("loadingText");
  const loadingTextBack = document.getElementById("loadingTextBack");
  urls.forEach((u,i) => {
    const parent = document.createElement('a-entity');
    const box = document.createElement('a-entity');
    box.setAttribute('gltf-model', 'https://cdn.sidequestvr.com/file/460973/buttonl.glb');
    box.setAttribute('sq-boxcollider', 'size: 1.5 0.4 0.05');
    parent.setAttribute('position','1.5 ' + (0.2 + (0.3 * i)) + ' 2');
    box.setAttribute('sq-interactable','');
    box.setAttribute('rotation','0 40 0');
    box.setAttribute('sq-collider','');
    box.setAttribute('handle-click','url: ' + i);
    const text = document.createElement('a-text');
    text.setAttribute('value', u.name);
    text.setAttribute('rotation','0 220 0');
    text.setAttribute('position','0 0 -0.03');
    text.setAttribute('scale','0.3 0.3 0.3');
    text.setAttribute('align', 'center');
    parent.appendChild(box);
    parent.appendChild(text);
    document.querySelector('a-scene').appendChild(parent);
  });
  window.show = (url) => {
    oneShot({type: 'loading'})
    setVisible(true, loadingTextBack.object3D.id);
    setText(loadingText.object3D.id, "loading...");
    fetch('https://ytdl-getinfo.glitch.me/?url=' + url)
      .then(r=>r.json())
      .then(r=>{
        setText(loadingText.object3D.id, "playing...");
        const audio = r.player_response.streamingData.formats.filter(d=>d.qualityLabel.startsWith("360p"))[0].url;
        oneShot({type: 'play', url: r.player_response.streamingData.adaptiveFormats[1].url, audio});
        setVideoUrl(vid.object3D.id, r.player_response.streamingData.adaptiveFormats[1].url);
        setVideoUrl(vidAudio.object3D.id, audio);
      
    })
  }
  vid.addEventListener('video-prepare-complete', () => {
    setTimeout(()=>{
      setText(loadingText.object3D.id, "");
      setVisible(false, loadingTextBack.object3D.id);
    }, 1000);
  });
  if(window.isBanter) {
     await window.AframeInjection.waitFor(window, 'user');
     AframeInjection.addEventListener('oneShot', e => {
      if(e.detail.data.type && (e.detail.data.type === "loading" || e.detail.data.type === "play")) {
        const user = e.detail.fromId;
        if(user != window.user.id) {
          if(e.detail.data.type === "play") {
            const vid = document.getElementById("video");
            setVideoUrl(vid.object3D.id, e.detail.data.url);
            setVideoUrl(vidAudio.object3D.id, e.detail.data.audio);
            setText(loadingText.object3D.id, "playing...");
          }else if(e.detail.data.type === "loading") {
            setVisible(true, loadingTextBack.object3D.id);
            setText(loadingText.object3D.id, "loading...");
          }
        }
      }
    });
  }
});

AFRAME.registerComponent("handle-click", {
  init: function() {
    this.el.addEventListener('click', () => show(urls[this.data.url].url));
  }
});

AFRAME.registerComponent("delete-fae", {
  init: function() {
    this.el.addEventListener('click', () => hideFae());
  }
});

AFRAME.registerComponent("change-gravity", {
  init: function() {
    let zero = false;
    this.el.addEventListener('click', () => {
      zero = !zero;
      gravity({x: 0, y: zero ? 0 : -9.8, z: 0});
    });
  }
});
