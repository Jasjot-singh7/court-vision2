/* Court Vision — YouTube player helper (shared by Training and Challenge Mode) */

let ytPlayer = null;
let ytOnReady = null;
let ytOnError = null;
let decisionWatcher = null;
let decisionFallback = null;
let pendingDecision = null;
let clipArmed = false;

function fireDecision() {
  if (!pendingDecision) return;
  const cb = pendingDecision;
  pendingDecision = null;
  stopWatching();
  ytPlayer.pauseVideo();
  cb();
}

function loadYouTubeApi(onReady, onError) {
  ytOnReady = onReady;
  ytOnError = onError;

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  tag.onerror = () => onError('The video player could not load. Check your internet connection and refresh the page.');
  document.head.appendChild(tag);
}

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('player', {
    width: '100%',
    height: '100%',
    playerVars: {
      controls: 0,
      disablekb: 1,
      fs: 0,
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      playsinline: 1,
    },
    events: {
      onReady: () => ytOnReady(),
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.ENDED && clipArmed) fireDecision();
      },
      onError: () => ytOnError("This video can't be played here."),
    },
  });
}

function playClip(scenario, onDecisionPoint) {
  stopWatching();
  pendingDecision = onDecisionPoint;
  clipArmed = false;
  ytPlayer.loadVideoById({
    videoId: scenario.videoId,
    startSeconds: scenario.start,
    endSeconds: scenario.end,
  });
  ytPlayer.playVideo();

  let armed = false;
  const loadedAt = Date.now();
  let lastKick = loadedAt;

  decisionWatcher = setInterval(() => {
    const state = ytPlayer.getPlayerState();
    const stalled = state === YT.PlayerState.PAUSED ||
                    state === YT.PlayerState.CUED ||
                    state === YT.PlayerState.UNSTARTED;
    if (stalled && Date.now() - lastKick > 1500) {
      lastKick = Date.now();
      ytPlayer.playVideo();
    }

    if (state !== YT.PlayerState.PLAYING) return;
    const now = ytPlayer.getCurrentTime();

    if (!armed) {
      if (now >= scenario.start - 1 && now < scenario.decisionAt) {
        armed = true;
        clipArmed = true;
      }
      return;
    }

    if (now >= scenario.decisionAt) fireDecision();
  }, 100);

  decisionFallback = setTimeout(fireDecision, (scenario.end - scenario.start + 12) * 1000);
}

function resumeClip() {
  ytPlayer.playVideo();
}

function stopWatching() {
  clearInterval(decisionWatcher);
  clearTimeout(decisionFallback);
}

function stopClip() {
  pendingDecision = null;
  stopWatching();
  if (ytPlayer) ytPlayer.pauseVideo();
}