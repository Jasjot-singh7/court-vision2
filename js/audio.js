/* Court Vision — Audio (Sprint 2)
   Sound effects are generated in the browser with the Web Audio API, so there
   are no audio files to download, host or credit. A Sound On/Off button is
   added to the header on every page, and the choice is remembered.
*/

let audioCtx = null;
let soundOn = true;

try {
  soundOn = localStorage.getItem('courtVisionSound') !== 'off';
} catch (e) { /* storage blocked: stay on */ }

function getAudioContext() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// One short tone: frequency (Hz), start offset (s), length (s), wave type, volume
function tone(freq, offset, length, type, volume) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime + offset;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + length + 0.02);
}

const SOUNDS = {
  start:    () => { tone(523, 0, 0.12, 'sine', 0.15); tone(784, 0.1, 0.18, 'sine', 0.15); },
  decision: () => { tone(660, 0, 0.15, 'sine', 0.15); },
  tick:     () => { tone(1000, 0, 0.05, 'square', 0.05); },
  select:   () => { tone(440, 0, 0.1, 'sine', 0.15); },
  correct:  () => { tone(660, 0, 0.12, 'sine', 0.18); tone(880, 0.11, 0.22, 'sine', 0.18); },
  incorrect:() => { tone(260, 0, 0.15, 'triangle', 0.2); tone(180, 0.14, 0.3, 'triangle', 0.2); },
  timeout:  () => { tone(400, 0, 0.12, 'triangle', 0.18); tone(300, 0.12, 0.12, 'triangle', 0.18); tone(200, 0.24, 0.25, 'triangle', 0.18); },
  complete: () => { tone(523, 0, 0.15, 'sine', 0.18); tone(659, 0.15, 0.15, 'sine', 0.18); tone(784, 0.3, 0.3, 'sine', 0.18); },
};

function playSound(name) {
  if (!soundOn || !SOUNDS[name]) return;
  try { SOUNDS[name](); } catch (e) { /* audio is optional: never break the game */ }
}

// Sound On/Off button in the header
(function addSoundToggle() {
  const nav = document.querySelector('header.site-header nav');
  if (!nav) return;

  const btn = document.createElement('button');
  btn.className = 'sound-toggle';
  btn.type = 'button';

  const refresh = () => {
    btn.textContent = soundOn ? 'Sound: On' : 'Sound: Off';
    btn.setAttribute('aria-pressed', String(soundOn));
  };

  btn.addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem('courtVisionSound', soundOn ? 'on' : 'off'); } catch (e) {}
    refresh();
    if (soundOn) playSound('select');
  });

  refresh();
  nav.appendChild(btn);
})();
