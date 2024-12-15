import React from "react";
import Review from "../Review/Review";
import "./ReviewList.css";

const recentReviews = [
  {
    id: 1,
    bookTitle: "Dune by Frank Herbert",
    rating: 5,
    text: "An intricate and beautifully woven tapestry of politics, religion, and ecology.",
    likes: 20,
    dislikes: 5,
  },
  {
    id: 2,
    bookTitle: "The Three-Body Problem by Cixin Liu",
    rating: 4,
    text: "A brilliant piece of science fiction that explores fascinating scientific concepts.",
    likes: 15,
    dislikes: 3,
  },
  {
    id: 3,
    bookTitle: "1984 by George Orwell",
    rating: 5,
    text: "A compelling and thought-provoking dystopian story.",
    likes: 30,
    dislikes: 1,
  },
];

const mostLikedReviews = [
  {
    id: 4,
    bookTitle: "The Left Hand of Darkness by Ursula K. Le Guin",
    rating: 5,
    text: "A fascinating exploration of culture and gender through a science fiction lens.",
    likes: 40,
    dislikes: 2,
  },
  {
    id: 5,
    bookTitle: "The Man in the High Castle by Philip K. Dick",
    rating: 4,
    text: "An alternative history full of suspense and thought-provoking ideas.",
    likes: 35,
    dislikes: 5,
  },
  {
    id: 6,
    bookTitle: "The Atlantis Gene by A.G. Riddle",
    rating: 3,
    text: "An intriguing premise but lacked depth in execution.",
    likes: 25,
    dislikes: 8,
  },
];

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
