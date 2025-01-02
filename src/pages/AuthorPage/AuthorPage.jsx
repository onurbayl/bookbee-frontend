import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import BookGrid from "../components/BookGrid/BookGrid";
import "./AuthorPage.css";
import { useSearch } from "../../SearchContext";
import { FaPenAlt } from "react-icons/fa";
import axios from "axios";
import { ClipLoader } from 'react-spinners';

const AuthorPage = () => {
    const { id } = useParams();
    const {genreFilter, priceRange, ratingRange} = useSearch();
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [authorName, setAuthorName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooksByAuthor = async () => {
            setLoading(true);
            try {
                const booksResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/book/get-all-books`);
                const books = booksResponse.data || [];

                const decodedAuthorName = decodeURIComponent(id);
                setAuthorName(decodedAuthorName);

                let authorBooks = books.filter((book) => book.writer === decodedAuthorName);

                if (genreFilter.length > 0) {
                    authorBooks = authorBooks.filter((book) =>
                        book.genres.some((genre) => genreFilter.includes(genre.name))
                    );
                }
                authorBooks = authorBooks.filter(
                    (book) => book.finalPrice >= priceRange[0] && book.finalPrice <= priceRange[1]
                );
                authorBooks = authorBooks.filter(
                    (book) => book.averageReviewScore / 2 >= ratingRange[0] && book.averageReviewScore / 2 <= ratingRange[1]
                );

                setFilteredBooks(authorBooks);
            } catch (error) {
                console.error("Error fetching books by author:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksByAuthor();
    }, [id, genreFilter, priceRange, ratingRange]);

    return (
        <div className="author-books-page">
            <Sidebar />
            <div className="author-results-section">
                {loading ? (
                    <div style={{textAlign: "center"}}><ClipLoader color="#007bff" size={20} /></div>
                ) : (
                    <>
                        <div className="author-book-header"><p><FaPenAlt /></p><h3>{authorName}</h3></div>
                        <div className="author-results-line"></div>
                        <BookGrid books={filteredBooks} />
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthorPage;