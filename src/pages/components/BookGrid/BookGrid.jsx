import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BookGrid.css";
import { GrPrevious, GrNext } from "react-icons/gr";
import { FaSortAlphaDown, FaSortAlphaDownAlt, FaSortAmountDown, FaSortAmountDownAlt, FaDollarSign } from "react-icons/fa";

const BookGrid = ({ books, enableEdit = false, enableSort = true }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState(null);
    const booksPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [sortOption]);

    const sortedBooks = (() => {
        let sorted = [...books];

        if (sortOption === "name-asc") {
            sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name-desc") {
            sorted = sorted.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === "price-asc") {
            sorted = sorted.sort((a, b) => a.finalPrice - b.finalPrice);
        } else if (sortOption === "price-desc") {
            sorted = sorted.sort((a, b) => b.finalPrice - a.finalPrice);
        }

        return sorted;
    })();

    const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return books.length > 0 ? (
        <>
            {enableSort && (<div className="sort-buttons">
                <p onClick={() => setSortOption("name-asc")}><FaSortAlphaDown /> </p>
                <p onClick={() => setSortOption("name-desc")}><FaSortAlphaDownAlt /> </p>
                <p onClick={() => setSortOption("price-asc")}><FaSortAmountDownAlt /><FaDollarSign />
                </p>
                <p onClick={() => setSortOption("price-desc")}><FaSortAmountDown /><FaDollarSign />
                </p>
            </div>
            )}
            <div className="search-book-results">
                {currentBooks.map((book) => (
                    <Link key={book.id} to={`/book/${book.id}`} className="search-book">
                        <div className="search-book-image">
                            <img src={`${process.env.PUBLIC_URL}/${book.imagePath}`} alt={book.name} />
                        </div>
                        <div className="search-book-details">
                            <div className="search-book-details-first">
                                <h2 className="search-book-title">{book.name}</h2>
                                <p className="search-book-author">{book.writer}</p>
                                <p className="search-book-publisher">{book.publisher.name}</p>
                            </div>
                            <div className="search-book-details-second">
                                <p className="search-book-rating">★ {(book.averageReviewScore / 2).toFixed(1)}</p>
                            </div>
                        </div>
                        <div className="other-book-info">
                            <p>{book.genres.map((genre) => genre.name).join(", ")}</p>
                            <p>{book.pageNumber} Pages</p>
                            <p>{book.language}</p>
                            <p>{book.datePublished}</p>
                            <p>{book.bookDimension}</p>
                            <p>{book.isbn}</p>
                            <p>Edition {book.editionNumber}</p>
                        </div>
                        <div className="search-book-price">
                            {enableEdit ? (
                                <Link to={`/update-book/${book.id}`}><button className="search-btn update-btn">Edit</button></Link>
                            ) : null}
                            {book.discountPercentage > 0 ? (
                                <>
                                    <div className="search-book-normal-price">
                                        <strong> <del>${parseFloat(book.price).toFixed(2)}</del> </strong>
                                    </div>
                                    <div className="search-book-discount"> -{book.discountPercentage}% </div>
                                </>
                            ) : null}
                            <div className="search-book-final-price">
                                <strong>${parseFloat(book.finalPrice).toFixed(2)}</strong>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <GrPrevious />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <GrNext />
                </button>
            </div></>
    ) : <p className="no-found">No books found!</p>
};

export default BookGrid;
