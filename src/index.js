import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

// Remove initial loading screen
const loadingElement = document.querySelector('.initial-loading');
if (loadingElement) {
  loadingElement.remove();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
