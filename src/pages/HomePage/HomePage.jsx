import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import BookList from '../components/BookList/BookList';
import './HomePage.css';
import { useEffect } from 'react';
import { useAuth } from '../../AuthContext.js';
import { auth } from '../components/firebase/firebase.js';

const HomePage = () => {

    const {user} = useAuth()

    // For Test purposes
    useEffect(() => {
        if(user){
            console.log("User in Home Page:", user)
        }
        else {
            console.log("No user in Home")
        }
        console.log(auth.currentUser)
    }, [user]); 

    return (
        <div className="main-container">
            <div> <Sidebar /> </div>
            <div className="booklist"> <BookList /> </div>
        </div>
    );
}

export default HomePage;