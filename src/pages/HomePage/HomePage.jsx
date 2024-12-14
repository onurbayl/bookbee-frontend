import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import BookList from '../components/BookList/BookList';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="main-container">
            <div> <Sidebar /> </div>
            <div className="booklist"> <BookList /> </div>
        </div>
    );
}

export default HomePage;