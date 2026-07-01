// Originally developed by Vishesh Singh — June 2026
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKwXd1HXx0oNriqUOfiP4FOHmNc9L1jbA",
  authDomain: "nutriglance.firebaseapp.com",
  projectId: "nutriglance",
  storageBucket: "nutriglance.firebasestorage.app",
  messagingSenderId: "878128108474",
  appId: "1:878128108474:web:76ff47c291dd19593a4383",
  measurementId: "G-C0B269SQFP"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  // Initialize analytics if available and supported
  if (typeof firebase.analytics === 'function') {
    firebase.analytics();
  }
}
window.auth = firebase.auth();
