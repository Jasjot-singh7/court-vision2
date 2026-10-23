/* Court Vision — Navigation (MAP)
   Combines both trialled techniques: a horizontal top bar on wide screens
   that turns into a hamburger menu on narrow screens (phones).
   Also adds: a "skip to main content" link, aria-current on the page you're
   on, and keyboard support (Escape closes the menu).
*/

(function setupNavigation() {
  const header = document.querySelector('header.site-header');
  const nav = header && header.querySelector('nav');
  const main = document.querySelector('main');
  if (!header || !nav) return;

  // Skip link for keyboard and screen-reader users
  if (main) {
    main.id = main.id || 'main';
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#' + main.id;
    skip.textContent = 'Skip to main content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  // Mark the current page. Levels page counts as the mode you came from.
  const file = location.pathname.split('/').pop() || 'index.html';
  const params = new URLSearchParams(location.search);
  let currentFile = file;
  if (file === 'levels.html') {
    currentFile = (params.get('mode') === 'challenge') ? 'challenge.html' : 'training.html';
  }
  nav.querySelectorAll('a').forEach(link => {
    const target = link.getAttribute('href').split('?')[0];
    const isCurrent = target === currentFile;
    link.classList.toggle('active', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  // Hamburger button (only visible on narrow screens, see style.css)
  nav.id = nav.id || 'site-nav';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-controls', nav.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Menu');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  header.insertBefore(toggle, nav);

  function setOpen(open) {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => setOpen(!header.classList.contains('nav-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 700) setOpen(false); });
})();
