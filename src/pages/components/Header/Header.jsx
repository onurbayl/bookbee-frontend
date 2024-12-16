import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <Link to={"/"}>
        <div className="logo">
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="BookBee Logo" />
        </div>
      </Link>
      <div className="search-bar">
        <input type="text" placeholder="Search BookBee" />
        <button className="search-btn">
          <img src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" />
        </button>
      </div>
      <div className="auth-buttons">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </header>
  );
}

export default Header;