import React, { useState } from 'react';
import './WalletPopup.css';
import axiost from "../../../axiosConfig.js";
import { useAuth } from '../../../AuthContext.js';
import { getFirebaseToken } from "../firebase/getFirebaseToken";
import { toast } from "react-toastify";

const WalletLoadMoney = ({ onBack }) => {
  const { fetchedUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshPage = () => {
    window.location.reload();
  };

  const handleLoad = async () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const currentBalance = parseFloat(fetchedUser.balance);
      const updatedBalance = (currentBalance + numericAmount).toFixed(2);
      try {
        setLoading(true);
        const token = await getFirebaseToken();
        await axiost.put(
          `${process.env.REACT_APP_API_BASE_URL}/user/${fetchedUser.id}`,
          { balance: updatedBalance },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Money loaded successfully!");
        setTimeout(() => {
          refreshPage();
        }, 800);
      } catch (error) {
        console.error('Error loading money:', error);
        toast.error('Failed to load money. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    else {
      toast.error("The amount should be more than 0.");
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
      <button onClick={handleLoad} className="wallet-action-button" disabled={loading}>
        {loading ? 'Loading...' : 'Load Money'}
      </button>
      <button onClick={onBack} className="wallet-back-button">Back</button>
    </div>
  );
};

export default WalletLoadMoney;
