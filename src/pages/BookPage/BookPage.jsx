import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar/Sidebar';
import Rating from '../components/Rating/Rating';
import './BookPage.css';
import { IoMdCheckmarkCircleOutline, IoMdTime } from "react-icons/io";
import { IoBookOutline } from "react-icons/io5";
import { FaHeart, FaRegCommentDots } from "react-icons/fa";
import { BiLike, BiDislike } from "react-icons/bi";
import { getFirebaseToken } from "../components/firebase/getFirebaseToken";
import axios from "axios";
import { useAuth } from '../../AuthContext.js';
import { CiCircleRemove } from "react-icons/ci";
import { toast } from "react-toastify";

const BookPage = () => {
  const { id: bookId } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ score: 0, content: '' });
  const [newComments, setNewComments] = useState({})
  const [hoveredStars, setHoveredStars] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState([]);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/book/get-bookId/${bookId}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, [bookId]);

  useEffect(() => {
    const fetchBookDiscount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/discount/get-discount/${bookId}`
        );
        const discountData = response.data;

        if (discountData) {
          const discountPercentage = discountData.discountPercentage || 0;

          setBook((prevBook) => ({
            ...prevBook,
            discountPercentage: discountPercentage,
            finalPrice:
              parseFloat(prevBook?.price || 0) -
              (parseFloat(prevBook?.price || 0) * (discountPercentage / 100)),
          }));
        } else {
          setBook((prevBook) => ({
            ...prevBook,
            discountPercentage: 0,
            finalPrice: parseFloat(prevBook?.price || 0),
          }));
        }
      } catch (error) {
        console.error("Error fetching discount data:", error);
      }
    };

    if (book) {
      fetchBookDiscount();
    }
  }, [book, bookId]);

  useEffect(() => {
    const fetchReviewsWithComments = async () => {
      try {
        const reviewsResponse = await axios.get(
          `http://localhost:3000/api/v1/review/get-reviews-book/${bookId}`
        );
        const reviews = reviewsResponse.data || [];

        const reviewsWithComments = await Promise.all(
          reviews.map(async (review) => {
            const commentsResponse = await axios.get(
              `http://localhost:3000/api/v1/comment/get-comments-by-review/${review.id}`
            );
            return {
              ...review,
              comments: commentsResponse.data || [],
            };
          })
        );

        setReviews(reviewsWithComments);

        const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0 ? totalScore / reviewCount / 2 : 0;

        setBook((prevBook) => ({
          ...prevBook,
          rating: averageRating.toFixed(1),
          reviewCount: reviewCount,
        }));
      } catch (error) {
        console.error("Error fetching reviews or comments:", error);
      }
    };

    fetchReviewsWithComments();
  }, [bookId, refresh]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!user) {
        return;
      }
      try {
        const token = await getFirebaseToken();

        const userResponse = await axios.get(
          `http://localhost:3000/api/v1/user/bytoken`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [user]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user) return;
      try {
        const token = await getFirebaseToken();
        const response = await axios.get(
          `http://localhost:3000/api/v1/wishList/get-items`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const wishlistItems = response.data || [];
        const inWishlist = wishlistItems.some(
          (wishlistItem) => wishlistItem.book.id === parseInt(bookId)
        );
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [user, bookId]);

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

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!newReview.content) {
      toast.error("Please enter a valid review.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const token = await getFirebaseToken();
      await axios.post(
        `http://localhost:3000/api/v1/review/add-review/${bookId}`,
        newReview,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRefresh((prev) => !prev);
      setNewReview({ score: 0, content: "" });
      setHoveredStars(0);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleDeleteReview = async () => {
    try {
      const token = await getFirebaseToken();
      await axios.delete(
        `http://localhost:3000/api/v1/review/delete-review/${bookId}/${currentUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleAddComment = async (e, reviewId, reviewIndex) => {
    e.preventDefault();

    if (!newComments[reviewIndex]) {
      toast.error("Please enter a valid comment.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const token = await getFirebaseToken();
      await axios.post(
        `http://localhost:3000/api/v1/comment/add-comment/${reviewId}`,
        { content: newComments[reviewIndex] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRefresh((prev) => !prev);
      setNewComments((prevComments) => ({
        ...prevComments,
        [reviewIndex]: "",
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const expandReviews = async (index) => {
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

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const token = await getFirebaseToken();
      if (isInWishlist) {
        await axios.delete(
          `http://localhost:3000/api/v1/wishList/remove-item/${bookId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Book removed from wishlist!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        await axios.post(
          `http://localhost:3000/api/v1/wishList/add-item/${bookId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Book added to wishlist!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
      setIsInWishlist((prev) => !prev);
    } catch (error) {
      console.error("Error toggling wishlist status:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const token = await getFirebaseToken();
      await axios.patch(
        `http://localhost:3000/api/v1/cart-item/add-item/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Book added to cart!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error adding book to cart:", error);

      toast.error("Failed to add book to cart. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="main-container">
      <Sidebar />
      <div className="book-page">
        {book ? (
          <>
            <div className="book-main-info">
              <h1 className="book-title">{book.name}</h1>
              <p className="book-genre">{book.genres.map((genre) => genre.name).join(", ")}</p>

              <div className="book-details">
                <div>
                  <div className="book-image">
                    <img src={`${process.env.PUBLIC_URL}/${book.imagePath}`} alt={book.name} />
                  </div>
                  <p
                    className={`wishlist ${isInWishlist ? "in-wishlist" : ""}`}
                    onClick={handleWishlistToggle}
                  >
                    <FaHeart /> {isInWishlist ? " Remove from Wishlist" : " Add to Wishlist"}
                  </p>
                </div>
                <div className="book-data">
                  <p><strong>Author</strong>: <Link to={`/author/${encodeURIComponent(book.writer)}`}>{book.writer}</Link></p>
                  <p><strong>Publisher</strong>: <Link to={`/publisher/${encodeURIComponent(book.publisher.name)}`}>{book.publisher.name}</Link></p>
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
                  <><p className="normal-price"> <del>${parseFloat(book.price).toFixed(2)}</del>
                  </p><p className="discount-percentage"> -{book.discountPercentage}% </p></>
                ) : null}
                <p className="final-price"> ${parseFloat(book.finalPrice).toFixed(2)} </p>
              </div>
              <button className="cart-btn" onClick={handleAddToCart}>Add to Cart</button>
            </div>
            <div className="book-description">
              <p>{book.description}</p>
            </div>
            <div className="book-reviews-section">
              <h2>Reviews</h2>
              <div className="book-reviews-line"></div>
              {reviews.map((review, index) => (
                <div key={review.id} className="review">
                  <div className="book-review-data">
                    <div className="book-review-first">
                      <h4>{review.user.name}</h4>
                      <Rating score={review.score} />
                    </div>
                    <p className="book-review-second">{review.content}</p>
                    {currentUser && (currentUser.id === review.user.id) && (
                      <p className="book-review-delete"
                        onClick={handleDeleteReview}>
                        <CiCircleRemove />
                      </p>
                    )
                    }
                    <div className="book-review-third">
                      <p
                        className={`book-review-like ${review.userLiked ? 'bold' : ''}`}
                        onClick={() => handleLikeReview(index)}
                      >
                        <BiLike /> <span className="text-margin">{review.likeCount}</span>
                      </p>
                      <p
                        className={`book-review-dislike ${review.userDisliked ? 'bold' : ''}`}
                        onClick={() => handleDislikeReview(index)}
                      >
                        <BiDislike /> <span className="text-margin">{review.dislikeCount}</span>
                      </p>
                      <p className="book-review-comment" onClick={() => expandReviews(index, review.id)}>
                        <FaRegCommentDots /> <span className="text-margin">{review.comments.length}</span>
                      </p>
                    </div>
                  </div>
                  {expandedReviews.includes(index) ? (
                    review.comments && review.comments.length > 0 ? (
                      <div className="comments-list">
                        {review.comments.map((comment, commentIndex) => (
                          <div key={commentIndex} className="comment">
                            <div className="comment-first"> <h4>{comment.user.name}</h4> </div>
                            <div className="comment-second"> {comment.content} </div>
                            <div className="comment-third">
                              <p
                                className={`comment-like ${comment.likeCount ? 'bold' : ''}`}
                                onClick={() => handleLikeComment(index, commentIndex)}
                              >
                                <BiLike /> <span className="text-margin">{comment.likeCount}</span>
                              </p>
                              <p
                                className={`comment-dislike ${comment.userDisliked ? 'bold' : ''}`}
                                onClick={() => handleDislikeComment(index, commentIndex)}
                              >
                                <BiDislike /> <span className="text-margin">{comment.dislikeCount}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>) : (
                      <div className="no-comment"> No comments available for this review. </div>
                    )
                  ) : null}
                  {expandedReviews.includes(index) && user ? (
                    <form className="add-comment-form" onSubmit={(e) => handleAddComment(e, review.id, index)}>
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
              {user && (<form className="add-book-review-form" onSubmit={handleAddReview}>
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
              </form>)}
            </div>
          </>
        ) : (
          <p>Loading book details...</p>
        )}
      </div>
    </div>
  );
};

export default BookPage;