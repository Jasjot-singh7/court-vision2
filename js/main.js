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
const videoWrap = document.getElementById('videoWrap');
const playerMessage = document.getElementById('playerMessage');
const skipBtn = document.getElementById('skipBtn');

const level = getRequestedLevel();
if (!level || !isLevelUnlocked(level)) {
  location.replace('levels.html?mode=training');
}
const levelScenarios = level ? getScenariosForLevel(level) : [];
const levelBadge = document.getElementById('levelBadge');
if (level) {
  levelBadge.textContent = `Level ${level}: ${LEVELS[level].name} · ${LEVELS[level].seconds} seconds per decision`;
  document.getElementById('howSeconds').textContent = LEVELS[level].seconds;
}
const replayBtn = document.getElementById('replayBtn');
const REPLAYS_ALLOWED = Infinity; // Training: unlimited. Challenge: once per scenario.
let replaysLeft = REPLAYS_ALLOWED;
const COUNTDOWN_SECONDS = level ? LEVELS[level].seconds : 10;

let currentIndex = 0;
let correctCount = 0;
let runRecorded = false;
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
  playSound('start');
  started = true;
  startPanel.classList.add('hidden');
  scenarioCounter.classList.remove('hidden');
  loadScenario(0);
});

function loadScenario(index) {
  const scenario = levelScenarios[index];

  feedbackDisplay.textContent = '';
  feedbackDisplay.className = 'feedback';
  playerMessage.classList.add('hidden');
  nextBtn.classList.add('hidden');
  decisionPanel.classList.add('hidden');
  skipBtn.classList.remove('hidden');

  scenarioCounter.textContent = `Scenario ${index + 1} of ${levelScenarios.length}: ${scenario.title}`;
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

function updateReplayButton() {
  replayBtn.disabled = replaysLeft <= 0;
  replayBtn.textContent = REPLAYS_ALLOWED === Infinity
    ? 'Replay last 4 seconds'
    : `Replay last 4 seconds (${replaysLeft} left)`;
}

replayBtn.addEventListener('click', () => {
  if (replaysLeft <= 0) return;
  replaysLeft--;
  updateReplayButton();
  replayClip(levelScenarios[currentIndex]);
});

function showDecisionPoint() {
  replaysLeft = REPLAYS_ALLOWED;
  updateReplayButton();
  playSound('decision');
  decisionPanel.classList.remove('hidden');
  startTimerBar(COUNTDOWN_SECONDS);
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
  stopTimerBar();
  decisionPanel.classList.add('hidden');
  skipBtn.classList.add('hidden');

  const scenario = levelScenarios[currentIndex];
  let wasCorrect = false;

  if (!chosenButton) {
    feedbackDisplay.textContent = "Time's up! Try to decide faster next time.";
    feedbackDisplay.className = 'feedback incorrect';
    playSound('timeout');
  } else {
    wasCorrect = chosenButton.dataset.correct === 'true';
    if (wasCorrect) correctCount++;
    feedbackDisplay.textContent = (wasCorrect ? 'Correct! ' : 'Not quite. ') + chosenButton.dataset.explain;
    feedbackDisplay.className = wasCorrect ? 'feedback correct' : 'feedback incorrect';
    playSound(wasCorrect ? 'correct' : 'incorrect');
  }

  recordAttempt('Training', scenario.title, wasCorrect);

  resumeClip(); // play the moments after the decision
  showNextOrFinish();
}

function showNextOrFinish() {
  if (currentIndex < levelScenarios.length - 1) {
    nextBtn.classList.remove('hidden');
  } else {
    let message = `You got ${correctCount} out of ${levelScenarios.length} correct on ${LEVELS[level].name}.`;
    if (!runRecorded) {
      runRecorded = true;
      message += levelResultMessage(correctCount, levelScenarios.length);
    }
    completeText.textContent = message;
    creditsList.innerHTML = '';
    getUniqueCredits(levelScenarios).forEach(credit => {
      const li = document.createElement('li');
      li.textContent = credit;
      creditsList.appendChild(li);
    });
    completePanel.classList.remove('hidden');
    playSound('complete');
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

skipBtn.addEventListener('click', () => {
  clearInterval(countdownInterval);
  stopTimerBar();
  stopClip();
  decisionPanel.classList.add('hidden');
  skipBtn.classList.add('hidden');
  if (currentIndex < levelScenarios.length - 1) {
    currentIndex++;
    loadScenario(currentIndex);
  } else {
    videoWrap.classList.add('hidden');
    showNextOrFinish();
  }
});

function levelResultMessage(correct, total) {
  const run = recordLevelRun(level, correct, total);
  if (run.newlyUnlocked) {
    return ` Level ${run.newlyUnlocked} (${LEVELS[run.newlyUnlocked].name}) unlocked!`;
  }
  if (!run.passed) {
    return ` Get at least ${PASS_PERCENT}% to unlock the next level.`;
  }
  return '';
}
