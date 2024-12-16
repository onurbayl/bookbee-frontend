import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { auth } from "../../components/firebase/firebase.js";
import { useAuth } from '../../../AuthContext.js';

const Header = () => {

  const { user, setUser } = useAuth();
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




  return (
    <header className="header">
      <Link to={"/"}>
        <div className="logo">
          <img src="logo.png" alt="BookBee Logo" />
        </div>
      </Link>
      <div className="search-bar">
        <input type="text" placeholder="Search BookBee" />
        <button className="search-btn">
          <img src="search.png" alt="Search" />
        </button>
      </div>
      <div className="auth-buttons">
        <Link to="/admin"><button className="login-btn">Admin</button></Link>
        {!user ? 
          ( <>
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