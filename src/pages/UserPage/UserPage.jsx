import { FaWallet } from 'react-icons/fa'; // Import the wallet icon
import Profile from '../components/Profile/Profile';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Rating from '../components/Rating/Rating';
import WalletPopup from '../components/WalletPopup/WalletPopup'; // Import Wallet Pop-up
import './UserPage.css';
import { BiLike, BiDislike } from "react-icons/bi";
import { getFirebaseToken } from "../components/firebase/getFirebaseToken";
import axios from "axios";
import { useAuth } from '../../AuthContext.js';
import { CiCircleRemove } from "react-icons/ci";
import { toast } from "react-toastify";

const UserPage = () => {
  const { id: bookId } = useParams();
  const { fetchedUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate for routing

  // Functions to handle wallet open/close
  const openWallet = () => setIsWalletOpen(true);
  const closeWallet = () => setIsWalletOpen(false);

  // Navigate to Past Orders page
  const goToPastOrders = () => navigate('/user/past-orders'); // Correct path

  // Navigate to Past Activity page
  const goToPastActivity = () => navigate('/user/past-activity'); // Add new navigation function

  // Fetch reviews when the user is available
  useEffect(() => {
    const fetchReviews = async () => {
      if (!fetchedUser || !fetchedUser.id) {
        console.error("User is not available.");
        return;
      }
  
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/review/get-last-ten-reviews/${fetchedUser.id}`
        );
        setReviews(response.data || []);
        console.log('Fetched Reviews:', response.data); // Add this line for logging
  
        // Print each review to the console
        response.data.forEach((review, index) => {
          console.log(`Review ${index + 1}:`, review);
        });
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
  
    fetchReviews();
  }, [fetchedUser?.id]);
  

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    try {
      const token = await getFirebaseToken();
      await axios.delete(
        `http://localhost:3000/api/v1/review/delete-review/${bookId}/${fetchedUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="user-page">
      <div className="top-buttons">
        {/* Past Orders Button */}
        <button className="past-orders-button" onClick={goToPastOrders}>
          Past Orders
        </button>

        {/* Past Activity Button */}
        <button className="past-activity-button" onClick={goToPastActivity}>
          Past Reviews
        </button>

        {/* Wallet Button */}
        <FaWallet
          className="wallet-button"
          onClick={openWallet} // Opens the wallet popup
        />
      </div>

      <div className="user-page-container">
        {/* Profile on the left side */}
        <div className="profile-section">
          <Profile />
        </div>

        {/* Reviews on the right side */}
        <div className="reviews-section">
  <h3>Last 10 Reviews</h3>
  
  {reviews.length > 0 ? (
    reviews.map((review) => (
      <div key={review.id} className="review-card">
        
        {/* Check if book exists */}
        {review.book ? (
          <>
            {/* Book Name */}
            <h4 className="review-book-name">{review.book.name}</h4>
            
            <div className="review-header">
              {/* Display Rating using Rating Component */}
              <div className="review-rating">
                <Rating score={review.score} /> {/* Adjust the rating */}
              </div>
            </div>
          </>
        ) : (
          <h4 className="review-book-name">Unknown Book</h4>
        )}
        
        {/* Review Content */}
        <p className="review-content">
          {review.content}
        </p>

        {/* Review Actions */}
        <div className="review-actions">
          <div className="like-dislike">
            <button
              className={`like-button ${review.userLiked ? "liked" : ""}`}
              onClick={() => {} /* Handle like functionality */}
            >
              <BiLike />
            </button>
            <span>{review.likeCount}</span> {/* Display like count */}
            
            <button
              className={`dislike-button ${review.userDisliked ? "disliked" : ""}`}
              onClick={() => {} /* Handle dislike functionality */}
            >
              <BiDislike />
            </button>
            <span>{review.dislikeCount}</span> {/* Display dislike count */}
          </div>

          {/* Delete Review Button */}
          {fetchedUser?.id === review.userId && (
            <button
              className="delete-review-button"
              onClick={() => handleDeleteReview(review.id)}
            >
              <CiCircleRemove />
            </button>
          )}
        </div>
      </div>
    ))
  ) : (
    <p>No reviews available.</p>
  )}
</div>


        </div>
      

      {/* Wallet Pop-up */}
      {isWalletOpen && <WalletPopup onClose={closeWallet} />}
    </div>
  );
};

export default UserPage;
