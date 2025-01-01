import React from 'react';
import './WalletPopup.css';
import { useAuth } from '../../../AuthContext.js';

const WalletMain = ({ balance, onNavigate }) => {
  const { user } = useAuth();
  return (
    <div className="wallet-main">
      <img style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '8px' }}
        src={`${process.env.PUBLIC_URL}/logo.png`} alt="BookBee Logo" />
      <p className="wallet-balance">Current Balance: <b>${balance}</b></p>

      <div className="wallet-buttons">
        <button onClick={() => onNavigate('giftCard')} className="wallet-action-button">Gift Card</button>
        <button onClick={() => onNavigate('loadMoney')} className="wallet-action-button">Load Money</button>
        {user.role != "user" &&
          <button onClick={() => onNavigate('withdraw')} className="wallet-action-button">Withdraw</button>
        }
      </div>
    </div>
  );
};

export default WalletMain;
