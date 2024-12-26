import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <Link to={`/book/${book.id}`}>
        <div className="card-book-image">
          <img src={`${process.env.PUBLIC_URL}/${book.imagePath}`} alt={book.name} />
        </div>
        <h3>{book.name}</h3>
        <p>{book.writer}</p>
        <div className="card-book-price">
          {book.discountPercentage > 0 ? (
            <>
              <div className="card-book-normal-price">
                <strong> <del>${parseFloat(book.price).toFixed(2)}</del> </strong>
              </div>
              <div className="card-book-discount"> -{book.discountPercentage}% </div>
            </>
          ) : null}
          <div className="card-book-final-price">
            <strong>${parseFloat(book.finalPrice).toFixed(2)}</strong>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BookCard;