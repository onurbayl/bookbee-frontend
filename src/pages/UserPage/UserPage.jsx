import React, { useState } from 'react';
import Profile from '../components/Profile/Profile';
import ReviewList from '../components/ReviewList/ReviewList';
import WalletPopup from '../components/WalletPopup/WalletPopup'; // Import Wallet Pop-up
import './UserPage.css';

const UserPage = () => {
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Functions to handle wallet open/close
  const openWallet = () => setIsWalletOpen(true);
  const closeWallet = () => setIsWalletOpen(false);

  return (
    <div className="user-page">
      {/* Wallet Button */}
      <img
        src="https://via.placeholder.com/40" // Replace with actual wallet image
        alt="Wallet"
        className="wallet-button"
        onClick={openWallet} // Opens the wallet popup
      />

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
