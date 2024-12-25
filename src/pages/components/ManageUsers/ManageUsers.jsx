import React, { useState } from "react";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [username, setUsername] = useState("");
  const [reviews, setReviews] = useState([
    { id: 1, book: "Animal Farm", review: "Great book.", author: "George Orwell", rating: 5 },
    { id: 2, book: "1984", review: "Eye-opening.", author: "George Orwell", rating: 5 },
  ]);

  const [userStatus, setUserStatus] = useState("Active");
  const [userRole, setUserRole] = useState("User");

  const handleDeleteReview = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const toggleUserStatus = () => {
    setUserStatus(userStatus === "Active" ? "Banned" : "Active");
  };

  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
  };

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>
      <div className="search-bar">
        <label htmlFor="username">Name:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>

      <div className="user-actions">
        <button className="action-button" onClick={toggleUserStatus}>
          {userStatus === "Active" ? "Ban User" : "Unban User"}
        </button>
        <div className="role-dropdown">
          <label htmlFor="role">Change Role:</label>
          <select id="role" value={userRole} onChange={handleRoleChange}>
            <option value="User">User</option>
            <option value="Publisher">Publisher</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-content">
              <h4>{review.book}</h4>
              <p>By: {review.author}</p>
              <p>{review.review}</p>
              <p>Rating: {"★".repeat(review.rating)}</p>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteReview(review.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
