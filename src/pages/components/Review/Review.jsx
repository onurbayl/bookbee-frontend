import React from "react";
import "./Review.css";

const Review = ({ review }) => {
  return (
    <div className="review-card">
      <h3>{review.bookTitle}</h3>
      <p className="rating">Rating: {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
      <p>{review.text}</p>
      <div className="reaction-buttons">
        <button className="like-btn">
          👍 {review.likes}
        </button>
        <button className="dislike-btn">
          👎 {review.dislikes}
        </button>
      </div>
    </div>
  );
};

export default Review;
