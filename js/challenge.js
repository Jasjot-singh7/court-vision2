/* Court Vision — Core Mechanics for Challenge Mode (MVP + Levels)
   Uses the same shared scenarios list as Training Mode (scenarios.js,
   loaded before this file) — but NO feedback shown per scenario, only
   a final score once every scenario is complete.
*/

const COUNTDOWN_SECONDS = 5;

let currentIndex = 0;
let correctCount = 0;
let hasPausedForDecision = false;
let countdownInterval = null;
let timeRemaining = COUNTDOWN_SECONDS;

const video = document.getElementById('scenarioVideo');
const decisionPanel = document.getElementById('decisionPanel');
const timerDisplay = document.getElementById('timerDisplay');
const promptDisplay = document.getElementById('promptDisplay');
const optionsContainer = document.getElementById('optionsContainer');
const scenarioCounter = document.getElementById('scenarioCounter');
const resultsPanel = document.getElementById('resultsPanel');
const resultsText = document.getElementById('resultsText');

loadScenario(currentIndex);

function loadScenario(index) {
  hasPausedForDecision = false;
  const scenario = scenarios[index];

  scenarioCounter.textContent = `Scenario ${index + 1} of ${scenarios.length}`;
  promptDisplay.textContent = scenario.prompt;
  decisionPanel.classList.add('hidden');

  optionsContainer.innerHTML = '';
  scenario.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'decision-btn';
    btn.textContent = option.label;
    btn.dataset.correct = option.correct;
    btn.addEventListener('click', () => handleDecision(btn));
    optionsContainer.appendChild(btn);
  });

  video.src = scenario.videoSrc;
  video.load();
  video.play();
}

video.addEventListener('timeupdate', () => {
  const decisionPoint = scenarios[currentIndex].decisionPointSeconds;
  if (!hasPausedForDecision && video.currentTime >= decisionPoint) {
    hasPausedForDecision = true;
    video.pause();
    showDecisionPoint();
  }
});

function showDecisionPoint() {
  decisionPanel.classList.remove('hidden');
  timeRemaining = COUNTDOWN_SECONDS;
  timerDisplay.textContent = timeRemaining;

  countdownInterval = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      handleDecision(null);
    }
  }, 1000);
}

function handleDecision(chosenButton) {
  clearInterval(countdownInterval);

  const scenario = scenarios[currentIndex];
  const wasCorrect = !!(chosenButton && chosenButton.dataset.correct === 'true');
  if (wasCorrect) correctCount++;

  recordAttempt('Challenge', scenario.title, wasCorrect);

  currentIndex++;

  if (currentIndex < scenarios.length) {
    loadScenario(currentIndex);
  } else {
    showFinalResults();
  }
}

function showFinalResults() {
  video.classList.add('hidden');
  decisionPanel.classList.add('hidden');
  scenarioCounter.classList.add('hidden');
  resultsPanel.classList.remove('hidden');
  resultsText.textContent = `You got ${correctCount} out of ${scenarios.length} correct.`;
}
