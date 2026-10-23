/* Court Vision — Login page logic */

const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubmit = document.getElementById('authSubmit');
const authMessage = document.getElementById('authMessage');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loggedInPanel = document.getElementById('loggedInPanel');
const loggedInName = document.getElementById('loggedInName');

let mode = 'login';

function setMode(newMode) {
  mode = newMode;
  const isLogin = mode === 'login';
  tabLogin.classList.toggle('active', isLogin);
  tabRegister.classList.toggle('active', !isLogin);
  tabLogin.setAttribute('aria-selected', String(isLogin));
  tabRegister.setAttribute('aria-selected', String(!isLogin));
  authTitle.textContent = isLogin ? 'Log in' : 'Create an account';
  authSubmit.textContent = isLogin ? 'Log in' : 'Create account';
  passwordInput.autocomplete = isLogin ? 'current-password' : 'new-password';
  authMessage.textContent = '';
}

tabLogin.addEventListener('click', () => setMode('login'));
tabRegister.addEventListener('click', () => setMode('register'));

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  authMessage.textContent = '';
  authSubmit.disabled = true;

  const result = mode === 'login'
    ? await loginUser(usernameInput.value, passwordInput.value)
    : await registerUser(usernameInput.value, passwordInput.value);

  authSubmit.disabled = false;

  if (result.ok) {
    location.href = 'index.html';
  } else {
    authMessage.textContent = result.message;
  }
});

// Already logged in: show a message instead of the form
const current = getCurrentUser();
if (current) {
  authForm.classList.add('hidden');
  document.getElementById('authTabs').classList.add('hidden');
  authTitle.classList.add('hidden');
  loggedInName.textContent = current;
  loggedInPanel.classList.remove('hidden');
}
