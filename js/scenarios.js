/* Court Vision — Scenario Data (Levels)
   MVP note: trimmed to the first 3 of 10 scenarios from the
   Requirements/Specifications table, to keep the MVP small and testable.
   The remaining 7 are kept below, commented out, ready to restore for
   Sprint 2 (MMP) — see your Development Plan table: "Construct Levels
   2 and 3 with scaling difficulty curves."

   Every scenario currently points at the same placeholder clip
   (assets/videos/scenario1.mp4) since real footage isn't ready yet.
   Once real clips exist, just change each scenario's videoSrc to its
   own file — nothing else in the code needs to change.

   IMPORTANT: the "correct" answers and explanations below are my best
   guess at reasonable volleyball tactics based on your scenario
   descriptions — check these against what your coach (Bruce) would
   actually teach, and adjust the correct flags/explain text as needed.
*/

const scenarios = [
  {
    title: 'Setter Attack Choice',
    videoSrc: 'assets/videos/scenario1.mp4',
    decisionPointSeconds: 3,
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
    videoSrc: 'assets/videos/scenario1.mp4',
    decisionPointSeconds: 3,
    prompt: 'Do you commit to the middle attacker or stay with the outside hitter?',
    options: [
      { label: 'Commit to middle', correct: false, explain: 'The middle attack was a decoy this play.' },
      { label: 'Stay with outside', correct: true, explain: 'The outside was the primary threat based on the set.' },
    ],
  },
  {
    title: 'Serve Receive Positioning',
    videoSrc: 'assets/videos/scenario1.mp4',
    decisionPointSeconds: 3,
    prompt: 'Where do you move before receiving the serve?',
    options: [
      { label: 'Move forward', correct: false, explain: 'This leaves space behind you exposed to a deep serve.' },
      { label: 'Stay in base position', correct: true, explain: 'Base position covers the widest range of serve types.' },
      { label: 'Shift left', correct: false, explain: 'The server has not shown a tendency to target this zone.' },
    ],
  },
];

/* ----------------------------------------------------------------
   The remaining 7 scenarios — commented out for MVP, restore for
   Sprint 2 by moving these back above the closing "];" and deleting
   this comment block and the one around them.
   ----------------------------------------------------------------

  {
    title: 'Defensive Coverage',
    videoSrc: 'assets/videos/scenario1.mp4',
    decisionPointSeconds: 3,
    prompt: 'Your team just attacked. Where do you position yourself?',
    options: [
      { label: 'Cover the hitter', correct: true, explain: 'Covering protects against a blocked ball rebounding down.' },
      { label: 'Drop back to base defence', correct: false, explain: 'Too early — the ball hasn’t crossed the net yet.' },
      { label: 'Rotate to open zone', correct: false, explain: 'Coverage takes priority immediately after your own attack.' },
    ],
  },
  {
    title: 'Free Ball Communication',
    videoSrc: 'assets/videos/scenario1.mp4',
    decisionPointSeconds: 3,
    prompt: 'A free ball is coming over. What do you do?',
    options: [
      { label: 'Call "Mine!" and take it', correct: true, explain: 'Clear, early communication prevents collisions and confusion.' },
      { label: 'Call "Setter front row!"', correct: false, explain: 'That call is for a different situation — a setter penetrating from the front row.' },
      { label: 'Stay silent, let a teammate decide', correct: false, explain: 'Silence on a free ball risks two players going for it or neither.' },
    ],
  },
  {
    title: 'Serving Strategy',
    videoSrc: 'assets/videos/scenario1.mp4',
    decisionPointSeconds: 3,
    prompt: 'Which player do you target with your serve?',
    options: [
      { label: 'Target the weakest passer', correct: true, explain: 'Pressuring the weakest passer disrupts their offense most.' },
      { label: 'Target the strongest passer', correct: false, explain: 'This gives the opposition their best chance at a clean first-touch.' },
      { label: 'Serve down the middle', correct: false, explain: 'A generic serve gives no tactical advantage here.' },
    ],
  },
  {
    title: 'Backcourt Defensive Decision',
    videoSrc: 'assets/videos/scenario1.mp4',
    decisionPointSeconds: 3,
    prompt: 'Based on the attacker\'s approach, where do you move?',
    options: [
      { label: 'Move to line', correct: false, explain: 'The block is already covering the line on this play.' },
      { label: 'Move to angle', correct: true, explain: 'The attacker\'s approach angle suggests a cross-court shot.' },
      { label: 'Stay centred', correct: false, explain: 'Staying centred leaves the angle shot undefended.' },
    ],
  },
  {
    title: 'Emergency Save Situation',
    videoSrc: 'assets/videos/scenario1.mp4',
    decisionPointSeconds: 3,
    prompt: 'The ball is dropping fast and you are off balance. What do you do?',
    options: [
      { label: 'Bump it', correct: false, explain: 'Too little control in this position — risks an uncontrolled rebound.' },
      { label: 'Set it', correct: false, explain: 'Not enough time/control to execute a clean set here.' },
      { label: 'Free the ball back over', correct: true, explain: 'When under extreme pressure, safely returning the ball prevents a lost point.' },
    ],
  },
  {
    title: 'Transition Attack',
    videoSrc: 'assets/videos/scenario1.mp4',
    decisionPointSeconds: 3,
    prompt: 'Your team just defended successfully. What\'s the best attack option?',
    options: [
      { label: 'Quick attack', correct: true, explain: 'The block hasn\'t reset yet, so a fast tempo attack catches them out of position.' },
      { label: 'Outside swing', correct: false, explain: 'Slower tempo gives the block time to reset against this option.' },
      { label: 'High ball reset', correct: false, explain: 'Unnecessary here — the team is in a good position to attack immediately.' },
    ],
  },
  {
    title: 'Out of System Setting',
    videoSrc: 'assets/videos/scenario1.mp4',
    decisionPointSeconds: 3,
    prompt: 'The pass is off the net. Where do you set?',
    options: [
      { label: 'Opposite', correct: false, explain: 'The opposite is well covered here.' },
      { label: 'Outside', correct: true, explain: 'The outside hitter has the best matchup on this pass.' },
      { label: 'Pipe', correct: false, explain: 'Too risky off the net.' },
      { label: 'Middle over shoulder', correct: false, explain: 'The middle is blocked in this scenario.' },
    ],
  },

---------------------------------------------------------------- */
