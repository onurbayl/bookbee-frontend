import React from 'react';
import './UserPageBookList.css';
import { Link } from "react-router-dom";

const UserPageBookList = ({ title, items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="userpage-booklist">
      <div className="list-header">
        <h3>{title}</h3>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link to={`/book/${item.book.id}`}>
              <span>{item.book.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPageBookList;
