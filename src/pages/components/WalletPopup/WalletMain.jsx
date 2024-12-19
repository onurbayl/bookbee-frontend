import React from 'react';
import './WalletPopup.css';

const WalletMain = ({ balance, onNavigate }) => {
  return (
    <div className="wallet-main">
      <img
        src="https://via.placeholder.com/80" // Replace with your wallet logo
        alt="Wallet Logo"
        className="wallet-logo"
      />
      <p className="wallet-balance">Current Balance: <b>${balance}</b></p>

      <div className="wallet-buttons">
        <button onClick={() => onNavigate('giftCard')} className="wallet-action-button">Gift Card</button>
        <button onClick={() => onNavigate('loadMoney')} className="wallet-action-button">Load Money</button>
        <button onClick={() => onNavigate('withdraw')} className="wallet-action-button">Withdraw</button>
      </div>
    </div>
  );
};

export default WalletMain;
