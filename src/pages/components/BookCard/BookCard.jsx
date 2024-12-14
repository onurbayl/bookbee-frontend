import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <Link to={`/book/${book.id}`}>
        <div className="book-image-placeholder"></div>
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <span>${book.price.toFixed(2)}</span>
      </Link>
    </div>
  );
}

export default BookCard;