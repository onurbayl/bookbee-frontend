import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import BookGrid from "../components/BookGrid/BookGrid";
import "./AuthorPage.css";
import { useSearch } from "../../SearchContext";
import { FaPenAlt } from "react-icons/fa";
import axios from "axios";

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

                const booksWithDetails = await Promise.all(
                    authorBooks.map(async (book) => {
                        let discountPercentage = 0;
                        let finalPrice = parseFloat(book.price);
                        let rating = 0;
                        let reviewCount = 0;

                        try {
                            const discountResponse = await axios.get(
                                `${process.env.REACT_APP_API_BASE_URL}/discount/get-discount/${book.id}`
                            );
                            if (discountResponse.data) {
                                discountPercentage = discountResponse.data.discountPercentage || 0;
                                finalPrice =
                                    parseFloat(book.price) -
                                    parseFloat(book.price) * (discountPercentage / 100);
                            }
                        } catch (error) {
                            console.error(`Error fetching discount for book ID ${book.id}:`, error);
                        }

                        try {
                            const reviewsResponse = await axios.get(
                                `${process.env.REACT_APP_API_BASE_URL}/review/get-reviews-book/${book.id}`
                            );
                            const reviews = reviewsResponse.data || [];
                            reviewCount = reviews.length;
                            const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
                            rating = reviewCount > 0 ? totalScore / reviewCount / 2 : 0;
                        } catch (error) {
                            console.error(`Error fetching reviews for book ID ${book.id}:`, error);
                        }

                        return {
                            ...book,
                            discountPercentage,
                            finalPrice,
                            rating: parseFloat(rating),
                            reviewCount,
                        };
                    })
                );

                if (genreFilter.length > 0) {
                    authorBooks = booksWithDetails.filter((book) =>
                        book.genres.some((genre) => genreFilter.includes(genre.name))
                    );
                }
                authorBooks = booksWithDetails.filter(
                    (book) => book.finalPrice >= priceRange[0] && book.finalPrice <= priceRange[1]
                );
                authorBooks = booksWithDetails.filter(
                    (book) => book.rating >= ratingRange[0] && book.rating <= ratingRange[1]
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
                    <div className="loading-spinner">Loading books...</div>
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