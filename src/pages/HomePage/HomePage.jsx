import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import BookList from '../components/BookList/BookList';
import './HomePage.css';
import { useEffect } from 'react';
import { useAuth } from '../../AuthContext.js';
import { auth } from '../components/firebase/firebase.js';

const HomePage = () => {

    return (
        <div className="main-container">
            <div> <Sidebar /> </div>
            <div className="booklist"> <BookList /> </div>
        </div>
    );
}

export default HomePage;