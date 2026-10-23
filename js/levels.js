/* Court Vision — Levels page (MAP) */

const params = new URLSearchParams(location.search);
const mode = params.get('mode') === 'challenge' ? 'challenge' : 'training';

// ?unlock=all opens every level (for testing or marking)
if (params.get('unlock') === 'all') {
  try { sessionStorage.setItem('courtVisionUnlockAll', 'yes'); } catch (e) {}
}

document.getElementById('modeTraining').classList.toggle('active', mode === 'training');
document.getElementById('modeChallenge').classList.toggle('active', mode === 'challenge');
document.getElementById('modeTraining').href = 'levels.html?mode=training';
document.getElementById('modeChallenge').href = 'levels.html?mode=challenge';
document.getElementById('modeText').textContent = mode === 'training'
  ? 'Training Mode: get feedback after every decision.'
  : 'Challenge Mode: no hints, your score at the end.';

const grid = document.getElementById('levelGrid');
const progress = getProgressData();

Object.keys(LEVELS).forEach(n => {
  const level = Number(n);
  const info = LEVELS[level];
  const count = getScenariosForLevel(level).length;
  const unlocked = isLevelUnlocked(level);
  const best = progress.levelBest[level];

  const card = document.createElement('div');
  card.className = 'level-card' + (unlocked ? '' : ' locked');
  card.dataset.level = level;

  const title = document.createElement('h2');
  title.className = 'level-title';
  title.textContent = `Level ${level}: ${info.name}`;

  const blurb = document.createElement('p');
  blurb.textContent = info.blurb;

  const meta = document.createElement('p');
  meta.className = 'level-meta';
  meta.textContent = `${count} scenarios · ${info.seconds} seconds per decision` +
    (best ? ` · Best: ${best.correct}/${best.total}` : '');

  card.append(title, blurb, meta);

  if (unlocked) {
    const play = document.createElement('a');
    play.className = 'btn';
    play.href = `${mode}.html?level=${level}`;
    play.textContent = levelPassed(level) ? 'Play again' : 'Play';
    card.appendChild(play);
  } else {
    const lock = document.createElement('p');
    lock.className = 'lock-note';
    lock.textContent = `Locked. Get at least ${PASS_PERCENT}% on Level ${level - 1} to unlock.`;
    card.appendChild(lock);
  }

  grid.appendChild(card);
});
