import React, { useEffect, useState } from 'react';
import BookGrid from "../components/BookGrid/BookGrid";
import axios from 'axios';
import { FaBook, FaDollarSign, FaHashtag } from "react-icons/fa6";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data
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

const orderData = [
    {
        date: "01-01-2025",
        quantity: 10,
        revenue: 100
    },
    {
        date: "02-01-2025",
        quantity: 11,
        revenue: 110
    },
    {
        date: "03-01-2025",
        quantity: 12,
        revenue: 120
    },
    {
        date: "04-01-2025",
        quantity: 14,
        revenue: 140
    },
    {
        date: "05-01-2025",
        quantity: 15,
        revenue: 150
    },
    {
        date: "06-01-2025",
        quantity: 16,
        revenue: 160
    },
    {
        date: "07-01-2025",
        quantity: 17,
        revenue: 170
    },
    {
        date: "08-01-2025",
        quantity: 18,
        revenue: 180
    },
    {
        date: "09-01-2025",
        quantity: 19,
        revenue: 190
    },
    {
        date: "10-01-2025",
        quantity: 20,
        revenue: 200
    },
    {
        date: "11-01-2025",
        quantity: 21,
        revenue: 210
    },
    {
        date: "12-01-2025",
        quantity: 22,
        revenue: 220
    },
    {
        date: "13-01-2025",
        quantity: 23,
        revenue: 230
    },
    {
        date: "14-01-2025",
        quantity: 24,
        revenue: 240
    },
    {
        date: "15-01-2025",
        quantity: 25,
        revenue: 250
    },
    {
        date: "16-01-2025",
        quantity: 26,
        revenue: 260
    },
];

const PublisherPanel = () => {
    const [ ordersByTime, setOrdersByTime ] = useState([]);
    const [ publishedBooks, setPublishedBooks ] = useState([]);

    useEffect(() => {
        const fetchPublishedBooks = async () => {
            try {
                // Fetch published books
                const booksPublished = await axios.get(
                    `http://localhost:3000/api/v1/book/get-published-books`
                ).data || [];

                setPublishedBooks(booksPublished);
            } catch (error) {
                console.log('Error during fetching published books: ', error);
            }
        };

        
        const fetchOrdersDataByTime = async () => {
            try {
                const orderData = await axios.get(
                    `http://localhost:3000/api/v1/order-item/get-book-data/${book.id}?span="days"&N=15`
                ).data || [];

                setOrdersByTime(orderData);
            } catch (error) {
                console.log('Error during fetching orders by time: ', error);
            }
        };

        //fetchPublishedBooks();
        setPublishedBooks(books);

        //fetchOrderDataByTime();
        setOrdersByTime(orderData);
    }, []);

    return (       
        <> 
        <div className="search-filter-page">
            <div className="results-section">
                <div className="search-book-header"><p><FaHashtag />&nbsp;</p><h2>Number of Orders by Days</h2></div>
                <div className="search-results-line"></div>
                <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    width={500}
                    height={300}
                    data={ordersByTime}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        
        <div className="search-filter-page">
            <div className="results-section">
                <div className="search-book-header"><p><FaDollarSign />&nbsp;</p><h2>Revenue by Days</h2></div>
                <div className="search-results-line"></div>
                <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    width={500}
                    height={300}
                    data={orderData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        <div className="search-filter-page">
            <div className="results-section">
                <div className="search-book-header"><p><FaBook />&nbsp;</p><h2>Published Books</h2></div>
                <div className="search-results-line"></div>
                <BookGrid books={publishedBooks} />
            </div>
        </div>
        </>
    );
};

export default PublisherPanel;