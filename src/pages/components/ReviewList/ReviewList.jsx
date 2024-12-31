import React from "react";
import Review from "../Review/Review";
import "./ReviewList.css";

const ReviewList = () => {
  return (
    <div className="review-list">
      <h2>Recent Reviews</h2>
      <div className="reviews-container">
        {recentReviews.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </div>

      <h2>Most Liked Reviews</h2>
      <div className="reviews-container">
        {mostLikedReviews.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
