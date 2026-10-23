/* Court Vision — Score/Data (Sprint 2)
   Uses sessionStorage so progress persists across pages WITHIN one browser
   session, but resets when the tab/browser closes. Persistent storage across
   visits is a later-sprint (MAP) goal.
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
  };
}

function getProgressData() {
  let data = emptyProgress();
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY);
    if (raw) data = Object.assign(emptyProgress(), JSON.parse(raw));
  } catch (e) { /* storage blocked or corrupt: start fresh */ }
  return data;
}

function saveProgressData(data) {
  try {
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
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
  try { sessionStorage.removeItem(PROGRESS_KEY); } catch (e) {}
}

function getCurrentLevel(totalAttempted) {
  if (totalAttempted < 5) return 'Beginner';
  if (totalAttempted < 15) return 'Intermediate';
  return 'Advanced';
}
