import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase.js";
import './register.css'
import { useAuth } from "../../../AuthContext.js";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


function Register() {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const {user,  setNewAccountCreationPending} = useAuth()
  const navigate = useNavigate()
  
  const handleRegister = async (e) => {

    e.preventDefault();
    try {
        console.log("Registered triggered")
        setNewAccountCreationPending(true);
        
        
        await createUserWithEmailAndPassword(auth, email, password);
        const crnUser = auth.currentUser
        console.log(crnUser)
        
        
        const requestBody = { name, email, description, uid: crnUser.uid }
        const response = await axios.post("http://127.0.0.1:3000/api/v1/user/create", requestBody)
        console.log("Create user in database response: ", response.data)
        setNewAccountCreationPending(false);

        await auth.signOut();

        navigate("/login")
      
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    
    <form onSubmit={handleRegister} className="register-form">
      <h3>Sign Up</h3>

      <div className="mb-3">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Description</label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Re-Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={(e) => setRePassword(e.target.value)}
          required
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary" disabled={password !== rePassword}>
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered <Link to="/login">Login</Link>
      </p>
    </form>
    
  );
}
export default Register;