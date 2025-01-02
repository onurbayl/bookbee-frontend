import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase.js";
import './register.css'
import { useAuth } from "../../../AuthContext.js";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const { user, setNewAccountCreationPending } = useAuth()
  const navigate = useNavigate()
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/genre/get-all-genres`);
        const sortedGenres = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setGenres(sortedGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

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


      const requestBody = { name, email, description, uid: crnUser.uid, favoriteGenres: selectedGenreIds, imagePath: "d" }
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/create`, requestBody)
      console.log("Create user in database response: ", response.data)
      //setNewAccountCreationPending(false);

      await auth.signOut();

      navigate("/login")

    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
      });
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