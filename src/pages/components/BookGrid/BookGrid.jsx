import React from "react";
import { Link } from "react-router-dom";
import "./BookGrid.css";

const BookGrid = ({ books }) => {
    return books.length > 0 ? (
        <div className="search-book-results">
            {books.map((book) => (
                <Link key={book.id} to={`/book/${book.id}`} className="search-book">
                    <div className="search-book-placeholder-image"></div>
                    <div className="search-book-details">
                        <div className="search-book-details-first">
                            <h2 className="search-book-title">{book.name}</h2>
                            <p className="search-book-author">{book.writer}</p>
                            <p className="search-book-publisher">{book.publisher}</p>
                        </div>
                        <div className="search-book-details-second">
                            <p className="search-book-rating">★ {book.rating}</p>
                        </div>
                    </div>
                    <div className="other-book-info">
                        <p>{book.genre}</p>
                        <p>{book.pageNumber} Pages</p>
                        <p>{book.language}</p>
                        <p>{book.datePublished}</p>
                        <p>{book.bookDimension}</p>
                        <p>{book.isbn}</p>
                        <p>Edition {book.editionNumber}</p>
                    </div>
                    <div className="search-book-price">
                        {book.discountPercentage > 0 ? (
                            <>
                                <div className="search-book-normal-price">
                                    <strong> <del>${book.normalPrice.toFixed(2)}</del> </strong>
                                </div>
                                <div className="search-book-discount"> -{book.discountPercentage}% </div>
                            </>
                        ) : null}
                        <div className="search-book-final-price">
                            <strong>${book.finalPrice.toFixed(2)}</strong>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    ) : <p className="no-found">No books found!</p>
};

export default BookGrid;
