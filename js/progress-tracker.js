/* Court Vision — Score/Data (Sprint 2)
   Guests: sessionStorage (resets when the tab closes).
   Logged-in users (auth.js): localStorage, saved between visits on the same
   browser. Cloud saving across devices is a later-sprint (MAP) goal.
   Tracks: overall totals, per-mode totals, per-scenario results, best
   Challenge score, and the five most recent activities.
*/

const PROGRESS_KEY = 'courtVisionProgress';

function emptyProgress() {
  return {
    totalCorrect: 0,
    totalAttempted: 0,
    recentActivity: [],
    byMode: {
      Training: { attempted: 0, correct: 0 },
      Challenge: { attempted: 0, correct: 0 },
    },
    byScenario: {},          // title -> { attempted, correct }
    bestChallenge: null,     // { correct, total }
    levelBest: {},           // level number -> { correct, total } best run
  };
}

// Logged-in users save to localStorage (kept between visits); guests use
// sessionStorage (cleared when the tab closes).
function progressStore() {
  const userKey = (typeof getCurrentUserKey === 'function') ? getCurrentUserKey() : null;
  if (userKey) return { store: localStorage, key: PROGRESS_KEY + ':' + userKey };
  return { store: sessionStorage, key: PROGRESS_KEY };
}

function getProgressData() {
  let data = emptyProgress();
  try {
    const s = progressStore();
    const raw = s.store.getItem(s.key);
    if (raw) data = Object.assign(emptyProgress(), JSON.parse(raw));
  } catch (e) { /* storage blocked or corrupt: start fresh */ }
  return data;
}

function saveProgressData(data) {
  try {
    const s = progressStore();
    s.store.setItem(s.key, JSON.stringify(data));
  } catch (e) { /* storage blocked: progress just won't be kept */ }
}

function recordAttempt(mode, scenarioTitle, wasCorrect) {
  const data = getProgressData();

  data.totalAttempted++;
  if (wasCorrect) data.totalCorrect++;

  if (!data.byMode[mode]) data.byMode[mode] = { attempted: 0, correct: 0 };
  data.byMode[mode].attempted++;
  if (wasCorrect) data.byMode[mode].correct++;

  if (!data.byScenario[scenarioTitle]) data.byScenario[scenarioTitle] = { attempted: 0, correct: 0 };
  data.byScenario[scenarioTitle].attempted++;
  if (wasCorrect) data.byScenario[scenarioTitle].correct++;

  const resultLabel = wasCorrect ? 'Correct' : 'Incorrect';
  data.recentActivity.unshift(`${mode}: ${scenarioTitle} — ${resultLabel}`);
  data.recentActivity = data.recentActivity.slice(0, 5);

  saveProgressData(data);
}

// Called when ANY run of a level finishes (Training or Challenge).
// Keeps the best percentage for the level. Returns whether this run passed
// and which level, if any, it newly unlocked.
function recordLevelRun(level, correct, total) {
  const data = getProgressData();
  const wasUnlocked = isLevelUnlocked(level + 1);

  const best = data.levelBest[level];
  if (!best || correct / total > best.correct / best.total) {
    data.levelBest[level] = { correct, total };
  }
  saveProgressData(data);

  const passed = (correct / total) * 100 >= PASS_PERCENT;
  const nowUnlocked = LEVELS[level + 1] && isLevelUnlocked(level + 1);
  return { passed, newlyUnlocked: (!wasUnlocked && nowUnlocked) ? level + 1 : null };
}

function levelPassed(level) {
  const best = getProgressData().levelBest[level];
  return !!best && (best.correct / best.total) * 100 >= PASS_PERCENT;
}

// Level 1 is always open. Level N opens when level N-1 has been passed.
// ?unlock=all on the Levels page opens everything (for testing/marking).
function isLevelUnlocked(level) {
  if (level <= 1) return true;
  try { if (sessionStorage.getItem('courtVisionUnlockAll') === 'yes') return true; } catch (e) {}
  return levelPassed(level - 1);
}

function getHighestUnlockedLevel() {
  let highest = 1;
  Object.keys(LEVELS).forEach(n => { if (isLevelUnlocked(Number(n))) highest = Number(n); });
  return highest;
}

// Called when a Challenge run finishes; keeps the best percentage
function recordChallengeScore(correct, total) {
  const data = getProgressData();
  const best = data.bestChallenge;
  if (!best || correct / total > best.correct / best.total) {
    data.bestChallenge = { correct, total };
  }
  saveProgressData(data);
}

function resetProgress() {
  try { const s = progressStore(); s.store.removeItem(s.key); } catch (e) {}
}

// Name of the highest level the player has unlocked
function getCurrentLevel() {
  return LEVELS[getHighestUnlockedLevel()].name;
}
