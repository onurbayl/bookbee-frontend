import React from 'react';
import Profile from '../components/Profile/Profile';
import ReviewList from '../components/ReviewList/ReviewList';
import './UserPage.css';

const UserPage = () => {
  return (
    <div className="user-page-container">
      {/* Profile on the left side */}
      <div className="profile-section">
        <Profile />
      </div>

      {/* Reviews on the right side */}
      <div className="reviews-section">
        <ReviewList />
      </div>
    </div>
  );
}

export default UserPage;
