import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase.js";
import "./login.css"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      navigate("/");

    } catch (error) {
      console.log(error.message);
      toast.warning("Check your credentials", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="login-form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="login-form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="login-form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login-submit-button-div">
          <button type="submit" className="login-submit-button">
            Login
          </button>
        </div>
        <div className="not-account">
          <p>
            Do not have an account? <Link to="/register"><strong>Sign Up</strong></Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;