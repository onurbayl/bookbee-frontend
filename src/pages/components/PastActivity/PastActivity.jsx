import React from "react";
import "./PastActivity.css";

const PastActivity = () => {
  const reviews = [
    { id: 1, book: "Animal Farm", review: "Great book.", author: "George Orwell", rating: 5 },
    { id: 2, book: "1984", review: "Eye-opening.", author: "George Orwell", rating: 5 },
    { id: 3, book: "Chess Story", review: "Couldn't understand it.", author: "Stefan Zweig", rating: 2 },
  ];

  return (
    <div className="past-activity-container">
      <h2>Past Activity</h2>
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-content">
              <h4>{review.book}</h4>
              <p>By: {review.author}</p>
              <p>{review.review}</p>
              <p>Rating: {"★".repeat(review.rating)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastActivity;
