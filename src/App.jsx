import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './pages/components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import BookPage from './pages/BookPage/BookPage';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:id" element={<BookPage />} />
      </Routes>
    </Router>
  );
}

export default App;