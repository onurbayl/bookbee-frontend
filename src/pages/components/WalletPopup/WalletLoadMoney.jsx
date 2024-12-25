import React, { useState } from 'react';
import './WalletPopup.css';

const WalletLoadMoney = ({ onBack, onUpdateBalance }) => {
  const [amount, setAmount] = useState('');

  const handleLoad = () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onUpdateBalance(numericAmount);
      setAmount('');
    }
  };

  return (
    <div className="wallet-subpage">
      <h3>Load Money</h3>
      <label>
        Amount: $
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </label>
      <button onClick={handleLoad} className="wallet-action-button">Load Money</button>
      <button onClick={onBack} className="wallet-back-button">Back</button>
    </div>
  );
};

export default WalletLoadMoney;
