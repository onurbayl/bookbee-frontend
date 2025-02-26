import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import BookGrid from "../components/BookGrid/BookGrid";
import "./PublisherPage.css";
import { useSearch } from "../../SearchContext";
import { IoPrintSharp } from "react-icons/io5";
import axiost from "../../axiosConfig.js";
import { ClipLoader } from 'react-spinners';

const PublisherPage = () => {
    const { id } = useParams();
    const { genreFilter, priceRange, ratingRange } = useSearch();
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [publisherName, setPublisherName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooksByPublisher = async () => {
            setLoading(true);
            try {
                const booksResponse = await axiost.get(`${process.env.REACT_APP_API_BASE_URL}/book/get-all-books`);
                const books = booksResponse.data || [];

                const decodedPublisherName = decodeURIComponent(id);
                setPublisherName(decodedPublisherName);

                let publisherBooks = books.filter((book) => book.publisher.name === decodedPublisherName);

                if (genreFilter.length > 0) {
                    publisherBooks = publisherBooks.filter((book) =>
                        book.genres.some((genre) => genreFilter.includes(genre.name))
                    );
                }
                publisherBooks = publisherBooks.filter(
                    (book) => book.finalPrice >= priceRange[0] && book.finalPrice <= priceRange[1]
                );
                publisherBooks = publisherBooks.filter(
                    (book) => book.averageReviewScore / 2 >= ratingRange[0] && book.averageReviewScore / 2 <= ratingRange[1]
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
                    <div style={{textAlign: "center"}}><ClipLoader color="#007bff" size={20} /></div>
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