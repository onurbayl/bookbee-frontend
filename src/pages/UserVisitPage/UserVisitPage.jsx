import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Rating from '../components/Rating/Rating';
import './UserVisitPage.css';
import { BiLike, BiDislike } from "react-icons/bi";
import { getFirebaseToken } from "../components/firebase/getFirebaseToken";
import axios from "axios";
import { useAuth } from '../../AuthContext.js';
import { toast } from 'react-toastify';
import UserPageBookList from '../components/UserPageBookList/UserPageBookList';
import { Link } from "react-router-dom";

const UserVisitPage = () => {
  const { id: userId } = useParams();
  const { user } = useAuth();
  const [fetchedUser, setFetchedUser] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bio, setBio] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [flags, setFlags] = useState([]);
  const [haveRead, setHaveRead] = useState([]);
  const [reading, setReading] = useState([]);
  const [willRead, setWillRead] = useState([]);
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    if (!user || !userId)
      return;
    const fetchUserData = async () => {
      try {
        const token = await getFirebaseToken();
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFetchedUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user, userId]);

  useEffect(() => {
    if (!fetchedUser || !fetchedUser.id) {
      console.error("User is not available.");
      return;
    }
    setBio(fetchedUser.description);
    setCategories(fetchedUser.favoriteGenres);

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
      }
    };

    const fetchFlags = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/readStatus/get-readStatus/${fetchedUser.id}`
        );
        setFlags(response.data || []);
      } catch (error) {
        console.error("Error fetching flags:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/review/get-last-ten-reviews/${fetchedUser.id}`
        );
        setReviews(response.data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
    fetchFlags();
    fetchReviews();
  }, [fetchedUser]);

  useEffect(() => {
    const filterFlags = () => {
      const filteredHaveRead = flags.filter(flag => flag.status === "Already Read");
      const filteredReading = flags.filter(flag => flag.status === "Reading");
      const filteredWillRead = flags.filter(flag => flag.status === "Will Read");
      setHaveRead(filteredHaveRead);
      setReading(filteredReading);
      setWillRead(filteredWillRead);
    }

    filterFlags();
  }, [flags]);

  const handleSendFriendRequest = async () => {
    if (!user) return;

    try {
      const token = await getFirebaseToken();
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/friend/send-request/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Friend request sent!", {
        position: "top-right",
        autoClose: 2000,
      });
      setRequestSent(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    !loading && (
      <div className="user-visit">
        <div className="user-visit-container">
          <div className="visit-profile-container">
            <div className="profile-section">
              <img src={`${process.env.PUBLIC_URL}/${fetchedUser.imagePath}`} alt={fetchedUser.name} />
              <div className="profile-info">
                <h2 className="profile-name">{fetchedUser.name}</h2>
              </div>
              <div className="profile-btns">
                {!friends.some((friend) => friend.id === fetchedUser.id) && (
                  <button
                    className="friend-request-button"
                    onClick={handleSendFriendRequest}
                    disabled={requestSent}
                  >
                    {requestSent ? "Request Sent" : "Send Friend Request"}
                  </button>
                )}
              </div>
            </div>
            <div className="personal-information-box">
              <div className="personal-info-header">
                <h3>Personal Information</h3>
              </div>
              <p className="bio-text">{bio}</p>
            </div>
            <div className="favorite-categories-box">
              <div className="favorite-categories-header">
                <h3>Favorite Categories</h3>
              </div>
              <ul className="favorite-categories">
                {categories.map((category, index) => (
                  <li key={index}>{category.name}</li>
                ))}
              </ul>
            </div>

            <div className="profile-lists">
              <UserPageBookList
                title="Books Have Read"
                items={haveRead}
              />
              <UserPageBookList
                title="Books Reading"
                items={reading}
              />
              <UserPageBookList
                title="Books Will Read"
                items={willRead}
              />
            </div>
          </div>
          <div className="reviews-section">
            <h3>Last 10 Reviews</h3>

            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <Link to={`/book/${review?.book.id}`}>
                    {review.book ? (
                      <>
                        <h4 className="review-book-name">{review.book.name}</h4>

                        <div className="review-info">
                          <div className="review-rating">
                            <Rating score={review.score} />
                          </div>
                          <p className="review-content">
                            {review.content}
                          </p>
                        </div>
                      </>
                    ) : (
                      <h4 className="review-book-name">Unknown Book</h4>
                    )}

                    <div className="review-actions">
                      <p className="like">
                        <BiLike /> <span>{review.likeCount}</span>
                      </p>
                      <p className="dislike" >
                        <BiDislike /> <span>{review.dislikeCount}</span>
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
          </div>

        </div>
      </div >
    )
  );
};

export default UserVisitPage;
