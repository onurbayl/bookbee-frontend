import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { FaWallet } from 'react-icons/fa'; // Import the wallet icon
import Profile from '../components/Profile/Profile';
import ReviewList from '../components/ReviewList/ReviewList';
import WalletPopup from '../components/WalletPopup/WalletPopup'; // Import Wallet Pop-up
import './UserPage.css';

const UserPage = () => {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate for routing

  // Functions to handle wallet open/close
  const openWallet = () => setIsWalletOpen(true);
  const closeWallet = () => setIsWalletOpen(false);

  // Navigate to Past Orders page
  const goToPastOrders = () => navigate('/user/past-orders'); // Correct path

  // Navigate to Past Activity page
  const goToPastActivity = () => navigate('/user/past-activity'); // Add new navigation function

  return (
    <div className="user-page">
      <div className="top-buttons">
        {/* Past Orders Button */}
        <button className="past-orders-button" onClick={goToPastOrders}>
          Past Orders
        </button>

        {/* Past Activity Button */}
        <button className="past-activity-button" onClick={goToPastActivity}>
          Past Reviews
        </button>

        {/* Wallet Button */}
        <FaWallet
          className="wallet-button"
          onClick={openWallet} // Opens the wallet popup
        />
      </div>

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

      {/* Wallet Pop-up */}
      {isWalletOpen && <WalletPopup onClose={closeWallet} />}
    </div>
  );
};

export default UserPage;
