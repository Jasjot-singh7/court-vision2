/* Court Vision — Score/Data (MVP)
   Uses sessionStorage so progress persists across pages WITHIN one
   browser session, but resets when the tab/browser closes. Persistent
   storage is a later-sprint (MAP) goal, not MVP.
*/

const PROGRESS_KEY = 'courtVisionProgress';

function getProgressData() {
  const raw = sessionStorage.getItem(PROGRESS_KEY);
  if (!raw) {
    return {
      totalCorrect: 0,
      totalAttempted: 0,
      recentActivity: [],
    };
  }
  return JSON.parse(raw);
}

function saveProgressData(data) {
  sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function recordAttempt(mode, scenarioTitle, wasCorrect) {
  const data = getProgressData();

  data.totalAttempted++;
  if (wasCorrect) data.totalCorrect++;

  const resultLabel = wasCorrect ? 'Correct' : 'Incorrect';
  data.recentActivity.unshift(`${mode}: ${scenarioTitle} — ${resultLabel}`);
  data.recentActivity = data.recentActivity.slice(0, 5);

  saveProgressData(data);
}

function getCurrentLevel(totalAttempted) {
  if (totalAttempted < 5) return 'Beginner';
  if (totalAttempted < 15) return 'Intermediate';
  return 'Advanced';
}
