import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './pages/components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import UserPage from './pages/UserPage/UserPage'; // Import the UserPage component

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserPage />} /> {/* Add UserPage route */}
      </Routes>
    </Router>
  );
}

export default App;
