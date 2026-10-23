/* Court Vision — Timer bar (Sprint 2, Core Mechanics)
   A bar that drains over the countdown length. It turns red for the last
   3 seconds, matching the number display. Needs a
   <div class="timer-bar"><div id="timerFill" class="timer-fill"></div></div>
*/

let timerUrgentTimeout = null;

function startTimerBar(seconds) {
  const fill = document.getElementById('timerFill');
  if (!fill) return;
  clearTimeout(timerUrgentTimeout);

  // Reset to full with no animation, then drain smoothly to empty
  fill.style.transition = 'none';
  fill.style.width = '100%';
  fill.classList.remove('urgent');
  void fill.offsetWidth; // force the browser to apply the reset first
  fill.style.transition = `width ${seconds}s linear`;
  fill.style.width = '0%';

  timerUrgentTimeout = setTimeout(() => fill.classList.add('urgent'), Math.max(0, seconds - 3) * 1000);
}

function stopTimerBar() {
  clearTimeout(timerUrgentTimeout);
  const fill = document.getElementById('timerFill');
  if (fill) {
    fill.style.transition = 'none';
    fill.style.width = '0%';
  }
}
