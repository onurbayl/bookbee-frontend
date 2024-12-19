import React, { useState } from 'react';
import './WalletPopup.css';

const WalletWithdraw = ({ onBack, onUpdateBalance }) => {
  const [amount, setAmount] = useState('');

  const handleWithdraw = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      onUpdateBalance(-parsedAmount);
      onBack();
    }
  };

  return (
    <div className="wallet-subpage">
      <h3>Withdraw Money</h3>
      <label>
        Amount: $
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </label>
      <button onClick={handleWithdraw} className="wallet-action-button">Withdraw</button>
      <button onClick={onBack} className="wallet-back-button">Back</button>
    </div>
  );
};

export default WalletWithdraw;
