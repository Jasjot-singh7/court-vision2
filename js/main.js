/* Court Vision — Core Mechanics for Training Mode (MVP + Levels)
   Steps through every scenario in scenarios.js (loaded before this file).
   Unlike Challenge Mode, feedback IS shown immediately after each pick,
   plus a "Next Scenario" button to move on at the learner's own pace.
*/

const video = document.getElementById('scenarioVideo');
const decisionPanel = document.getElementById('decisionPanel');
const timerDisplay = document.getElementById('timerDisplay');
const promptDisplay = document.getElementById('promptDisplay');
const optionsContainer = document.getElementById('optionsContainer');
const scenarioCounter = document.getElementById('scenarioCounter');
const feedbackDisplay = document.getElementById('feedbackDisplay');
const nextBtn = document.getElementById('nextBtn');
const completePanel = document.getElementById('completePanel');

const COUNTDOWN_SECONDS = 5;

let currentIndex = 0;
let hasPausedForDecision = false;
let countdownInterval = null;
let timeRemaining = COUNTDOWN_SECONDS;

loadScenario(currentIndex);

function loadScenario(index) {
  hasPausedForDecision = false;
  feedbackDisplay.textContent = '';
  feedbackDisplay.className = 'feedback';
  nextBtn.classList.add('hidden');
  decisionPanel.classList.add('hidden');

  const scenario = scenarios[index];
  scenarioCounter.textContent = `Scenario ${index + 1} of ${scenarios.length}: ${scenario.title}`;
  promptDisplay.textContent = scenario.prompt;

  optionsContainer.innerHTML = '';
  scenario.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'decision-btn';
    btn.textContent = option.label;
    btn.dataset.correct = option.correct;
    btn.dataset.explain = option.explain;
    btn.addEventListener('click', () => handleDecision(btn));
    optionsContainer.appendChild(btn);
  });

  video.src = scenario.videoSrc;
  video.classList.remove('hidden');
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
  decisionPanel.classList.add('hidden');

  const scenario = scenarios[currentIndex];
  let wasCorrect = false;

  if (!chosenButton) {
    feedbackDisplay.textContent = "Time's up! Try to decide faster next time.";
    feedbackDisplay.className = 'feedback incorrect';
  } else {
    wasCorrect = chosenButton.dataset.correct === 'true';
    feedbackDisplay.textContent = (wasCorrect ? 'Correct! ' : 'Not quite. ') + chosenButton.dataset.explain;
    feedbackDisplay.className = wasCorrect ? 'feedback correct' : 'feedback incorrect';
  }

  recordAttempt('Training', scenario.title, wasCorrect);

  if (currentIndex < scenarios.length - 1) {
    nextBtn.classList.remove('hidden');
  } else {
    video.classList.add('hidden');
    completePanel.classList.remove('hidden');
  }
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  loadScenario(currentIndex);
});
