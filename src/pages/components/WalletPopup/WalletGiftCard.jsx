import React, { useState } from 'react';
import './WalletPopup.css';

const WalletGiftCard = ({ onBack, onUpdateBalance }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleGift = () => {
    const numericAmount = parseFloat(amount);
    if (recipient && numericAmount > 0) {
      onUpdateBalance(-numericAmount); // Deduct from balance
      setRecipient('');
      setAmount('');
      onBack(); // Return to the main wallet page
    }
  };

  return (
    <div className="wallet-subpage">
      <h3>Gift Card</h3>
      <label>
        Select Friend:
        <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
          <option value="">-- Select Friend --</option>
          <option value="John">John</option>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <label>
        Amount: $
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </label>
      <button onClick={handleGift} className="wallet-action-button">Gift</button>
      <button onClick={onBack} className="wallet-back-button">Back</button>
    </div>
  );
};

export default WalletGiftCard;
