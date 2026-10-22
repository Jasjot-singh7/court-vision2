/* Court Vision — Scenario Data (Levels)
   All 10 scenarios, each playing a short section of a YouTube video.

   For each scenario:
     start      = second in the YouTube video where the clip begins
     decisionAt = second where the video pauses and the question appears
     end        = second where the clip stops (the play after the decision)
   Times are written t(minutes, seconds) so they match the YouTube player clock.
   Example: t(2, 11) is 2:11 on the video.

   IMPORTANT: the "correct" answers and explanations are still placeholders
   I wrote. Now that real footage is in, re-check each one against what
   actually happens in its clip (and with your coach) and adjust them.
*/

function t(minutes, seconds) {
  return minutes * 60 + seconds;
}

const SOURCES = {
  brazilJapan: {
    videoId: 'bGm1S2yQAxg',
    credit: "Brazil vs. Japan - Men's World Championship 2022 | Full Match - Volleyball (Volleyball World, YouTube)",
  },
  serves: {
    videoId: 'rchcsWcOayA',
    credit: 'Most Powerful Volleyball Serves by Kento Miyaura | VNL 2025 (Power Volleyball, YouTube)',
  },
};

const scenarios = [
  {
    title: 'Setter Attack Choice',
    ...SOURCES.brazilJapan,
    start: t(0, 18), decisionAt: t(0, 24), end: t(0, 26),
    prompt: 'You are the setter. Who do you set?',
    options: [
      { label: 'Outside', correct: true, explain: 'The outside hitter has a favourable one-on-one matchup.' },
      { label: 'Middle', correct: false, explain: 'The middle is well covered by the block here.' },
      { label: 'Opposite', correct: false, explain: 'The opposite is out of rhythm this play.' },
      { label: 'Pipe', correct: false, explain: 'Too risky from this pass quality.' },
    ],
  },
  {
    title: 'Blocking Decision',
    ...SOURCES.brazilJapan,
    start: t(2, 11), decisionAt: t(2, 18), end: t(2, 21),
    prompt: 'Do you commit to the middle attacker or stay with the outside hitter?',
    options: [
      { label: 'Commit to middle', correct: false, explain: 'The middle attack was a decoy this play.' },
      { label: 'Stay with outside', correct: true, explain: 'The outside was the primary threat based on the set.' },
    ],
  },
  {
    title: 'Serve Receive Positioning',
    ...SOURCES.brazilJapan,
    start: t(2, 35), decisionAt: t(2, 39), end: t(2, 43),
    prompt: 'Where do you move before receiving the serve?',
    options: [
      { label: 'Move forward', correct: false, explain: 'This leaves space behind you exposed to a deep serve.' },
      { label: 'Stay in base position', correct: true, explain: 'Base position covers the widest range of serve types.' },
      { label: 'Shift left', correct: false, explain: 'The server has not shown a tendency to target this zone.' },
    ],
  },
  {
    title: 'Defensive Coverage',
    ...SOURCES.brazilJapan,
    start: t(5, 11), decisionAt: t(5, 16), end: t(5, 24),
    prompt: 'Your team just attacked. Where do you position yourself?',
    options: [
      { label: 'Cover the hitter', correct: true, explain: 'Covering protects against a blocked ball rebounding down.' },
      { label: 'Drop back to base defence', correct: false, explain: 'Too early — the ball hasn’t crossed the net yet.' },
      { label: 'Rotate to open zone', correct: false, explain: 'Coverage takes priority immediately after your own attack.' },
    ],
  },
  {
    title: 'Free Ball Communication',
    ...SOURCES.brazilJapan,
    start: t(8, 8), decisionAt: t(8, 14), end: t(8, 20),
    prompt: 'A free ball is coming over. What do you do?',
    options: [
      { label: 'Call "Mine!" and take it', correct: true, explain: 'Clear, early communication prevents collisions and confusion.' },
      { label: 'Call "Setter front row!"', correct: false, explain: 'That call is for a different situation — a setter penetrating from the front row.' },
      { label: 'Stay silent, let a teammate decide', correct: false, explain: 'Silence on a free ball risks two players going for it or neither.' },
    ],
  },
  {
    title: 'Serving Strategy',
    ...SOURCES.serves,
    start: t(0, 0), decisionAt: t(0, 4), end: t(0, 9),
    prompt: 'Which player do you target with your serve?',
    options: [
      { label: 'Target the weakest passer', correct: true, explain: 'Pressuring the weakest passer disrupts their offense most.' },
      { label: 'Target the strongest passer', correct: false, explain: 'This gives the opposition their best chance at a clean first-touch.' },
      { label: 'Serve down the middle', correct: false, explain: 'A generic serve gives no tactical advantage here.' },
    ],
  },
  {
    title: 'Backcourt Defensive Decision',
    ...SOURCES.brazilJapan,
    start: t(21, 0), decisionAt: t(21, 7), end: t(21, 11),
    prompt: 'Based on the attacker\'s approach, where do you move?',
    options: [
      { label: 'Move to line', correct: false, explain: 'The block is already covering the line on this play.' },
      { label: 'Move to angle', correct: true, explain: 'The attacker\'s approach angle suggests a cross-court shot.' },
      { label: 'Stay centred', correct: false, explain: 'Staying centred leaves the angle shot undefended.' },
    ],
  },
  {
    title: 'Transition Attack',
    ...SOURCES.brazilJapan,
    start: t(20, 45), decisionAt: t(20, 50), end: t(20, 53),
    prompt: 'Your team just defended successfully. What\'s the best attack option?',
    options: [
      { label: 'Quick attack', correct: true, explain: 'The block hasn\'t reset yet, so a fast tempo attack catches them out of position.' },
      { label: 'Outside swing', correct: false, explain: 'Slower tempo gives the block time to reset against this option.' },
      { label: 'High ball reset', correct: false, explain: 'Unnecessary here — the team is in a good position to attack immediately.' },
    ],
  },
  {
    title: 'Out of System Setting',
    ...SOURCES.brazilJapan,
    start: t(19, 48), decisionAt: t(19, 51), end: t(19, 54),
    prompt: 'The pass is off the net. Where do you set?',
    options: [
      { label: 'Opposite', correct: false, explain: 'The opposite is well covered here.' },
      { label: 'Outside', correct: true, explain: 'The outside hitter has the best matchup on this pass.' },
      { label: 'Pipe', correct: false, explain: 'Too risky off the net.' },
      { label: 'Middle over shoulder', correct: false, explain: 'The middle is blocked in this scenario.' },
    ],
  },
  {
    title: 'Emergency Save Situation',
    ...SOURCES.brazilJapan,
    start: t(19, 49), decisionAt: t(19, 54), end: t(19, 59),
    prompt: 'The ball is dropping fast and you are off balance. What do you do?',
    options: [
      { label: 'Bump it', correct: false, explain: 'Too little control in this position — risks an uncontrolled rebound.' },
      { label: 'Set it', correct: false, explain: 'Not enough time/control to execute a clean set here.' },
      { label: 'Free the ball back over', correct: true, explain: 'When under extreme pressure, safely returning the ball prevents a lost point.' },
    ],
  },
];

// The distinct video credits, for the end-of-mode credits list
function getUniqueCredits() {
  return [...new Set(scenarios.map(s => s.credit))];
}
