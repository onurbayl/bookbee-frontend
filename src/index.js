import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Global styles
import App from './App'; // Main App component

// Render the App component into the root div in index.html
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root') // Matches the root div in public/index.html
);