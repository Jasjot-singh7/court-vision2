/* Court Vision — Progress page display logic */

const data = getProgressData();

const accuracyDisplay = document.getElementById('accuracyDisplay');
const completedDisplay = document.getElementById('completedDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const activityList = document.getElementById('activityList');
const emptyState = document.getElementById('emptyState');
const statsWrapper = document.getElementById('statsWrapper');

if (data.totalAttempted === 0) {
  emptyState.classList.remove('hidden');
  statsWrapper.classList.add('hidden');
} else {
  const accuracyPercent = Math.round((data.totalCorrect / data.totalAttempted) * 100);

  accuracyDisplay.textContent = `${accuracyPercent}%`;
  completedDisplay.textContent = data.totalAttempted;
  levelDisplay.textContent = getCurrentLevel(data.totalAttempted);

  activityList.innerHTML = '';
  data.recentActivity.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry;
    activityList.appendChild(li);
  });
}
