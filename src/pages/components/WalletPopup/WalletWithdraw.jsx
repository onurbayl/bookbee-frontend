import React, { useState } from 'react';
import './WalletPopup.css';
import axios from 'axios';
import { useAuth } from '../../../AuthContext.js';
import { getFirebaseToken } from "../firebase/getFirebaseToken";
import { toast } from "react-toastify";

const WalletWithdraw = ({ onBack }) => {
  const { fetchedUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshPage = () => {
    window.location.reload();
  };
  
  const handleWithdraw = async () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const currentBalance = parseFloat(fetchedUser.balance);
      const updatedBalance = (currentBalance - numericAmount).toFixed(2);
      try {
        setLoading(true);
        const token = await getFirebaseToken();
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/user/${fetchedUser.id}`,
          { balance: updatedBalance },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        refreshPage();
      } catch (error) {
        console.error('Error withdrawing money:', error);
        toast.error('Failed to withdraw money. Please try again.');
      } finally {
        setLoading(false);
      }
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
      <button onClick={handleWithdraw} className="wallet-action-button" disabled={loading}>
        {loading ? 'Loading...' : 'Withdraw Money'}
      </button>
      <button onClick={onBack} className="wallet-back-button">Back</button>
    </div>
  );
};

export default WalletWithdraw;
