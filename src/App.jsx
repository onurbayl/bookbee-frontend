import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './pages/components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/components/Login/Login';
import Register from './pages/components/Register/Register';
import ProtectedRoute from './pages/protectedRoute/ProtectedRoute';
import AdminPanel from './pages/components/AdminPanel/AdminPanel';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      
        <Route path="admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route index element={<AdminPanel />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
    
  );
}

export default App;