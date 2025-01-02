import { FaWallet } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Rating from '../components/Rating/Rating';
import WalletPopup from '../components/WalletPopup/WalletPopup';
import './UserPage.css';
import { BiLike, BiDislike } from "react-icons/bi";
import { getFirebaseToken } from "../components/firebase/getFirebaseToken";
import axiost from "../../axiosConfig.js";
import { useAuth } from '../../AuthContext.js';
import { toast } from "react-toastify";
import UserPageBookList from '../components/UserPageBookList/UserPageBookList';
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { Link } from "react-router-dom";

const UserPage = () => {
  const { user, fetchedUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [flags, setFlags] = useState([]);
  const [haveRead, setHaveRead] = useState([]);
  const [reading, setReading] = useState([]);
  const [willRead, setWillRead] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [bio, setBio] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingFriends, setIsEditingFriends] = useState(false);
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allGenres, setAllGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!fetchedUser) {
      console.error("User is not available.");
      return;
    }
    setBio(fetchedUser.description);
    setCategories(fetchedUser.favoriteGenres);
    const fetchFriends = async () => {
      try {
        const token = await getFirebaseToken();
        const response = await axiost.get(
          `${process.env.REACT_APP_API_BASE_URL}/friend/get-friends`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFriends(response.data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const token = await getFirebaseToken();
        const response = await axiost.get(
          `${process.env.REACT_APP_API_BASE_URL}/friend/get-friend-requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFriendRequests(response.data || []);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    const fetchFlags = async () => {
      try {
        const response = await axiost.get(
          `${process.env.REACT_APP_API_BASE_URL}/readStatus/get-readStatus/${fetchedUser.id}`
        );
        setFlags(response.data || []);
      } catch (error) {
        console.error("Error fetching flags:", error);
      }
    };

    const fetchReviews = async () => {
      if (!fetchedUser) {
        console.error("User is not available.");
        return;
      }
      try {
        const response = await axiost.get(
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
    fetchFriendRequests();
    fetchFlags();
    fetchReviews();
  }, [fetchedUser, refresh]);

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
  }, [flags, refresh]);

  const fetchAllGenres = async () => {
    try {
      const response = await axiost.get(`${process.env.REACT_APP_API_BASE_URL}/genre/get-all-genres`);
      setAllGenres(response.data || []);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const openWallet = () => setIsWalletOpen(true);
  const closeWallet = () => setIsWalletOpen(false);

  const goToOrderHistory = () => navigate('/user/order-history');
  const goToWishList = () => navigate('/user/wishlist');

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleEditBio = async () => {
    if (isEditingBio) {
      try {
        const token = await getFirebaseToken();
        await axiost.put(
          `${process.env.REACT_APP_API_BASE_URL}/user/${fetchedUser.id}`,
          { description: bio },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        refreshPage();
      } catch (error) {
        console.error('Error updating bio:', error);
        toast.error('Failed to update personal information.');
      }
    }
    setIsEditingBio(!isEditingBio);
  };

  const handleEditCategories = async () => {
    if (isEditingCategories) {
      try {
        const token = await getFirebaseToken();
        await axiost.put(
          `${process.env.REACT_APP_API_BASE_URL}/user/${fetchedUser.id}`,
          { favoriteGenres: categories },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        refreshPage();
      } catch (error) {
        console.error('Error updating categories:', error);
        toast.error('Failed to update categories.');
      }
    } else {
      fetchAllGenres();
    }
    setRefresh((prev) => !prev);
    setIsEditingCategories(!isEditingCategories);
  };

  const handleAddCategory = (genre) => {
    if (!categories.some(category => category.id === genre.id)) {
      setCategories([...categories, genre]);
    }
  };

  const handleRemoveCategory = (genreId) => {
    setCategories(categories.filter(category => category.id !== genreId));
  };

  const handleEditFriends = async () => {
    setIsEditingFriends(!isEditingFriends);
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = await getFirebaseToken();
      await axiost.patch(
        `${process.env.REACT_APP_API_BASE_URL}/friend/accept-request/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh((prev) => !prev);
      toast.success('Friend request accepted!');

    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = await getFirebaseToken();
      await axiost.delete(
        `${process.env.REACT_APP_API_BASE_URL}/friend/delete-friend-or-request/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh((prev) => !prev);
      toast.success('Friend request rejected!');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request.');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const token = await getFirebaseToken();
      await axiost.delete(
        `${process.env.REACT_APP_API_BASE_URL}/friend/delete-friend-or-request/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends(friends.filter(friend => friend.id !== friendId));
      toast.success('Friend removed successfully!');
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend.');
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    !loading && (
      <div className="user-page">
        <div className="user-page-container">
          <div className="profile-container">
            <div className="profile-section">
              <img src={`${process.env.PUBLIC_URL}/${fetchedUser.imagePath}`} alt={fetchedUser.name} />
              <div className="profile-info">
                <h2 className="profile-name">{fetchedUser.name}</h2>
                <p className="profile-email">{fetchedUser.email}</p>
              </div>
              <div className="profile-btns">
                <button className="order-history-button" onClick={goToOrderHistory}>
                  My Order History
                </button>
                <button className="wish-list-button" onClick={goToWishList}>
                  My Wishlist
                </button>
              </div>
            </div>
            <div className="wallet-section" onClick={openWallet} >
              <FaWallet
                className="wallet-button"
              />
              <div className="balance-text">
                <p className="wallet-balance">Current Balance: <b>${fetchedUser.balance}</b></p>
                <p className="wallet-balance">
                  {user.role !== "user" ? (
                    <p> Gift Card / Load Money / Withdraw Money </p>
                  ) : (
                    <p> Gift Card / Load Money </p>
                  )}
                </p>
              </div>
            </div>
            <div className="personal-information-box">
              <div className="personal-info-header">
                <h3>Personal Information</h3>
                <button className="edit-button" onClick={handleEditBio}>
                  {isEditingBio ? 'Save' : 'Edit'}
                </button>
              </div>
              {isEditingBio ? (
                <textarea
                  value={bio}
                  onChange={handleBioChange}
                  className="bio-textarea"
                />
              ) : (
                <p className="bio-text">{bio}</p>
              )}
            </div>
            <div className="favorite-categories-box">
              <div className="favorite-categories-header">
                <h3>Favorite Categories</h3>
                <button className="edit-button" onClick={handleEditCategories}>
                  {isEditingCategories ? 'Save' : 'Edit'}
                </button>
              </div>
              {isEditingCategories ? (
                <div>
                  <ul className="favorite-categories">
                    {categories.map(category => (
                      <li key={category.id}>
                        {category.name}
                        <p className="remove-category" onClick={() => handleRemoveCategory(category.id)}><CiCircleRemove /></p>
                      </li>
                    ))}
                  </ul>
                  <select onChange={(e) => handleAddCategory(allGenres.find(genre => genre.id === Number(e.target.value)))}>
                    <option value="">Select a genre</option>
                    {allGenres.map(genre => (
                      <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <ul className="favorite-categories">
                  {categories.map((category, index) => (
                    <li key={index}>{category.name}</li>
                  ))}
                </ul>
              )}
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
          <div className="friends-container">
            {friends.length > 0 &&
              <div className="friends-list-box">
                <div className="friends-list-header">
                  <h3>Friends List</h3>
                  <button className="edit-button" onClick={handleEditFriends}>
                    {isEditingFriends ? 'Save' : 'Edit'}
                  </button>
                </div>
                <ul className="friends-list">
                  {friends.map(friend => (
                    <li key={friend.id}>
                      <Link to={`/user/${friend.id}`}>{friend.name}</Link>

                      {isEditingFriends && (
                        <p className="remove-friend" onClick={() => handleRemoveFriend(friend.id)}>
                          <CiCircleRemove />
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            }
            {friendRequests.length > 0 && (
              <div className="friend-request-box">
                <div className="friend-request-header">
                  <h3>Friend Requests</h3>
                </div>
                <ul className="friend-requests">
                  {friendRequests.map((request) => (
                    <li key={request.id}>
                      <Link to={`/user/${request.id}`}>{request.name}</Link>
                      <p className="accept-friend" onClick={() => handleAcceptRequest(request.id)}>
                        <CiCircleCheck />
                      </p>
                      <p className="reject-friend" onClick={() => handleRejectRequest(request.id)}>
                        <CiCircleRemove />
                      </p>
                    </li>
                  ))}
                </ul>
              </div>)}
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
        {isWalletOpen && <WalletPopup onClose={closeWallet} />}
      </div>
    )
  );
};

export default UserPage;
