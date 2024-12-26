import React, { useState } from "react";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [username, setUsername] = useState(""); // For searching users
  const [searchTerm, setSearchTerm] = useState(""); // To filter the user list based on search term
  const [reviews, setReviews] = useState([
    { id: 1, book: "Animal Farm", review: "Great book.", author: "George Orwell", rating: 5 },
    { id: 2, book: "1984", review: "Eye-opening.", author: "George Orwell", rating: 5 },
  ]);
  const [userStatus, setUserStatus] = useState("Active");
  const [userRole, setUserRole] = useState("User");
  const [coupon, setCoupon] = useState(0); // State to store the coupon discount percentage

  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    // Add more mock users as needed
  ];

  const handleDeleteReview = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const toggleUserStatus = () => {
    setUserStatus(userStatus === "Active" ? "Banned" : "Active");
  };

  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
  };

  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
  };

  const applyCoupon = () => {
    if (coupon < 0 || coupon > 100) {
      alert("Please enter a valid coupon value between 0 and 100.");
    } else {
      alert(`Coupon applied! ${coupon}% discount.`);
    }
  };

  const resetCoupon = () => {
    setCoupon(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>

      {/* User Search */}
      <div className="user-search-container">
        <label htmlFor="user-search">Search User:</label>
        <input
          type="text"
          id="user-search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a user"
          className="input-box"
        />
      </div>

      <div className="user-actions">
        <button className="action-button" onClick={toggleUserStatus}>
          {userStatus === "Active" ? "Ban User" : "Unban User"}
        </button>

        {/* Coupon input and actions */}
        <div className="coupon-container">
          <label htmlFor="coupon">Coupon Discount (%):</label>
          <input
            type="number"
            id="coupon"
            value={coupon}
            onChange={handleCouponChange}
            min="0"
            max="100"
            placeholder="Enter discount"
          />
          <button className="action-button" onClick={applyCoupon}>
            Apply Coupon
          </button>
          {coupon > 0 && (
            <button className="reset-button" onClick={resetCoupon}>
              Reset Coupon
            </button>
          )}
        </div>

        {/* Change Role */}
        <div className="role-dropdown">
          <label htmlFor="role">Change Role:</label>
          <select id="role" value={userRole} onChange={handleRoleChange}>
            <option value="User">User</option>
            <option value="Publisher">Publisher</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Display filtered users */}
      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="user-item">
              <p>{user.name}</p>
            </div>
          ))
        ) : (
          <p>No users found!</p>
        )}
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

export default AdminPanel;
