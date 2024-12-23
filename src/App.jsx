import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchProvider } from "./SearchContext";
import Header from './pages/components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import BookPage from './pages/BookPage/BookPage';
import Login from './pages/components/Login/Login';
import Register from './pages/components/Register/Register';
import ProtectedRoute from './pages/protectedRoute/ProtectedRoute';
import AdminPanel from './pages/components/AdminPanel/AdminPanel';
import UserPage from './pages/UserPage/UserPage'; // Import the UserPage component
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage';
import SearchFilterPage from "./pages/SearchFilterPage/SearchFilterPage";
import AuthorPage from "./pages/AuthorPage/AuthorPage";
import PublisherPage from "./pages/PublisherPage/PublisherPage";

const App = () => {
  return (
    <SearchProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book/:id" element={<BookPage />} />

          <Route path="admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route index element={<AdminPanel />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<ProtectedRoute allowedRoles={["user", "publisher", "admin"]} />}>
            <Route index element={<UserPage />} />
          </Route>
          <Route path="/cart" element={<ProtectedRoute allowedRoles={["user", "publisher", "admin"]} />}>
            <Route index element={<ShoppingCartPage />} />
          </Route>
          <Route path="/search" element={<SearchFilterPage />} />
          <Route path="/author/:id" element={<AuthorPage />} />
          <Route path="/publisher/:id" element={<PublisherPage />} />
        </Routes>
      </Router>
    </SearchProvider>
  );
}

export default App;