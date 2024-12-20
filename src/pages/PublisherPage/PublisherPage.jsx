import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import BookGrid from "../components/BookGrid/BookGrid";
import "./PublisherPage.css";
import { useSearch } from "../../SearchContext";
import { IoPrintSharp } from "react-icons/io5";

const books = [
    {
        id: 1,
        name: "Animal Farm",
        description: `A farm is taken over by its overworked, mistreated animals. With flaming idealism and stirring slogans, they set out to create a paradise of progress, justice, and equality. Thus the stage is set for one of the most telling satiric fables ever penned—a razor-edged fairy tale for grown-ups that records the evolution from revolution against tyranny to a totalitarianism just as terrible.
        When Animal Farm was first published, Stalinist Russia was seen as its target. Today it is devastatingly clear that wherever and whenever freedom is attacked, under whatever banner, the cutting clarity and savage comedy of George Orwell's masterpiece have a meaning and message still ferociously fresh.`,
        writer: "George Orwell",
        publisher: "Penguin Publishing Group",
        pageNumber: 176,
        datePublished: 2004,
        language: "English",
        bookDimension: "8.5x5.5 inches",
        barcode: 4567890123456,
        isbn: "978-0-19-852663-6",
        editionNumber: 2,
        genre: "Fantasy",
        rating: 2.75,
        reviewCount: 2,
        normalPrice: 22.00,
        discountPercentage: 10,
        finalPrice: 19.80
    },
    { id: 2, name: "The Picture of Dorian Gray", writer: "Oscar Wilde", publisher: "HarperCollins", genre: "Fantasy", normalPrice: 50, discountPercentage: 0, finalPrice: 50, rating: 4.8 },
    { id: 3, name: "Anna Karenina", writer: "Leo Tolstoy", publisher: "Oxford University Press", genre: "World Classics", normalPrice: 20, discountPercentage: 25, finalPrice: 15, rating: 4.3 },
    { id: 4, name: "The Hobbit", writer: "J.R.R. Tolkien", publisher: "Oxford University Press", genre: "Fantasy", normalPrice: 35, discountPercentage: 10, finalPrice: 31.5, rating: 4.9 },
    { id: 5, name: "Self-Help Book", writer: "George Orwell", publisher: "Self-Publishers Inc.", genre: "Self-Help", normalPrice: 40, discountPercentage: 50, finalPrice: 20, rating: 3.9 },
];

const publishers = [
    { id: 1, name: "Penguin Classics" },
    { id: 2, name: "HarperCollins" },
    { id: 3, name: "Oxford University Press" },
    { id: 4, name: "George Allen & Unwin" },
    { id: 5, name: "Self-Publishers Inc." },
];


const PublisherPage = () => {
    const { id } = useParams();
    const {
        genreFilter,
        priceRange,
        ratingRange,
    } = useSearch();
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [publisherName, setPublisherName] = useState("");

    useEffect(() => {
        const publisher = publishers.find((publisher) => publisher.id === parseInt(id, 10));
        if (publisher) {
            setPublisherName(publisher.name);

            let publisherBooks = books.filter((book) => book.publisher === publisher.name);

            if (genreFilter.length > 0) {
                publisherBooks = publisherBooks.filter((book) => genreFilter.includes(book.genre));
            }
            publisherBooks = publisherBooks.filter(
                (book) => book.finalPrice >= priceRange[0] && book.finalPrice <= priceRange[1]
            );
            publisherBooks = publisherBooks.filter(
                (book) => book.rating >= ratingRange[0] && book.rating <= ratingRange[1]
            );

            setFilteredBooks(publisherBooks);
        }
    }, [id, genreFilter, priceRange, ratingRange]);

    return (
        <div className="publisher-books-page">
            <Sidebar />
            <div className="publisher-results-section">
            <div className="publisher-book-header"><p><IoPrintSharp /></p><h3>{publisherName}</h3></div>
                <div className="publisher-results-line"></div>
                <BookGrid books={filteredBooks} />
            </div>
        </div>
    );
};

export default PublisherPage;