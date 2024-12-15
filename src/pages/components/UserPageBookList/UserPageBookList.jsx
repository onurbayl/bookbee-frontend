import React from 'react';
import './UserPageBookList.css';

const UserPageBookList = ({ title, books, onEdit }) => {
  return (
    <div className="userpage-booklist">
      <div className="list-header">
        <h3>{title}</h3>
        <button className="edit-button" onClick={onEdit}>
          Edit
        </button>
      </div>
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            <span>{book}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPageBookList;
