import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// --- SYSTEM BOOT SEQUENCE (Console Easter Egg) ---
// Petit clin d'œil pour les développeurs qui ouvriront la console (F12)
if (import.meta.env.DEV) {
  console.clear();
  console.log(
    '%c KMERLEX %c v1.0.0 %c SYSTEM ONLINE ',
    'background:#051A14; color:#00E676; font-weight:bold; padding:4px 8px; border-radius:4px 0 0 4px;',
    'background:#00E676; color:#051A14; font-weight:bold; padding:4px 8px;',
    'background:#051A14; color:#7CFFB2; padding:4px 8px; border-radius:0 4px 4px 0;'
  );
  console.log('%c[INFO] Lexical & Syntactic Engine mounted successfully.', 'color: #7CFFB2; font-family: monospace;');
}

// --- MONTAGE DE L'APPLICATION ---

const rootElement = document.getElementById('root');

// Sécurité : Si l'élément root n'existe pas (ex: index.html corrompu), on arrête tout proprement.
if (!rootElement) {
  throw new Error('[CRITICAL] Failed to find the root element. Application cannot mount.');
}

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);