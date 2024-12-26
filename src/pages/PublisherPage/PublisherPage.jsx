import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import BookGrid from "../components/BookGrid/BookGrid";
import "./PublisherPage.css";
import { useSearch } from "../../SearchContext";
import { IoPrintSharp } from "react-icons/io5";
import axios from "axios";

const PublisherPage = () => {
    const { id } = useParams();
    const {genreFilter, priceRange, ratingRange} = useSearch();
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [publisherName, setPublisherName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooksByPublisher = async () => {
            setLoading(true);
            try {
                const booksResponse = await axios.get("http://localhost:3000/api/v1/book/get-all-books");
                const books = booksResponse.data || [];

                const decodedPublisherName = decodeURIComponent(id);
                setPublisherName(decodedPublisherName);

                let publisherBooks = books.filter((book) => book.publisher.name === decodedPublisherName);

                const booksWithDetails = await Promise.all(
                    publisherBooks.map(async (book) => {
                        let discountPercentage = 0;
                        let finalPrice = parseFloat(book.price);
                        let rating = 0;
                        let reviewCount = 0;

                        try {
                            const discountResponse = await axios.get(
                                `http://localhost:3000/api/v1/discount/get-discount/${book.id}`
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
                                `http://localhost:3000/api/v1/review/get-reviews-book/${book.id}`
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
                    publisherBooks = booksWithDetails.filter((book) =>
                        book.genres.some((genre) => genreFilter.includes(genre.name))
                    );
                }
                publisherBooks = booksWithDetails.filter(
                    (book) => book.finalPrice >= priceRange[0] && book.finalPrice <= priceRange[1]
                );
                publisherBooks = booksWithDetails.filter(
                    (book) => book.rating >= ratingRange[0] && book.rating <= ratingRange[1]
                );

                setFilteredBooks(publisherBooks);
            } catch (error) {
                console.error("Error fetching books by publisher:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksByPublisher();
    }, [id, genreFilter, priceRange, ratingRange]);

    return (
        <div className="publisher-books-page">
            <Sidebar />
            <div className="publisher-results-section">
                {loading ? (
                    <div className="loading-spinner">Loading books...</div>
                ) : (
                    <>
                        <div className="publisher-book-header"><p><IoPrintSharp /></p><h3>{publisherName}</h3></div>
                        <div className="publisher-results-line"></div>
                        <BookGrid books={filteredBooks} />
                    </>
                )}
            </div>
        </div>
    );
};

export default PublisherPage;