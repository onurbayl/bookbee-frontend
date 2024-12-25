import React, { useState } from 'react';
import WalletMain from './WalletMain';
import WalletGiftCard from './WalletGiftCard';
import WalletLoadMoney from './WalletLoadMoney';
import WalletWithdraw from './WalletWithdraw';
import './WalletPopup.css';

const WalletPopup = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState('wallet'); // Track which page to display
  const [balance, setBalance] = useState(2500); // Wallet balance

  const navigateTo = (page) => setCurrentPage(page);
  const updateBalance = (amount) => setBalance((prev) => prev + amount);

  return (
    <div className="wallet-popup-overlay">
      <div className="wallet-popup">
        <div className="wallet-header">
          <h2>Wallet</h2>
          <button onClick={onClose} className="close-button">X</button>
        </div>

        {currentPage === 'wallet' && <WalletMain balance={balance} onNavigate={navigateTo} />}
        {currentPage === 'giftCard' && (
          <WalletGiftCard onBack={() => navigateTo('wallet')} onUpdateBalance={updateBalance} />
        )}
        {currentPage === 'loadMoney' && (
          <WalletLoadMoney onBack={() => navigateTo('wallet')} onUpdateBalance={updateBalance} />
        )}
        {currentPage === 'withdraw' && (
          <WalletWithdraw onBack={() => navigateTo('wallet')} onUpdateBalance={updateBalance} />
        )}
      </div>
    </div>
  );
};

export default WalletPopup;
