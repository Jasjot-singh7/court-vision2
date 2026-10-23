/* Court Vision — Login / accounts (Sprint 2, Core Mechanics)
   IMPORTANT: this site has no server, so accounts are stored in THIS
   browser's localStorage. That means:
   - progress is saved between visits on the same device and browser
   - it does NOT follow you to another device
   - the password is hashed (SHA-256 + salt) but this is NOT secure
     authentication. It stops casual snooping only. Real accounts with a
     database are a Sprint 3 (MAP) goal.
*/

const USERS_KEY = 'courtVisionUsers';
const CURRENT_USER_KEY = 'courtVisionCurrentUser';

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
  catch (e) { return {}; }
}

function saveUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); return true; }
  catch (e) { return false; }
}

// Returns the logged-in display name, or null for a guest
function getCurrentUser() {
  try {
    const key = localStorage.getItem(CURRENT_KEY_NAME());
    if (!key) return null;
    const user = loadUsers()[key];
    return user ? user.displayName : null;
  } catch (e) { return null; }
}

function CURRENT_KEY_NAME() { return CURRENT_USER_KEY; }

// Storage key used for the logged-in user's progress
function getCurrentUserKey() {
  try { return localStorage.getItem(CURRENT_USER_KEY); }
  catch (e) { return null; }
}

function randomSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

function validateName(name) {
  if (!/^[A-Za-z0-9_ ]{3,20}$/.test(name)) {
    return 'Username must be 3-20 letters, numbers, spaces or underscores.';
  }
  return null;
}

async function registerUser(name, password) {
  name = name.trim();
  const nameError = validateName(name);
  if (nameError) return { ok: false, message: nameError };
  if (password.length < 4) return { ok: false, message: 'Password must be at least 4 characters.' };
  if (!window.crypto || !crypto.subtle) {
    return { ok: false, message: 'This browser cannot create accounts securely. Try a newer browser.' };
  }

  const users = loadUsers();
  const key = name.toLowerCase();
  if (users[key]) return { ok: false, message: 'That username is already taken.' };

  const salt = randomSalt();
  users[key] = { displayName: name, salt, hash: await hashPassword(password, salt) };
  if (!saveUsers(users)) return { ok: false, message: 'Could not save your account (browser storage is blocked).' };

  // Carry any guest progress from this visit into the new account
  try {
    const guest = sessionStorage.getItem('courtVisionProgress');
    if (guest) localStorage.setItem('courtVisionProgress:' + key, guest);
    localStorage.setItem(CURRENT_USER_KEY, key);
  } catch (e) { /* ignore */ }

  return { ok: true };
}

async function loginUser(name, password) {
  const key = name.trim().toLowerCase();
  const user = loadUsers()[key];
  if (!user || !window.crypto || !crypto.subtle) {
    return { ok: false, message: 'Username or password is incorrect.' };
  }
  const hash = await hashPassword(password, user.salt);
  if (hash !== user.hash) return { ok: false, message: 'Username or password is incorrect.' };

  try { localStorage.setItem(CURRENT_USER_KEY, key); } catch (e) {}
  return { ok: true };
}

function logoutUser() {
  try { localStorage.removeItem(CURRENT_USER_KEY); } catch (e) {}
}

// Header: "Log in" link for guests, "Hi, name" + Log out for users
(function addAccountControls() {
  const nav = document.querySelector('header.site-header nav');
  if (!nav) return;

  const user = getCurrentUser();

  if (user) {
    const hi = document.createElement('span');
    hi.className = 'account-name';
    hi.textContent = `Hi, ${user}`;

    const out = document.createElement('button');
    out.type = 'button';
    out.className = 'sound-toggle';
    out.textContent = 'Log out';
    out.addEventListener('click', () => {
      logoutUser();
      location.href = 'index.html';
    });

    nav.appendChild(hi);
    nav.appendChild(out);
  } else {
    const link = document.createElement('a');
    link.href = 'login.html';
    link.textContent = 'Log in';
    if (location.pathname.endsWith('login.html')) link.className = 'active';
    nav.appendChild(link);
  }
})();
