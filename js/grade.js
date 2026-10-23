/* Court Vision — Colour grade toggle (MAP)
   The video gets a "cinematic" colour grade in CSS (see style.css). Some
   people prefer the original footage, so this adds a header button to switch
   it off. The choice is remembered.
*/

(function setupGradeToggle() {
  const nav = document.querySelector('header.site-header nav');
  if (!nav) return;

  let gradeOn = true;
  try { gradeOn = localStorage.getItem('courtVisionGrade') !== 'off'; } catch (e) {}

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sound-toggle';

  const refresh = () => {
    document.body.classList.toggle('no-grade', !gradeOn);
    btn.textContent = gradeOn ? 'Video look: Cinematic' : 'Video look: Original';
    btn.setAttribute('aria-pressed', String(gradeOn));
  };

  btn.addEventListener('click', () => {
    gradeOn = !gradeOn;
    try { localStorage.setItem('courtVisionGrade', gradeOn ? 'on' : 'off'); } catch (e) {}
    refresh();
  });

  refresh();
  nav.appendChild(btn);
})();
