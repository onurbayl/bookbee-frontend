import React, { useEffect, useState } from 'react';
import './WalletPopup.css';
import axios from 'axios';
import { useAuth } from '../../../AuthContext.js';
import { getFirebaseToken } from "../firebase/getFirebaseToken";
import { toast } from "react-toastify";

const WalletGiftCard = ({ onBack }) => {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [friends, setFriends] = useState([]);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = await getFirebaseToken();
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/friend/get-friends`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFriends(response.data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
        toast.error("Failed to fetch friends.");
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!user) {
        return;
      }
      try {
        const token = await getFirebaseToken();
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/bytoken`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBalance(parseFloat(userResponse.data.balance));
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [user]);

  const handleGift = async () => {
    if (!recipient || !amount) {
      toast.error("Please select a friend and enter an amount.");
      return;
    }
    if(amount > balance) {
      toast.error("Your balance is insufficient.");
      return;
    }
    try {
      const token = await getFirebaseToken();
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/gift/${recipient}`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Gift sent successfully!");
      refreshPage();
    } catch (error) {
      console.error("Error sending gift:", error);
      toast.error("There was an error sending the gift.");
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="wallet-subpage">
      <h3>Gift Card</h3>
      <label>
        Select Friend:
        <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
          <option value="">-- Select Friend --</option>
          {friends.map(friend => (
            <option key={friend.id} value={friend.id}>
              {friend.name}
            </option>
          ))}
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
