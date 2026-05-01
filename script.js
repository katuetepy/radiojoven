/* ===================================================
   RADIO JOVEN KATUETE — script.js
   Synchronized live-radio player (2-hour loop)
=================================================== */

// ─────────────────────────────────────────────────
// CONFIG — Link real do Dropbox
// ─────────────────────────────────────────────────
const dropboxURL = "https://www.dropbox.com/scl/fi/4vl338278et1vierr9d3z/radio-joven-1.mp3?rlkey=yblo717eeyx2fnk8fu48qjr3o&st=h74f7udr&dl=0";

// Duração do arquivo de áudio em segundos (2 horas = 7200s)
const LOOP_DURATION = 7200;

// ─────────────────────────────────────────────────
// DOM References
// ─────────────────────────────────────────────────
const audio       = document.getElementById("radio-audio");
const playBtn     = document.getElementById("play-btn");
const iconPlay    = document.getElementById("icon-play");
const iconPause   = document.getElementById("icon-pause");
const statusText  = document.getElementById("status-text");
const equalizer   = document.getElementById("equalizer");
const volumeSlider= document.getElementById("volume-slider");

// ─────────────────────────────────────────────────
// Processa o link do Dropbox para streaming direto
// ─────────────────────────────────────────────────
function getDropboxDirectLink(url) {
  if (!url || url.includes("SUA_URL_DO_DROPBOX_AQUI")) return "";
  
  // Converte para link de download direto
  // Substitui www.dropbox.com por dl.dropboxusercontent.com e garante raw=1
  let direct = url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
  
  if (direct.includes("dl=")) {
    direct = direct.replace(/dl=[01]/, "raw=1");
  } else {
    const separator = direct.includes("?") ? "&" : "?";
    direct = `${direct}${separator}raw=1`;
  }
  return direct;
}

// ─────────────────────────────────────────────────
// Calculate synchronized currentTime
// Computes how many seconds have passed since midnight
// modulo LOOP_DURATION so all listeners are in sync.
// ─────────────────────────────────────────────────
function getSyncedTime() {
  const now        = new Date();
  const midnight   = new Date(now);
  midnight.setHours(0, 0, 0, 0);

  const secondsSinceMidnight = (now - midnight) / 1000; // ms → s
  return secondsSinceMidnight % LOOP_DURATION;
}

// ─────────────────────────────────────────────────
// UI Helpers
// ─────────────────────────────────────────────────
function setStatus(msg, type = "") {
  statusText.textContent = msg;
  statusText.className   = "status-text" + (type ? ` ${type}` : "");
}

function setPlayingUI(playing) {
  if (playing) {
    iconPlay.classList.add("hidden");
    iconPause.classList.remove("hidden");
    equalizer.classList.remove("hidden");
    setStatus("Transmissão ao vivo · Radio Joven Katuete", "playing");
  } else {
    iconPlay.classList.remove("hidden");
    iconPause.classList.add("hidden");
    equalizer.classList.add("hidden");
  }
}

// ─────────────────────────────────────────────────
// Player Logic
// ─────────────────────────────────────────────────
let isSynced   = false;
let isLoading  = false;
let isPlaying  = false;

function initAudio() {
  const directLink = getDropboxDirectLink(dropboxURL);
  if (!directLink) {
    setStatus("Configure o link do Dropbox no script.js", "error");
    return;
  }

  // Só redefine se o src for diferente ou estiver vazio
  if (!audio.src || !audio.src.includes(directLink.split('?')[0])) {
    console.log("Inicializando áudio com URL:", directLink);
    audio.src = directLink;
    audio.load();
  }
  
  audio.loop   = true;
  audio.volume = parseFloat(volumeSlider.value);
}

function syncAndPlay() {
  const target = getSyncedTime();

  setStatus("Sincronizando transmissão…", "loading");
  isLoading = true;

  // Set the synced position after the audio is ready enough to seek
  const doSeek = () => {
    audio.currentTime = target;
    isSynced = true;
    audio.play()
      .then(() => {
        isPlaying = true;
        isLoading = false;
        setPlayingUI(true);
      })
      .catch((err) => {
        isLoading = false;
        console.error("Erro ao reproduzir:", err);
        setStatus("Erro ao reproduzir. Tente novamente.", "error");
        setPlayingUI(false);
      });
  };

  if (audio.readyState >= 1) {
    // Metadata already loaded – seek immediately
    doSeek();
  } else {
    // Wait for metadata
    audio.addEventListener("loadedmetadata", doSeek, { once: true });
    // Fallback: if metadata never fires within 8s, try anyway
    setTimeout(() => {
      if (!isSynced) {
        console.warn("Metadados não carregaram – tentando reproduzir sem sincronização.");
        audio.play()
          .then(() => {
            isPlaying = true;
            isLoading = false;
            setPlayingUI(true);
            setStatus("Ao vivo (sem sincronização exata)", "playing");
          })
          .catch(() => {
            isLoading = false;
            setStatus("Falha na conexão. Verifique a internet.", "error");
          });
      }
    }, 8000);
  }
}

function togglePlay() {
  if (isLoading) return;

  if (isPlaying) {
    // Pause
    audio.pause();
    isPlaying = false;
    isSynced  = false;
    setPlayingUI(false);
    setStatus("Pausado – clique em Play para retomar");
  } else {
    // Play
    initAudio();
    syncAndPlay();
  }
}

// ─────────────────────────────────────────────────
// Auto-resync when user un-hides the tab
// (prevents drift when returning after tab was hidden)
// ─────────────────────────────────────────────────
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && isPlaying) {
    audio.currentTime = getSyncedTime();
  }
});

// ─────────────────────────────────────────────────
// Event Listeners
// ─────────────────────────────────────────────────
playBtn.addEventListener("click", togglePlay);

volumeSlider.addEventListener("input", () => {
  audio.volume = parseFloat(volumeSlider.value);
});

// Natural end (shouldn't happen with loop=true, but safety net)
audio.addEventListener("ended", () => {
  if (isPlaying) {
    audio.currentTime = getSyncedTime();
    audio.play().catch(console.error);
  }
});

audio.addEventListener("error", (e) => {
  isLoading = false;
  isPlaying = false;
  setPlayingUI(false);
  console.error("Erro no áudio:", e);
  setStatus("Erro ao carregar o áudio. Verifique o link do Dropbox.", "error");
});

// ─────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────
setStatus("Pressione Play para sintonizar");
