import React, { useEffect, useState } from 'react';
import axiost from "../../../axiosConfig.js";
import Rating from '../Rating/Rating';
import { BiLike, BiDislike } from 'react-icons/bi';
import { FaRegCommentDots } from 'react-icons/fa';
import './Review.css';

const Review = ({ userId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState([]);

  // Fetch reviews for the user
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiost.get(
          `http://localhost:3000/api/v1/review/get-last-ten-reviews/${userId}`
        );
        setReviews(response.data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [userId]);

  // Handle Like
  const handleLikeReview = async (index) => {
    try {
      const updatedReviews = [...reviews];
      updatedReviews[index].likeCount += 1; // Increment locally
      setReviews(updatedReviews);

      await axiost.post(`/api/v1/review/like/${reviews[index].id}`);
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  // Handle Dislike
  const handleDislikeReview = async (index) => {
    try {
      const updatedReviews = [...reviews];
      updatedReviews[index].dislikeCount += 1; // Increment locally
      setReviews(updatedReviews);

      await axiost.post(`/api/v1/review/dislike/${reviews[index].id}`);
    } catch (error) {
      console.error('Error disliking review:', error);
    }
  };

  // Expand/Collapse Comments
  const expandReviews = (index) => {
    setExpandedReviews((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="review-list">
      <h2>Past Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={review.id} className="review">
            <div className="review-header">
              <h4>{review.bookTitle}</h4>
              <Rating score={review.score} />
            </div>
            <p className="review-content">{review.content}</p>
            <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>

            <div className="review-actions">
              <p
                className={`review-like ${review.userLiked ? 'bold' : ''}`}
                onClick={() => handleLikeReview(index)}
              >
                <BiLike /> <span>{review.likeCount}</span>
              </p>
              <p
                className={`review-dislike ${review.userDisliked ? 'bold' : ''}`}
                onClick={() => handleDislikeReview(index)}
              >
                <BiDislike /> <span>{review.dislikeCount}</span>
              </p>
              <p className="review-comment" onClick={() => expandReviews(index)}>
                <FaRegCommentDots /> <span>{review.comments.length}</span>
              </p>
            </div>

            {/* Expand comments if necessary */}
            {expandedReviews.includes(index) && (
              <div className="comments-list">
                {review.comments.length > 0 ? (
                  review.comments.map((comment, commentIndex) => (
                    <div key={commentIndex} className="comment">
                      <h4>{comment.user.name}</h4>
                      <p>{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p>No comments available.</p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No reviews to display.</p>
      )}
    </div>
  );
};

export default Review;
