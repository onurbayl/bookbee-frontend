import React, { useState } from 'react';
import './Profile.css';
import UserPageBookList from '../UserPageBookList/UserPageBookList';

const currentlyReading = ['The Great Gatsby', 'To Kill a Mockingbird', '1984'];
const wishlist = ['The Catcher in the Rye', 'The Road', 'The Alchemist'];
const booksRead = ['Moby Dick', 'Pride and Prejudice', 'War and Peace'];
const mockFriendsList = ['John Doe', 'Jane Smith', 'Mark Johnson', 'Alice Brown', 'Bob White']; // Mock Friends
const favoriteCategories = ['Fiction', 'Classics', 'Philosophy'];

const Profile = () => {
  const [bio, setBio] = useState(
    "I'm an avid reader who loves to get lost in stories that make me think..."
  );
  const [friends, setFriends] = useState(mockFriendsList);
  const [categories, setCategories] = useState(favoriteCategories);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingFriends, setIsEditingFriends] = useState(false);
  const [isEditingCategories, setIsEditingCategories] = useState(false);

  const handleEditBio = () => {
    if (isEditingBio) {
      console.log('Saved bio:', bio);
    }
    setIsEditingBio(!isEditingBio);
  };

  const handleEditFriends = () => {
    if (isEditingFriends) {
      console.log('Saved friends list:', friends);
    }
    setIsEditingFriends(!isEditingFriends);
  };

  const handleEditCategories = () => {
    if (isEditingCategories) {
      console.log('Saved favorite categories:', categories);
    }
    setIsEditingCategories(!isEditingCategories);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleFriendsChange = (event, index) => {
    const updatedFriends = [...friends];
    updatedFriends[index] = event.target.value;
    setFriends(updatedFriends);
  };

  const handleCategoriesChange = (event, index) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = event.target.value;
    setCategories(updatedCategories);
  };

  const handleEditList = (listName) => {
    console.log(`Edit ${listName}`);
  };

  return (
    <div className="profile-container">
      {/* Profile Section */}
      <div className="profile-section">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="profile-picture"
        />
        <h2 className="profile-name">User Name</h2>
      </div>

      {/* Personal Information */}
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

      {/* Favorite Categories */}
      <div className="favorite-categories-box">
        <div className="favorite-categories-header">
          <h3>Favorite Categories</h3>
          <button className="edit-button" onClick={handleEditCategories}>
            {isEditingCategories ? 'Save' : 'Edit'}
          </button>
        </div>
        {isEditingCategories ? (
          <div>
            {categories.map((category, index) => (
              <input
                key={index}
                type="text"
                value={category}
                onChange={(e) => handleCategoriesChange(e, index)}
                className="category-input"
              />
            ))}
          </div>
        ) : (
          <ul className="favorite-categories">
            {categories.map((category, index) => (
              <li key={index}>{category}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Friends List */}
      <div className="friends-list-box">
        <div className="friends-list-header">
          <h3>Friends List</h3>
          <button className="edit-button" onClick={handleEditFriends}>
            {isEditingFriends ? 'Save' : 'Edit'}
          </button>
        </div>
        {isEditingFriends ? (
          <div>
            {friends.map((friend, index) => (
              <input
                key={index}
                type="text"
                value={friend}
                onChange={(e) => handleFriendsChange(e, index)}
                className="friend-input"
              />
            ))}
          </div>
        ) : (
          <ul className="friends-list">
            {friends.map((friend, index) => (
              <li key={index}>{friend}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Book Lists */}
      <div className="profile-lists">
        <UserPageBookList
          title="Currently Reading"
          books={currentlyReading}
          onEdit={() => handleEditList('Currently Reading')}
        />
        <UserPageBookList
          title="Wishlist"
          books={wishlist}
          onEdit={() => handleEditList('Wishlist')}
        />
        <UserPageBookList
          title="Books Read"
          books={booksRead}
          onEdit={() => handleEditList('Books Read')}
        />
      </div>
    </div>
  );
};

export default Profile;
