import React, { useState, useEffect } from "react";
import "./SearchFilterPage.css";
import Sidebar from "../components/Sidebar/Sidebar";
import BookGrid from "../components/BookGrid/BookGrid";
import { useSearch } from "../../SearchContext";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa6";
import { FaPenAlt } from "react-icons/fa";
import { IoPrintSharp } from "react-icons/io5";
import axios from "axios";
import { ClipLoader } from 'react-spinners';

const SearchFilterPage = () => {
    const {
        searchQuery,
        genreFilter,
        priceRange,
        ratingRange,
    } = useSearch();
    const [books, setBooks] = useState([]);
    const [uniqueAuthors, setUniqueAuthors] = useState([]);
    const [uniquePublishers, setUniquePublishers] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [filteredPublishers, setFilteredPublishers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooksAndDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/book/get-all-books`);
                const booksData = response.data;
                const sortedBooks = booksData.sort((a, b) => a.id - b.id);
                setBooks(sortedBooks);

                const authors = Array.from(new Set(sortedBooks.map((book) => book.writer)));
                setUniqueAuthors(authors);

                const publishers = Array.from(
                    new Set(sortedBooks.map((book) => book.publisher.name))
                );
                setUniquePublishers(publishers);
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

        if (searchQuery.trim() !== "") {
            const lowerCaseQuery = searchQuery.toLowerCase();

            bookResults = bookResults.filter((book) =>
                book.name.toLowerCase().includes(lowerCaseQuery)
            );

            const filteredAuthors = uniqueAuthors.filter((author) =>
                author.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredAuthors(filteredAuthors);

            const filteredPublishers = uniquePublishers.filter((publisher) =>
                publisher.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredPublishers(filteredPublishers);
        } else {
            setFilteredAuthors([]);
            setFilteredPublishers([]);
        }

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

        setFilteredBooks(bookResults);
    }, [books, searchQuery, genreFilter, priceRange, ratingRange, uniqueAuthors, uniquePublishers]);

    return (
        <div className="search-filter-page">
            <Sidebar />
            <div className="results-section">
                {loading ? (
                    <div style={{textAlign: "center"}}><ClipLoader color="#007bff" size={20} /></div>
                ) : searchQuery.trim() ? (
                    <>
                        <h2>Search Results</h2>
                        <div className="search-results-line"></div>
                        <div className="search-book-header"><p><FaBook /></p><h3>Books</h3></div>
                        <BookGrid books={filteredBooks} />
                        <div className="search-author-header"><p><FaPenAlt /></p> <h3>Authors</h3></div>
                        <div className="search-author-results">
                            {filteredAuthors.length > 0 ? (
                                filteredAuthors.map((author) => (
                                    <div key={author} className="search-author">
                                        <Link to={`/author/${encodeURIComponent(author)}`}>{author}</Link>
                                    </div>
                                ))
                            ) : (
                                <p className="no-found">No authors found!</p>
                            )}
                        </div>
                        <div className="search-publisher-header"><p><IoPrintSharp /></p> <h3>Publishers</h3></div>
                        <div className="search-publisher-results">
                            {filteredPublishers.length > 0 ? (
                                filteredPublishers.map((publisher) => (
                                    <div key={publisher} className="search-publisher">
                                        <Link to={`/publisher/${encodeURIComponent(publisher)}`}>{publisher}</Link>
                                    </div>
                                ))
                            ) : (
                                <p className="no-found">No publishers found!</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="search-book-header"><p><FaBook /> </p> <h3>Filtered Books</h3></div>
                        <BookGrid books={filteredBooks} />
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchFilterPage;