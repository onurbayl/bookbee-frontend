import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Rating from '../components/Rating/Rating';
import './BookPage.css';
import { IoMdCheckmarkCircleOutline, IoMdTime } from "react-icons/io";
import { IoBookOutline } from "react-icons/io5";
import { FaHeart, FaRegCommentDots } from "react-icons/fa";
import { BiLike, BiDislike } from "react-icons/bi";

const book = {
  id: 1,
  name: "Animal Farm",
  description: `A farm is taken over by its overworked, mistreated animals. With flaming idealism and stirring slogans, they set out to create a paradise of progress, justice, and equality. Thus the stage is set for one of the most telling satiric fables ever penned—a razor-edged fairy tale for grown-ups that records the evolution from revolution against tyranny to a totalitarianism just as terrible.
  When Animal Farm was first published, Stalinist Russia was seen as its target. Today it is devastatingly clear that wherever and whenever freedom is attacked, under whatever banner, the cutting clarity and savage comedy of George Orwell's masterpiece have a meaning and message still ferociously fresh.`,
  writer: "George Orwell",
  publisher: "Penguin Publishing Group",
  pageNumber: 176,
  datePublished: 2004,
  language: "English",
  bookDimension: "8.5x5.5 inches",
  barcode: 4567890123456,
  isbn: "978-0-19-852663-6",
  editionNumber: 2,
  genre: "Allegory, Satire",
  rating: 2.75,
  reviewCount: 2,
  normalPrice: 22.00,
  discountPercentage: 10,
  finalPrice: 19.80
};

const initialReviews = {
  reviews: [
    {
      username: "B&NCarlyR",
      score: 8,
      content:
        "I enjoyed this when I first read it and enjoyed it even more when I was older and had a fuller understanding of the book. So glad I picked this one up again.",
      likes: 28,
      dislikes: 6,
      comments: [
        {
          username: "JimRGill",
          content: "I totally agree with you!",
          likes: 8,
          dislikes: 3,
        }
      ],
    },
    {
      username: "ShadowHunter16",
      score: 3,
      content:
        "Had to read this for school. If given the choice I would never have read this. It was depressing and boring. Also, I felt that it was meant for adults, not teenagers.",
      likes: 4,
      dislikes: 19,
      comments: [],
    },
  ]
}


const BookPage = () => {

  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ score: 0, content: '' });
  const [newComments, setNewComments] = useState({})
  const [hoveredStars, setHoveredStars] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState([]);
  const [selectedFlag, setSelectedFlag] = useState(null);

  const handleStarHover = (event, star) => {
    const { left, width } = event.target.getBoundingClientRect();
    const mouseX = event.clientX - left;
    const isHalf = mouseX < width / 2;
    setHoveredStars(isHalf ? star * 2 - 1 : star * 2);
  };

  const handleStarClick = (event, star) => {
    const { left, width } = event.target.getBoundingClientRect();
    const mouseX = event.clientX - left;
    const isHalf = mouseX < width / 2;
    setNewReview((prev) => ({
      ...prev,
      score: isHalf ? star * 2 - 1 : star * 2,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCommentInputChange = (e, reviewIndex) => {
    const { value } = e.target;
    setNewComments((prevComments) => ({
      ...prevComments,
      [reviewIndex]: value,
    }));
  };

  const handleAddReview = (e) => {
    e.preventDefault();

    if (!newReview.content) {
      alert("Please enter valid review.");
      return;
    }

    setReviews((prevReviews) => ({
      reviews: [
        ...prevReviews.reviews,
        {
          username: "current_user",
          score: newReview.score,
          content: newReview.content,
          likes: 0,
          dislikes: 0,
          comments: [],
        },
      ],
    }));

    setNewReview({ score: 0, content: '' });
    setHoveredStars(0);
  };

  const handleAddComment = (e, reviewIndex) => {
    e.preventDefault();
  
    if (!newComments[reviewIndex]) {
      alert("Please enter a valid comment.");
      return;
    }
  
    setReviews((prevReviews) => {
      const updatedReviews = prevReviews.reviews.map((review, index) =>
        index === reviewIndex
          ? {
              ...review,
              comments: [
                ...review.comments,
                {
                  username: "current_user",
                  content: newComments[reviewIndex],
                  likes: 0,
                  dislikes: 0,
                },
              ],
            }
          : review
      );
  
      return { ...prevReviews, reviews: updatedReviews };
    });
  
    setNewComments((prevComments) => ({
      ...prevComments,
      [reviewIndex]: "",
    }));
  };

  const expandReviews = (index) => {
    if (expandedReviews.includes(index)) {
      setExpandedReviews(expandedReviews.filter((i) => i !== index));
    }
    else {
      setExpandedReviews([...expandedReviews, index]);
    }
  };

  const handleLikeReview = (reviewIndex) => {
    setReviews((prevReviews) => {
      const updatedReviews = prevReviews.reviews.map((review, index) =>
        index === reviewIndex
          ? {
            ...review,
            likes: review.likes + (review.userLiked ? -1 : 1),
            userLiked: !review.userLiked,
            dislikes: review.userDisliked ? review.dislikes - 1 : review.dislikes,
            userDisliked: false,
          }
          : review
      );

      return { ...prevReviews, reviews: updatedReviews };
    });
  };

  const handleDislikeReview = (reviewIndex) => {
    setReviews((prevReviews) => {
      const updatedReviews = prevReviews.reviews.map((review, index) =>
        index === reviewIndex
          ? {
            ...review,
            dislikes: review.dislikes + (review.userDisliked ? -1 : 1),
            userDisliked: !review.userDisliked,
            likes: review.userLiked ? review.likes - 1 : review.likes,
            userLiked: false,
          }
          : review
      );

      return { ...prevReviews, reviews: updatedReviews };
    });
  };

  const handleLikeComment = (reviewIndex, commentIndex) => {
    setReviews((prevReviews) => {
      const updatedReviews = prevReviews.reviews.map((review, index) =>
        index === reviewIndex
          ? {
            ...review,
            comments: review.comments.map((comment, cIndex) =>
              cIndex === commentIndex
                ? {
                  ...comment,
                  likes: comment.likes + (comment.userLiked ? -1 : 1),
                  userLiked: !comment.userLiked,
                  dislikes: comment.userDisliked ? comment.dislikes - 1 : comment.dislikes,
                  userDisliked: false,
                }
                : comment
            ),
          }
          : review
      );

      return { ...prevReviews, reviews: updatedReviews };
    });
  };

  const handleDislikeComment = (reviewIndex, commentIndex) => {
    setReviews((prevReviews) => {
      const updatedReviews = prevReviews.reviews.map((review, index) =>
        index === reviewIndex
          ? {
            ...review,
            comments: review.comments.map((comment, cIndex) =>
              cIndex === commentIndex
                ? {
                  ...comment,
                  dislikes: comment.dislikes + (comment.userDisliked ? -1 : 1),
                  userDisliked: !comment.userDisliked,
                  likes: comment.userLiked ? comment.likes - 1 : comment.likes,
                  userLiked: false,
                }
                : comment
            ),
          }
          : review
      );

      return { ...prevReviews, reviews: updatedReviews };
    });
  };

  const handleFlagClick = (flag) => {
    setSelectedFlag((prevFlag) => (prevFlag === flag ? null : flag));
  };

  return (
    <div className="main-container">
      <Sidebar />
      <div className="book-page">
        <div className="book-main-info">
          <h1 className="book-title">{book.name}</h1>
          <p className="book-genre">{book.genre}</p>

          <div className="book-details">
            <div>
              <div className="book-image-placeholder"></div>
              {/* 
                <div className="book-image">
                  <img src={book.image} alt={book.title} />
                </div> 
              */}
              <p className="wishlist"><FaHeart /> Add to Wishlist</p>
            </div>
            <div className="book-data">
              <p><strong>Author</strong>: {book.writer}</p>
              <p><strong>Publisher</strong>: {book.publisher}</p>
              <p><strong>Pages</strong>: {book.pageNumber}</p>
              <p><strong>Language</strong>: {book.language}</p>
              <p><strong>Publication Year</strong>: {book.datePublished}</p>
              <p><strong>Dimensions</strong>: {book.bookDimension}</p>
              <p><strong>Barcode</strong>: {book.barcode}</p>
              <p><strong>ISBN</strong>: {book.isbn}</p>
              <p><strong>Edition</strong>: {book.editionNumber}</p>
              <p> <strong> ★ </strong> {book.rating} ({book.reviewCount} Reviews)</p>
            </div>
            <div className="book-flag-container">
              <p
                className={`book-flag ${selectedFlag == "haveRead" ? "bold" : ""}`}
                onClick={() => handleFlagClick("haveRead")}
              >
                <IoMdCheckmarkCircleOutline />
                <span className="text-margin">Have Read</span>
              </p>
              <p
                className={`book-flag ${selectedFlag == "reading" ? "bold" : ""}`}
                onClick={() => handleFlagClick("reading")}
              >
                <IoBookOutline />
                <span className="text-margin">Reading</span>
              </p>
              <p
                className={`book-flag ${selectedFlag == "willRead" ? "bold" : ""}`}
                onClick={() => handleFlagClick("willRead")}
              >
                <IoMdTime />
                <span className="text-margin">Will Read</span>
              </p>
            </div>
          </div>
        </div>
        <div className="price">
          <div className="book-pricing">
            {book.discountPercentage > 0 ? (
              <><p className="normal-price"> <del>${(book.normalPrice).toFixed(2)}</del>
              </p><p className="discount-percentage"> -{book.discountPercentage}% </p></>
            ) : null}
            <p className="final-price"> ${(book.finalPrice).toFixed(2)} </p>
          </div>
          <button className="cart-btn">Add to Cart</button>
        </div>
        <div className="book-description">
          <p>{book.description}</p>
        </div>
        <div className="book-reviews-section">
          <h2>Reviews</h2>
          <div className="book-reviews-line"></div>
          {reviews.reviews.map((review, index) => (
            <div key={index} className="review">
              <div className="book-review-data">
                <div className="book-review-first">
                  <h4>{review.username}</h4>
                  <Rating score={review.score} />
                </div>
                <p className="book-review-second">{review.content}</p>
                <div className="book-review-third">
                  <p
                    className={`book-review-like ${review.userLiked ? 'bold' : ''}`}
                    onClick={() => handleLikeReview(index)}
                  >
                    <BiLike /> <span className="text-margin">{review.likes}</span>
                  </p>
                  <p
                    className={`book-review-dislike ${review.userDisliked ? 'bold' : ''}`}
                    onClick={() => handleDislikeReview(index)}
                  >
                    <BiDislike /> <span className="text-margin">{review.dislikes}</span>
                  </p>
                  <p className="book-review-comment" onClick={() => expandReviews(index)}>
                    <FaRegCommentDots /> <span className="text-margin">{review.comments.length}</span>
                  </p>
                </div>
              </div>
              {expandedReviews.includes(index) ? (
                review.comments && review.comments.length > 0 ? (
                  <div className="comments-list">
                    {review.comments.map((comment, commentIndex) => (
                      <div key={commentIndex} className="comment">
                        <div className="comment-first"> <h4>{comment.username}</h4> </div>
                        <div className="comment-second"> {comment.content} </div>
                        <div className="comment-third">
                          <p
                            className={`comment-like ${comment.userLiked ? 'bold' : ''}`}
                            onClick={() => handleLikeComment(index, commentIndex)}
                          >
                            <BiLike /> <span className="text-margin">{comment.likes}</span>
                          </p>
                          <p
                            className={`comment-dislike ${comment.userDisliked ? 'bold' : ''}`}
                            onClick={() => handleDislikeComment(index, commentIndex)}
                          >
                            <BiDislike /> <span className="text-margin">{comment.dislikes}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>) : (
                  <div className="no-comment"> No comments available for this review. </div>
                )
              ) : null}
              {expandedReviews.includes(index) ? (
                <form className="add-comment-form" onSubmit={(e) => handleAddComment(e, index)}>
                  <div className="add-comment-text">
                    <textarea
                      name="content"
                      value={newComments[index] || ""}
                      onChange={(e) => handleCommentInputChange(e, index)}
                      placeholder="Write your comment..."
                    ></textarea>
                  </div>
                  <div className="add-comment-submit"><button type="submit">Submit Comment</button></div>
                </form>
              ) : null}
            </div>
          ))}
          <form className="add-book-review-form" onSubmit={handleAddReview}>
            <div className="add-book-review-first">
              {[1, 2, 3, 4, 5].map((star) => {
                const halfStarValue = star * 2 - 1;
                const fullStarValue = star * 2;
                return (
                  <span
                    key={star}
                    className="star-container"
                    onMouseMove={(event) => handleStarHover(event, star)}
                    onClick={(event) => handleStarClick(event, star)}
                    onMouseLeave={() => setHoveredStars(0)}
                  >
                    <span
                      className={`star half ${hoveredStars >= halfStarValue || newReview.score >= halfStarValue
                        ? 'filled'
                        : 'empty'
                        }`}
                    >
                      ★
                    </span>
                    <span
                      className={`star full ${hoveredStars >= fullStarValue || newReview.score >= fullStarValue
                        ? 'filled'
                        : 'empty'
                        }`}
                    >
                      ★
                    </span>
                  </span>
                );
              })}
            </div>
            <div className="add-book-review-second">
              <textarea
                name="content"
                value={newReview.content}
                onChange={handleInputChange}
                placeholder="Write your review..."
              ></textarea>
            </div>
            <div className="add-book-review-third"><button type="submit">Submit Review</button></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookPage;