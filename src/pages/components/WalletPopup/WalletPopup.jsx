import React, { useEffect, useState } from 'react';
import WalletMain from './WalletMain';
import WalletGiftCard from './WalletGiftCard';
import WalletLoadMoney from './WalletLoadMoney';
import WalletWithdraw from './WalletWithdraw';
import './WalletPopup.css';
import { useAuth } from '../../../AuthContext.js';
import { getFirebaseToken } from "../firebase/getFirebaseToken";
import axiost from "../../../axiosConfig.js";

const WalletPopup = ({ onClose }) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('wallet');
  const [balance, setBalance] = useState(null);

  const navigateTo = (page) => setCurrentPage(page);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!user) {
        return;
      }
      try {
        const token = await getFirebaseToken();

        const userResponse = await axiost.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/bytoken`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBalance(userResponse.data.balance);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [user]);


  return (
    <div className="wallet-popup-overlay">
      <div className="wallet-popup">
        <div className="wallet-header">
          <h2>Wallet</h2>
          <button onClick={onClose} className="close-button">X</button>
        </div>

        {currentPage === 'wallet' && <WalletMain balance={balance} onNavigate={navigateTo} />}
        {currentPage === 'giftCard' && (
          <WalletGiftCard onBack={() => {
            navigateTo('wallet');
          }} />
        )}
        {currentPage === 'loadMoney' && (
          <WalletLoadMoney onBack={() => {
            navigateTo('wallet');
          }} />
        )}
        {currentPage === 'withdraw' && (
          <WalletWithdraw onBack={() => {
            navigateTo('wallet');
          }} />
        )}
      </div>
    </div>
  );
};

export default WalletPopup;
