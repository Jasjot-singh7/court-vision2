/* Court Vision — YouTube player helper (shared by Training and Challenge Mode)
   Replaces the local <video> element. Each scenario plays a short section of
   a YouTube video (start -> end), pauses at decisionAt, and can then resume
   to show the outcome. Uses the YouTube IFrame Player API.
*/

let ytPlayer = null;
let ytOnReady = null;
let ytOnError = null;
let decisionWatcher = null;
let decisionFallback = null;
let pendingDecision = null;

// Fires the decision point once, whichever trigger gets there first
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

// YouTube's script calls this function by name once it has loaded
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('player', {
    width: '100%',
    height: '100%',
    playerVars: {
      controls: 0,        // no scrubbing past the decision point
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
        // Clip reached its end time before the decision point fired
        if (e.data === YT.PlayerState.ENDED) fireDecision();
      },
      onError: () => ytOnError("This video can't be played here. It may have been removed, or its owner may have turned off embedding."),
    },
  });
}

/**
 * Plays scenario.start -> scenario.end and calls onDecisionPoint()
 * (with the video paused) when playback reaches scenario.decisionAt.
 */
function playClip(scenario, onDecisionPoint) {
  stopWatching();
  pendingDecision = onDecisionPoint;
  ytPlayer.loadVideoById({
    videoId: scenario.videoId,
    startSeconds: scenario.start,
    endSeconds: scenario.end,
  });
  ytPlayer.playVideo();

  // The player can briefly report the PREVIOUS clip's time after loading a new
  // video, so only start checking once we've seen real playback inside this
  // clip, before the decision point.
  let armed = false;

  const loadedAt = Date.now();
  let lastKick = loadedAt;

  decisionWatcher = setInterval(() => {
    const state = ytPlayer.getPlayerState();

    // If the new clip loaded but didn't start by itself, nudge it to play
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
      if (now >= scenario.start - 1 && now < scenario.decisionAt) armed = true;
      return;
    }

    if (now >= scenario.decisionAt) fireDecision();
  }, 100);

  // Safety net: if playback never reports a usable time (ads, buffering,
  // stale time), still show the question so the user is never stuck.
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
