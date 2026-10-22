/* Court Vision — Training Mode (YouTube player version)
   Steps through every scenario in scenarios.js. Each scenario plays a short
   YouTube clip, pauses at the decision point, runs a countdown, shows
   feedback, then plays the outcome. A Start button begins the first clip
   (browsers only allow video to start after a click).
*/

const startPanel = document.getElementById('startPanel');
const startBtn = document.getElementById('startBtn');
const decisionPanel = document.getElementById('decisionPanel');
const timerDisplay = document.getElementById('timerDisplay');
const promptDisplay = document.getElementById('promptDisplay');
const optionsContainer = document.getElementById('optionsContainer');
const scenarioCounter = document.getElementById('scenarioCounter');
const feedbackDisplay = document.getElementById('feedbackDisplay');
const nextBtn = document.getElementById('nextBtn');
const completePanel = document.getElementById('completePanel');
const completeText = document.getElementById('completeText');
const creditsList = document.getElementById('creditsList');
const videoCredit = document.getElementById('videoCredit');
const playerMessage = document.getElementById('playerMessage');

const COUNTDOWN_SECONDS = 10;

let currentIndex = 0;
let started = false;
let countdownInterval = null;
let timeRemaining = COUNTDOWN_SECONDS;

startBtn.disabled = true;
startBtn.textContent = 'Loading video player...';

loadYouTubeApi(
  () => {
    startBtn.disabled = false;
    startBtn.textContent = 'Start Training';
  },
  showPlayerProblem
);

startBtn.addEventListener('click', () => {
  started = true;
  startPanel.classList.add('hidden');
  scenarioCounter.classList.remove('hidden');
  loadScenario(0);
});

function loadScenario(index) {
  const scenario = scenarios[index];

  feedbackDisplay.textContent = '';
  feedbackDisplay.className = 'feedback';
  playerMessage.classList.add('hidden');
  nextBtn.classList.add('hidden');
  decisionPanel.classList.add('hidden');

  scenarioCounter.textContent = `Scenario ${index + 1} of ${scenarios.length}: ${scenario.title}`;
  promptDisplay.textContent = scenario.prompt;
  videoCredit.textContent = `Video: ${scenario.credit}`;

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

  playClip(scenario, showDecisionPoint);
}

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

  resumeClip(); // play the moments after the decision
  showNextOrFinish();
}

function showNextOrFinish() {
  if (currentIndex < scenarios.length - 1) {
    nextBtn.classList.remove('hidden');
  } else {
    completeText.textContent = `You've been through all ${scenarios.length} scenarios.`;
    creditsList.innerHTML = '';
    getUniqueCredits().forEach(credit => {
      const li = document.createElement('li');
      li.textContent = credit;
      creditsList.appendChild(li);
    });
    completePanel.classList.remove('hidden');
  }
}

function showPlayerProblem(message) {
  playerMessage.textContent = message;
  playerMessage.classList.remove('hidden');

  // If a video fails part-way through, let the user skip to the next one
  if (started) {
    stopClip();
    clearInterval(countdownInterval);
    decisionPanel.classList.add('hidden');
    showNextOrFinish();
  }
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  loadScenario(currentIndex);
});
