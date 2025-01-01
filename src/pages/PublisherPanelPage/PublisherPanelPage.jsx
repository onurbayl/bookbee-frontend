import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookGrid from "../components/BookGrid/BookGrid";
import { FaBook, FaDollarSign, FaHashtag, FaPlus } from "react-icons/fa6";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import "./PublisherPanelPage.css";
import { getFirebaseToken } from "../components/firebase/getFirebaseToken";
import axios from 'axios';


const PublisherPanel = () => {
    const [ ordersByTime, setOrdersByTime ] = useState([]);
    const [ publishedBooks, setPublishedBooks ] = useState([]);
    const [ removedBooks, setRemovedBooks ] = useState([]);

    const fetchRemovedBooks = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/book/get-deleted-publisher-books`, {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const booksData = response.data;

            setRemovedBooks(booksData);
        } catch (error) {
            console.log('Error during fetching published books: ', error);
        }
    };
    
    const fetchPublishedBooks = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/book/get-publisher-books`, {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const booksData = response.data;

            setPublishedBooks(booksData);
        } catch (error) {
            console.log('Error during fetching removed books: ', error);
        }
    };

    
    const fetchOrderDataByTime = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/order-item/get-book-data/15`, {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log(response.data);
            setOrdersByTime(response.data || []);
        } catch (error) {
            console.log('Error during fetching orders by time: ', error);
        }
    };

    

    useEffect(() => {
        fetchRemovedBooks();
        fetchPublishedBooks();
        fetchOrderDataByTime();
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
                    <Bar dataKey="revenue" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="search-filter-page">
            <div className="results-section">
                <div className="search-book-header"><p><FaBook />&nbsp;</p><h2>Published Books</h2></div>
                <div className="search-results-line"></div>
                <Link to={"/upload-book"}><button className="search-btn upload-btn"><span><FaPlus />&nbsp;</span>Add New</button> </Link>
                <BookGrid books={publishedBooks} enableEdit={true} />
            </div>
        </div>

        <div className="search-filter-page">
            <div className="results-section">
                <div className="search-book-header"><p><FaBook />&nbsp;</p><h2>Removed Books</h2></div>
                <div className="search-results-line"></div>
                <BookGrid books={removedBooks} enableEdit={true} />
            </div>
        </div>
        </>
    );
};

export default PublisherPanel;