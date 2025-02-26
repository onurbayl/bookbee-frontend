import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchProvider } from "./SearchContext";
import Header from './pages/components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import BookPage from './pages/BookPage/BookPage';
import Login from './pages/components/Login/Login';
import Register from './pages/components/Register/Register';
import ProtectedRoute from './pages/protectedRoute/ProtectedRoute';
import UserPage from './pages/UserPage/UserPage';
import UserVisitPage from './pages/UserVisitPage/UserVisitPage';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage';
import SearchFilterPage from "./pages/SearchFilterPage/SearchFilterPage";
import AuthorPage from "./pages/AuthorPage/AuthorPage";
import PublisherPage from "./pages/PublisherPage/PublisherPage";
import PublisherPanel from './pages/PublisherPanelPage/PublisherPanelPage';
import OrderHistory from "./pages/components/OrderHistory/OrderHistory";
import Wishlist from "./pages/components/Wishlist/Wishlist";
import TopRatedPage from "./pages/TopRatedPage/TopRatedPage";
import MostWishedForPage from "./pages/MostWishedForPage/MostWishedForPage";
import { useAuth } from './AuthContext';
import { useEffect } from 'react';
import { auth } from './pages/components/firebase/firebase';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDash from './pages/components/AdminPanel/AdminDash';
import BookForm from './pages/components/BookForm/BookForm';

const App = () => {
  const { user, setFetchedUser } = useAuth()

  const fetchUserData = async () => {
    try {
      const crntUser = auth.currentUser; // Get the current Firebase user
      console.log(crntUser)
      if (crntUser) {
        const token = await crntUser.getIdToken(); // Await the token
        const userData = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/bytoken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFetchedUser(userData.data); // Set user data into state
      }
    } catch (error) {
      console.log("User Fetching Error: ", error);
    }
  };

  useEffect(() => {
    if (user) { // Only fetch data if the user exists
      fetchUserData();
    }
  }, [user]);

  return (
    <>
      <ToastContainer />
      <SearchProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/top-rated-books" element={<TopRatedPage />} />
            <Route path="/most-wished-for-books" element={<MostWishedForPage />} />
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route index element={<AdminDash />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<ProtectedRoute allowedRoles={["user", "publisher", "admin"]} />}>
              <Route index element={<UserPage />} />
              <Route path="order-history" element={<OrderHistory />} />
              <Route path="wishlist" element={<Wishlist />} />
            </Route>
            <Route path="/user/:id" element={<UserVisitPage />} />
            <Route path="/cart" element={<ProtectedRoute allowedRoles={["user", "publisher", "admin"]} />}>
              <Route index element={<ShoppingCartPage />} />
            </Route>
            <Route path="/search" element={<SearchFilterPage />} />
            <Route path="/author/:id" element={<AuthorPage />} />
            <Route path="/publisher/:id" element={<PublisherPage />} />
            <Route path="/publisher-panel" element={<ProtectedRoute allowedRoles={["publisher", "admin"]} />}>
              <Route index element={<PublisherPanel />} />
            </Route>
            <Route path="/upload-book" element={<ProtectedRoute allowedRoles={["publisher", "admin"]} />}>
              <Route index element={<BookForm />} />
            </Route>
            <Route path="/update-book/:id" element={<ProtectedRoute allowedRoles={["publisher", "admin"]} />}>
              <Route index element={<BookForm uploadNotUpdate = {false} />} />
            </Route>
          </Routes>
        </Router>
      </SearchProvider>
    </>
  );
}

export default App;