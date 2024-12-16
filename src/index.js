import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles
import App from './App'; // Main App component
import { AuthProvider } from './AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root div in index.html
root.render(
  //<StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  //</StrictMode>,
 // Matches the root div in public/index.html
);