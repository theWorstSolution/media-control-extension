function getMedia() {
  return document.querySelector("audio, video");
}

function getSiteKey() {
  return location.hostname;
}

function showToast(text) {
  let toast = document.getElementById("audio-controller-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "audio-controller-toast";

    Object.assign(toast.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "rgba(0,0,0,0.8)",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      fontSize: "18px",
      zIndex: 999999,
      transition: "opacity 0.2s",
      fontFamily: "sans-serif"
    });

    document.body.appendChild(toast);
  }

  toast.textContent = text;
  toast.style.opacity = "1";

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.style.opacity = "0";
  }, 800);
}

// function saveSpeed(rate) {
//   chrome.storage.sync.set({
//     [getSiteKey()]: rate
//   });
// }

// function loadSpeed(media) {
//   chrome.storage.sync.get([getSiteKey()], (result) => {
//     const rate = result[getSiteKey()];
//     if (rate) {
//       media.playbackRate = rate;
//       showToast(`▶ ${rate}x`);
//     }
//   });
// }

document.addEventListener("DOMContentLoaded", () => {
  const media = getMedia();
  // if (media) loadSpeed(media);
});

document.addEventListener("keydown", (e) => {
  console.log("helo2")

  const tag = document.activeElement.tagName;
  if (
    ["INPUT", "TEXTAREA"].includes(tag) ||
    document.activeElement.isContentEditable
  ) {
    return;
  }
  console.log("helo1")
  const media = getMedia();
  if (media){
    switch (e.key) {
      // case "ArrowRight":
      case "d":
        e.preventDefault();
        media.currentTime += 3;
        // showToast("⏩ +3s");
        break;
  
      // case "ArrowLeft":
      case "a":
      e.preventDefault();
        media.currentTime -= 3;
        // showToast("⏪ -3s");
        break;
  
      // case "ArrowUp":
      case "w":
        e.preventDefault();
        media.volume = Math.min(1, media.volume + 0.1);
        showToast(`🔊 ${Math.round(media.volume * 100)}%`);
        break;
  
      // case "ArrowDown":
      case "s":
        e.preventDefault();
        media.volume = Math.max(0, media.volume - 0.1);
        showToast(`🔉 ${Math.round(media.volume * 100)}%`);
        break;
  
      case " ":
        if (location.hostname.includes("youtube.com")) {
          return;
        }
        e.preventDefault();
        if (media.paused) {
          media.play();
          // showToast("▶ Play");
        } else {
          media.pause();
          // showToast("⏸ Pause");
        }
        break;
  
      case ",":
      case "<":
        e.preventDefault();
        media.playbackRate = Math.max(0.2, media.playbackRate - 0.1);
        // saveSpeed(media.playbackRate);
        showToast(`🐢 ${media.playbackRate}x`);
        break;
  
      case ".":
      case ">":
        e.preventDefault();
        media.playbackRate = Math.min(4, media.playbackRate + 0.1);
        // saveSpeed(media.playbackRate);
        showToast(`⚡ ${media.playbackRate}x`);
        break;
    }
  }
  
  const iframe = document.querySelector("iframe");
  console.log("co iframe")
  if (iframe){
    iframe.contentWindow.postMessage(
      {
        type: "CUSTOM_AUDIO_CONTROL",
        key: e.key.toLowerCase()
      },
      "*"
    );
  }
});

window.addEventListener("message", (event) => {
  if (event.data?.type !== "CUSTOM_AUDIO_CONTROL") return;
  console.log("co message")
  const video = document.querySelector("video");
  if (!video) return;
  console.log("co video trong iframe")
  switch (event.data.key) {
    case "a":
      video.currentTime -= 3;
      break;
    case "d":
      video.currentTime += 3;
      break;
    case "w":
      media.volume = Math.max(0, media.volume + 0.1);
      break;
    case "s":
      media.volume = Math.max(0, media.volume - 0.1);
      break;
  }
});