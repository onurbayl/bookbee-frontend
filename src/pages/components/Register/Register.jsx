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
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const { user, setNewAccountCreationPending } = useAuth()
  const navigate = useNavigate()

  const genres = [
    { id: 1, name: "Action & Adventure" },
    { id: 2, name: "Art & Photography" },
    { id: 3, name: "Biography" },
    { id: 4, name: "Detective & Mystery" },
    { id: 5, name: "Fantasy" },
    { id: 6, name: "Food & Drink" },
    { id: 7, name: "History" },
    { id: 8, name: "Horror" },
    { id: 9, name: "Poetry" },
    { id: 10, name: "Romance" },
    { id: 11, name: "Science & Technology" },
    { id: 12, name: "Science Fiction" },
    { id: 13, name: "Self-Help" },
    { id: 14, name: "Thriller" },
    { id: 15, name: "World Classics" },
  ];

  const toggleGenre = (id) => {
    setSelectedGenreIds((prev) =>
      prev.includes(id) ? prev.filter((genreId) => genreId !== id) : [...prev, id]
    );
  };

  const handleRegister = async (e) => {

    e.preventDefault();
    try {
      console.log("Registered triggered")
      //setNewAccountCreationPending(true);


      await createUserWithEmailAndPassword(auth, email, password);
      const crnUser = auth.currentUser
      console.log(crnUser)


      const requestBody = { name, email, description, uid: crnUser.uid }
      const response = await axios.post("http://127.0.0.1:3000/api/v1/user/create", requestBody)
      console.log("Create user in database response: ", response.data)
      //setNewAccountCreationPending(false);

      await auth.signOut();

      navigate("/login")

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Sign Up</h1>
      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            type="text"
            className="form-control"
            placeholder="Tell us something about yourself"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Favorite Genres</label>
          <div className="genres-container">
            {genres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={`genre-button ${selectedGenreIds.includes(genre.id) ? "selected" : ""
                  }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm your password"
            onChange={(e) => setRePassword(e.target.value)}
            required
          />
        </div>
        <div className="submit-button-div">
          <button type="submit" className="submit-button" disabled={password !== rePassword}>
            Sign Up
          </button>
        </div>
        <div className="already-registered">
          <p>
            Already registered? <Link to="/login"><strong>Login</strong></Link>
          </p>
        </div>
      </form>
    </div>
  );
}
export default Register;