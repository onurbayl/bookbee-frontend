import React, { useState, useEffect } from "react";
import "./MostWishedForPage.css";
import Sidebar from "../components/Sidebar/Sidebar";
import BookGrid from "../components/BookGrid/BookGrid";
import { useSearch } from "../../SearchContext";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';

const MostWishedForPage = () => {
    const {
        searchQuery,
        genreFilter,
        priceRange,
        ratingRange,
    } = useSearch();
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooksAndDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/book/get-all-books-wishlist`);
                const booksData = response.data;
                setBooks(booksData);
                
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksAndDetails();
    }, []);

    useEffect(() => {
        let bookResults = [...books];

        if (genreFilter.length > 0) {
            bookResults = bookResults.filter((book) =>
                book.genres.some((genre) => genreFilter.includes(genre.name))
            );
        }

        bookResults = bookResults.filter(
            (book) => parseFloat(book.finalPrice) >= priceRange[0] && parseFloat(book.finalPrice) <= priceRange[1]
        );

        bookResults = bookResults.filter(
            (book) => book.averageReviewScore / 2 >= ratingRange[0] && book.averageReviewScore / 2 <= ratingRange[1]
        );

        setFilteredBooks(bookResults.slice(0, 20));
    }, [books, searchQuery, genreFilter, priceRange, ratingRange,]);

    return (
        <div className="most-wished-page">
            <Sidebar />
            <div className="results-section">
                {loading ? (
                    <div style={{textAlign: "center"}}><ClipLoader color="#007bff" size={20} /></div>
                ) :
                    <>
                        <div className="wished-book-header"><p><FaHeart /></p> <h3>Most Wished For Books</h3></div>
                        <BookGrid books={filteredBooks} enableSort={false}/>
                    </>
                }
            </div>
        </div>
    );
};

export default MostWishedForPage;