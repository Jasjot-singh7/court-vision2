/* Court Vision — Challenge Mode (YouTube player version)
   Same clips and countdown as Training Mode, but NO feedback per scenario
   (and no outcome clip, which would give the answer away). Only a final
   score once every scenario is complete.
*/

const startPanel = document.getElementById('startPanel');
const startBtn = document.getElementById('startBtn');
const videoWrap = document.getElementById('videoWrap');
const decisionPanel = document.getElementById('decisionPanel');
const timerDisplay = document.getElementById('timerDisplay');
const promptDisplay = document.getElementById('promptDisplay');
const optionsContainer = document.getElementById('optionsContainer');
const scenarioCounter = document.getElementById('scenarioCounter');
const videoCredit = document.getElementById('videoCredit');
const playerMessage = document.getElementById('playerMessage');
const skipBtn = document.getElementById('skipBtn');
const resultsPanel = document.getElementById('resultsPanel');
const resultsText = document.getElementById('resultsText');
const creditsList = document.getElementById('creditsList');

const COUNTDOWN_SECONDS = 10;

let currentIndex = 0;
let correctCount = 0;
let started = false;
let countdownInterval = null;
let timeRemaining = COUNTDOWN_SECONDS;

startBtn.disabled = true;
startBtn.textContent = 'Loading video player...';

loadYouTubeApi(
  () => {
    startBtn.disabled = false;
    startBtn.textContent = 'Start Challenge';
  },
  showPlayerProblem
);

startBtn.addEventListener('click', () => {
  playSound('start');
  started = true;
  startPanel.classList.add('hidden');
  scenarioCounter.classList.remove('hidden');
  loadScenario(0);
});

function loadScenario(index) {
  const scenario = scenarios[index];

  playerMessage.classList.add('hidden');
  skipBtn.classList.remove('hidden');
  decisionPanel.classList.add('hidden');

  scenarioCounter.textContent = `Scenario ${index + 1} of ${scenarios.length}`;
  promptDisplay.textContent = scenario.prompt;
  videoCredit.textContent = `Video: ${scenario.credit}`;

  optionsContainer.innerHTML = '';
  scenario.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'decision-btn';
    btn.textContent = option.label;
    btn.dataset.correct = option.correct;
    btn.addEventListener('click', () => handleDecision(btn));
    optionsContainer.appendChild(btn);
  });

  playClip(scenario, showDecisionPoint);
}

function showDecisionPoint() {
  playSound('decision');
  decisionPanel.classList.remove('hidden');
  timeRemaining = COUNTDOWN_SECONDS;
  timerDisplay.textContent = timeRemaining;
  timerDisplay.classList.remove('urgent');

  countdownInterval = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = timeRemaining;
    timerDisplay.classList.toggle('urgent', timeRemaining <= 3);
    if (timeRemaining > 0 && timeRemaining <= 3) playSound('tick');
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
  // Neutral sound only: Challenge Mode must not reveal right or wrong
  playSound(chosenButton ? 'select' : 'timeout');

  goToNextScenario();
}

function goToNextScenario() {
  currentIndex++;

  if (currentIndex < scenarios.length) {
    loadScenario(currentIndex);
  } else {
    showFinalResults();
  }
}

function showFinalResults() {
  stopClip();
  skipBtn.classList.add('hidden');
  videoWrap.classList.add('hidden');
  videoCredit.classList.add('hidden');
  decisionPanel.classList.add('hidden');
  scenarioCounter.classList.add('hidden');

  resultsText.textContent = `You got ${correctCount} out of ${scenarios.length} correct.`;
  creditsList.innerHTML = '';
  getUniqueCredits().forEach(credit => {
    const li = document.createElement('li');
    li.textContent = credit;
    creditsList.appendChild(li);
  });
  resultsPanel.classList.remove('hidden');
  recordChallengeScore(correctCount, scenarios.length);
  playSound('complete');
}

function showPlayerProblem(message) {
  playerMessage.textContent = message;
  playerMessage.classList.remove('hidden');

  // If a video fails part-way through, let the user skip it (not counted)
  if (started) {
    stopClip();
    clearInterval(countdownInterval);
    decisionPanel.classList.add('hidden');
    skipBtn.classList.remove('hidden');
  }
}

skipBtn.addEventListener('click', () => {
  clearInterval(countdownInterval);
  stopClip();
  goToNextScenario();
});
