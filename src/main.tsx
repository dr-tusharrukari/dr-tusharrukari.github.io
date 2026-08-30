import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Security banner & integrity watermark for Developer Tools inspection
if (typeof window !== 'undefined') {
  console.log(
    '%c🛡️ Official Academic Portfolio — Dr. Tushar Ganpat Rukari%c\n' +
    'Repository integrity secured on GitHub Pages. Any client-side DOM modifications in Developer Tools (F12) are restricted to your local session and will not affect the published website.',
    'background: #1e1b4b; color: #818cf8; font-size: 13px; font-weight: bold; padding: 4px 8px; border-radius: 4px; border: 1px solid #6366f1;',
    'color: #94a3b8; font-size: 11px;'
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

