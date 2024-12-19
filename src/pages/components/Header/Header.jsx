import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { auth } from "../../components/firebase/firebase.js";
import { useAuth } from '../../../AuthContext.js';
import { useSearch } from "../../../SearchContext";

const Header = () => {

  const { user, setUser } = useAuth();
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
      <div className="auth-buttons">
        <Link to="/admin"><button className="login-btn">Admin</button></Link>
        {!user ?
          (<>
            <Link to="/login"><button className="login-btn">Login</button></Link>
            <Link to="/register"><button className="signup-btn">Sign Up</button></Link>
          </>
          ) : (
            <button className="signup-btn" onClick={handleLogout}>Logout</button>
          )}
      </div>
    </header>
  );
}

export default Header;