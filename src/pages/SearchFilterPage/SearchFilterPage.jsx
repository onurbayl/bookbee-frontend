import React, { useState, useEffect } from "react";
import "./SearchFilterPage.css";
import Sidebar from "../components/Sidebar/Sidebar";
import BookGrid from "../components/BookGrid/BookGrid";
import { useSearch } from "../../SearchContext";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa6";
import { FaPenAlt } from "react-icons/fa";
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
    { id: 4, name: "The Hobbit", writer: "J.R.R. Tolkien", publisher: "George Allen & Unwin", genre: "Fantasy", normalPrice: 35, discountPercentage: 10, finalPrice: 31.5, rating: 4.9 },
    { id: 5, name: "Self-Help Book", writer: "John Doe", publisher: "Self-Publishers Inc.", genre: "Self-Help", normalPrice: 40, discountPercentage: 50, finalPrice: 20, rating: 3.9 },
];

const authors = [
    { id: 1, name: "George Orwell" },
    { id: 2, name: "Oscar Wilde" },
    { id: 3, name: "Leo Tolstoy" },
    { id: 4, name: "J.R.R. Tolkien" },
    { id: 5, name: "John Doe" },
];

const publishers = [
    { id: 1, name: "Penguin Classics" },
    { id: 2, name: "HarperCollins" },
    { id: 3, name: "Oxford University Press" },
    { id: 4, name: "George Allen & Unwin" },
    { id: 5, name: "Self-Publishers Inc." },
];

const SearchFilterPage = () => {
    const {
        searchQuery,
        genreFilter,
        priceRange,
        ratingRange,
    } = useSearch();
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [filteredPublishers, setFilteredPublishers] = useState([]);

    useEffect(() => {
        let bookResults = books;

        if (searchQuery.trim() !== "") {
            const lowerCaseQuery = searchQuery.toLowerCase();

            bookResults = bookResults.filter((book) =>
                book.name.toLowerCase().includes(lowerCaseQuery)
            );

            const authorResults = authors.filter((author) =>
                author.name.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredAuthors(authorResults);

            const publisherResults = publishers.filter((publisher) =>
                publisher.name.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredPublishers(publisherResults);
        }
        else {
            setFilteredAuthors([]);
            setFilteredPublishers([]);
        }

        if (genreFilter.length > 0) {
            bookResults = bookResults.filter((book) => genreFilter.includes(book.genre));
        }
        bookResults = bookResults.filter(
            (book) => book.finalPrice >= priceRange[0] && book.finalPrice <= priceRange[1]
        );
        bookResults = bookResults.filter(
            (book) => book.rating >= ratingRange[0] && book.rating <= ratingRange[1]
        );

        setFilteredBooks(bookResults);
    }, [searchQuery, genreFilter, priceRange, ratingRange]);

    return (
        <div className="search-filter-page">
            <Sidebar />
            <div className="results-section">
                {searchQuery.trim() ? (
                    <>
                        <h2>Search Results</h2>
                        <div className="search-results-line"></div>
                        <div className="search-book-header"><p><FaBook /></p><h3>Books</h3></div>
                        <BookGrid books={filteredBooks} />
                        <div className="search-author-header"><p><FaPenAlt /></p> <h3>Authors</h3></div>
                        <div className="search-author-results">
                            {filteredAuthors.length > 0 ? (
                                filteredAuthors.map((author) => (
                                    <Link to={`/author/${author.id}`}> <div key={author.id} className="search-author">{author.name}</div> </Link>
                                ))
                            ) : (
                                <p className="no-found">No authors found!</p>
                            )}
                        </div>
                        <div className="search-publisher-header"><p><IoPrintSharp /></p> <h3>Publishers</h3></div>
                        <div className="search-publisher-results">
                            {filteredPublishers.length > 0 ? (
                                filteredPublishers.map((publisher) => (
                                    <Link to={`/publisher/${publisher.id}`}> <div key={publisher.id} className="search-publisher">{publisher.name}</div> </Link>
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