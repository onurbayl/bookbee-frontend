import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { auth } from "../../components/firebase/firebase.js";
import { useAuth } from '../../../AuthContext.js';
import { useSearch } from "../../../SearchContext";
import { FiUser, FiShoppingCart, FiLogOut } from "react-icons/fi";
import { ClipLoader } from 'react-spinners';

const Header = () => {

  const { user, setUser, fetchedUser, setFetchedUser, loading } = useAuth();
  const { searchQuery, setSearchQuery, resetSearchQuery, resetFilters } = useSearch();
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      localStorage.removeItem("user");
      await auth.signOut();
      //window.location.href = "/login";
      navigate("/login");
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    } finally {
      setUser(null)
      setFetchedUser(null)

    }
  }

  const handleSearch = (e) => {
    if (!searchQuery.trim()) {
      return;
    }
    if (e.key === "Enter" || e.type === "click") {
      const query = document.querySelector(".search-bar input").value.trim();
      setSearchQuery(query);
      navigate("/search");
    }
  };

  const handleLogoClick = () => {
    resetSearchQuery();
    resetFilters();
    navigate("/");
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="BookBee Logo" />
      </div>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search BookBee"
          onKeyDown={handleSearch}
        />
        <button className="search-btn" onClick={handleSearch}>
          <img src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" />
        </button>
      </div>
      {loading && <div style={{ display: "inline-block", marginLeft: "10px" }}>
      <ClipLoader color="#007bff" size={20} /> {/* Compact spinner */}
    </div>}
      {!user && !loading ?
        (<div className="auth-buttons">
          <Link to="/login"><button className="login-btn">Login</button></Link>
          <Link to="/register"><button className="signup-btn">Sign Up</button></Link>
        </div>
        ) : !loading && (
          <div className="logged-in">
            <p> Welcome, <strong>{fetchedUser ? fetchedUser.name : "Guest"}</strong>!</p>
            {user.role === "publisher" &&
              (<div className="publisher-div">
                <Link to="/publisher-panel">
                  <button className="publisher-btn">Publisher Panel</button>
                </Link>
              </div>)
            }
            {user.role === "admin" &&
              (<div className="admin-div">
                <Link to="/admin">
                  <button className="admin-btn">Admin Panel</button>
                </Link>
              </div>)
            }
            <div className="navigation-icons">
              <div className="navigation-icon" onClick={() => navigate("/user")}> <FiUser /> </div>
              <div className="navigation-icon" onClick={() => navigate("/cart")}> <FiShoppingCart /> </div>
              <div className="navigation-icon" onClick={handleLogout}> <FiLogOut /> </div>
            </div>
          </div>
        )}
    </header>
  );
}

export default Header;