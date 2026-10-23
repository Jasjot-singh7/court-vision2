/* Court Vision — Progress page display logic */

const data = getProgressData();

const accountUser = getCurrentUser();
document.getElementById('accountNote').textContent = accountUser
  ? `Saved to ${accountUser}'s account on this device.`
  : 'You are a guest, so progress clears when you close the tab. Log in to save it.';

const emptyState = document.getElementById('emptyState');
const statsWrapper = document.getElementById('statsWrapper');

function percent(correct, attempted) {
  return attempted === 0 ? null : Math.round((correct / attempted) * 100);
}

function show(id, text) {
  document.getElementById(id).textContent = text;
}

if (data.totalAttempted === 0) {
  emptyState.classList.remove('hidden');
  statsWrapper.classList.add('hidden');
} else {
  const accuracy = percent(data.totalCorrect, data.totalAttempted);

  show('accuracyDisplay', `${accuracy}%`);
  show('completedDisplay', data.totalAttempted);
  show('levelDisplay', getCurrentLevel());
  show('bestDisplay', data.bestChallenge
    ? `${data.bestChallenge.correct}/${data.bestChallenge.total}`
    : '—');
  document.getElementById('accuracyBar').style.width = `${accuracy}%`;

  // Per-mode table
  const modeBody = document.getElementById('modeBody');
  ['Training', 'Challenge'].forEach(mode => {
    const m = data.byMode[mode] || { attempted: 0, correct: 0 };
    const p = percent(m.correct, m.attempted);
    const tr = document.createElement('tr');
    [mode, m.attempted, p === null ? '—' : `${p}%`].forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    modeBody.appendChild(tr);
  });

  // Per-level table
  const levelBody = document.getElementById('levelBody');
  Object.keys(LEVELS).forEach(n => {
    const level = Number(n);
    const best = data.levelBest[level];
    const status = !isLevelUnlocked(level) ? 'Locked' : (levelPassed(level) ? 'Passed' : 'Open');
    const tr = document.createElement('tr');
    [`${level}. ${LEVELS[level].name}`, best ? `${best.correct}/${best.total}` : '—', status].forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    levelBody.appendChild(tr);
  });

  // Per-scenario table, weakest first so users know what to practise
  const scenarioBody = document.getElementById('scenarioBody');
  Object.entries(data.byScenario)
    .map(([title, s]) => ({ title, attempted: s.attempted, p: percent(s.correct, s.attempted) }))
    .sort((a, b) => a.p - b.p)
    .forEach(row => {
      const tr = document.createElement('tr');
      [row.title, row.attempted, `${row.p}%`].forEach(text => {
        const td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
      });
      scenarioBody.appendChild(tr);
    });

  // Recent activity
  const activityList = document.getElementById('activityList');
  data.recentActivity.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry;
    activityList.appendChild(li);
  });
}

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset all your progress for this session?')) {
    resetProgress();
    location.reload();
  }
});
