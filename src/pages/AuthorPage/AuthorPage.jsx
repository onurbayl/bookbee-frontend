import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import BookGrid from "../components/BookGrid/BookGrid";
import "./AuthorPage.css";
import { useSearch } from "../../SearchContext";
import { FaPenAlt } from "react-icons/fa";

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
    { id: 4, name: "The Hobbit", writer: "J.R.R. Tolkien", publisher: "George Allen & Unwin", genre: "Fantasy", normalPrice: 35, discountPercentage: 10, finalPrice: 31.5, rating: 4.9 },
    { id: 5, name: "Self-Help Book", writer: "George Orwell", publisher: "Self-Publishers Inc.", genre: "Self-Help", normalPrice: 40, discountPercentage: 50, finalPrice: 20, rating: 3.9 },
];

const authors = [
    { id: 1, name: "George Orwell" },
    { id: 2, name: "Oscar Wilde" },
    { id: 3, name: "Leo Tolstoy" },
    { id: 4, name: "J.R.R. Tolkien" },
    { id: 5, name: "John Doe" },
];

const AuthorPage = () => {
    const { id } = useParams();
    const {
        genreFilter,
        priceRange,
        ratingRange
    } = useSearch();
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [authorName, setAuthorName] = useState("");

    useEffect(() => {
        const author = authors.find((author) => author.id === parseInt(id, 10));
        if (author) {
            setAuthorName(author.name);

            let authorBooks = books.filter((book) => book.writer === author.name);

            if (genreFilter.length > 0) {
                authorBooks = authorBooks.filter((book) => genreFilter.includes(book.genre));
            }
            authorBooks = authorBooks.filter(
                (book) => book.finalPrice >= priceRange[0] && book.finalPrice <= priceRange[1]
            );
            authorBooks = authorBooks.filter(
                (book) => book.rating >= ratingRange[0] && book.rating <= ratingRange[1]
            );

            setFilteredBooks(authorBooks);
        }
    }, [id, genreFilter, priceRange, ratingRange]);

    return (
        <div className="author-books-page">
            <Sidebar />
            <div className="author-results-section">
            <div className="author-book-header"><p><FaPenAlt /></p><h3>{authorName}</h3></div>
                <div className="author-results-line"></div>
                <BookGrid books={filteredBooks} />
            </div>
        </div>
    );
};

export default AuthorPage;