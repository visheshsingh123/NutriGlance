/**
 * firebase-auth.js  —  NutriGlance shared auth + per-user storage
 *
 * Import this as a module in every page. It:
 *  1. Initialises Firebase once
 *  2. Guards every page (redirect to login.html if not signed in)
 *  3. Provides per-user localStorage helpers so each account's data
 *     is namespaced under their Firebase UID
 *  4. Exposes window.NG so plain <script> blocks can call helpers
 */

import { initializeApp }   from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut }
                           from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ── Firebase config ────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            'AIzaSyDKwXd1HXx0oNriqUOfiP4FOHmNc9L1jbA',
  authDomain:        'nutriglance.firebaseapp.com',
  projectId:         'nutriglance',
  storageBucket:     'nutriglance.firebasestorage.app',
  messagingSenderId: '878128108474',
  appId:             '1:878128108474:web:76ff47c291dd19593a4383',
  measurementId:     'G-C0B269SQFP',
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ── Per-user storage helpers ───────────────────────────────────────────────
// All keys are prefixed with the user's UID so accounts don't share data.

function uid() {
  return auth.currentUser?.uid || 'anonymous';
}

function userKey(key) {
  return `ng_${uid()}_${key}`;
}

const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(userKey(key));
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(userKey(key), JSON.stringify(value)); } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(userKey(key)); } catch {}
  },
  // Clear only THIS user's keys
  clearUser() {
    const prefix = `ng_${uid()}_`;
    Object.keys(localStorage)
      .filter(k => k.startsWith(prefix))
      .forEach(k => localStorage.removeItem(k));
  },
};

// ── Auth guard + bootstrap ─────────────────────────────────────────────────
// Pages call NG.ready(callback) — callback fires once user is confirmed.
// If not signed in, they're sent to login.html automatically.

function ready(callback) {
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    // Expose current user globally
    window.NG.user = user;
    callback(user);
  });
}

// ── Sign-out helper ────────────────────────────────────────────────────────
async function signOutUser() {
  await signOut(auth);
  window.location.href = 'login.html';
}

// ── Global NG namespace ────────────────────────────────────────────────────
window.NG = { store, ready, signOut: signOutUser, user: null, auth };
