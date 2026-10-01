/* Court Vision — Score/Data (MVP)
   Sprint 1 goal: "Initialize simple session variables (e.g., simple
   timer/score text)."

   Uses sessionStorage so progress persists across pages WITHIN one
   browser session, but resets when the tab/browser closes. This is
   intentional for MVP — persistent storage (local or cloud) is a
   Sprint 3 / MAP goal per your Development Plan table, not MVP.

   Shared by training.html, challenge.html, and progress.html.
*/

const PROGRESS_KEY = 'courtVisionProgress';

function getProgressData() {
  const raw = sessionStorage.getItem(PROGRESS_KEY);
  if (!raw) {
    return {
      totalCorrect: 0,
      totalAttempted: 0,
      recentActivity: [], // array of short strings, most recent first
    };
  }
  return JSON.parse(raw);
}

function saveProgressData(data) {
  sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

/**
 * Records the result of one scenario attempt (call this once per
 * decision made, in both Training and Challenge Mode).
 */
function recordAttempt(mode, scenarioTitle, wasCorrect) {
  const data = getProgressData();

  data.totalAttempted++;
  if (wasCorrect) data.totalCorrect++;

  const resultLabel = wasCorrect ? 'Correct' : 'Incorrect';
  data.recentActivity.unshift(`${mode}: ${scenarioTitle} — ${resultLabel}`);
  data.recentActivity = data.recentActivity.slice(0, 5); // keep last 5 only

  saveProgressData(data);
}

/**
 * Simple placeholder level logic based on scenarios attempted so far.
 * Matches your difficulty requirement (beginner/intermediate/advanced)
 * at a basic MVP level — real difficulty-based scenario selection is
 * a later-sprint improvement.
 */
function getCurrentLevel(totalAttempted) {
  if (totalAttempted < 5) return 'Beginner';
  if (totalAttempted < 15) return 'Intermediate';
  return 'Advanced';
}
