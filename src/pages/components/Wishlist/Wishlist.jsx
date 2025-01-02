import React, { useState, useEffect } from "react";
import "./Wishlist.css";
import { Link } from "react-router-dom";
import axiost from "../../../axiosConfig.js";
import { getFirebaseToken } from "../firebase/getFirebaseToken";
import { FaHeart } from "react-icons/fa";

const WishlistPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            setLoading(true);
            try {
                const token = await getFirebaseToken();
                const response = await axiost.get(
                    `${process.env.REACT_APP_API_BASE_URL}/wishList/get-items`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const booksData = response.data.map(item => item.book);
                setBooks(booksData);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    return (
        <div className="wishlist-page">
            <div className="results-section">
                {loading ? (
                    <div>Loading...</div>
                ) : <>
                    <div className="wishlist-header"><p><FaHeart /></p> <h3>My Wishlist</h3></div>
                    {books.length ? (
                    <div className="search-book-results">
                        {books.map((book) => (
                            <Link key={book.id} to={`/book/${book.id}`} className="search-book">
                                <div className="search-book-image">
                                    <img src={`${process.env.PUBLIC_URL}/${book.imagePath}`} alt={book.name} />
                                </div>
                                <div className="search-book-details">
                                    <div className="search-book-details-first">
                                        <h2 className="search-book-title">{book.name}</h2>
                                        <p className="search-book-author">{book.writer}</p>
                                    </div>
                                </div>
                                <div className="other-book-info">
                                    <p>{book.pageNumber} Pages</p>
                                    <p>{book.language}</p>
                                    <p>{book.datePublished}</p>
                                    <p>{book.bookDimension}</p>
                                    <p>{book.isbn}</p>
                                    <p>Edition {book.editionNumber}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    ) : <p> No books found!</p>}
                </>
                }
            </div>
        </div>
    );
};

export default WishlistPage;