import React, { useState, useEffect } from 'react';
import BookCard from '../BookCard/BookCard';
import './BookList.css';
import axios from 'axios';
import { useAuth } from '../../../AuthContext.js';
import { getFirebaseToken } from "../firebase/getFirebaseToken";

const BookList = () => {
  const { user } = useAuth();
  const [allGenres, setAllGenres] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [topRatedGenreBooks, setTopRatedGenreBooks] = useState([]);
  const [mostInterestedBooks, setMostInterestedBooks] = useState([]);
  const [topRatedGenre, setTopRatedGenre] = useState("");
  const [mostInterestedGenre, setMostInterestedGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!user) {
        return;
      }
      try {
        const token = await getFirebaseToken();

        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/bytoken`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [user]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/genre/get-all-genres`);
        const genresData = response.data;
        setAllGenres(genresData.map(genre => genre.name));
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchBooksAndDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/book/get-all-books`);
        const booksData = response.data;

        setTopRatedBooks(booksData.slice(0, 8));

        const selectedGenreForTopRated = allGenres[Math.floor(Math.random() * allGenres.length)];
        setTopRatedGenre(selectedGenreForTopRated);
        const genreBooksTopRated = booksData.filter(book =>
          book.genres.some(genre => genre.name === selectedGenreForTopRated)
        );
        setTopRatedGenreBooks(genreBooksTopRated.slice(0, 8));

        const availableGenres = currentUser?.favoriteGenres?.length > 1
          ? currentUser.favoriteGenres.filter(genre => genre.name !== selectedGenreForTopRated).map(genre => genre.name)
          : allGenres.filter(genre => genre !== selectedGenreForTopRated);
        const selectedGenreForMostInterested = availableGenres.length > 0
          ? availableGenres[Math.floor(Math.random() * availableGenres.length)]
          : selectedGenreForTopRated;
        setMostInterestedGenre(selectedGenreForMostInterested);

        const genreBooksMostInterested = booksData.filter(book =>
          book.genres.some(genre => genre.name === selectedGenreForMostInterested)
        );
        setMostInterestedBooks(genreBooksMostInterested.slice(0, 8));

      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndDetails();
  }, [currentUser, allGenres]);

  return (
    <div className="book-list">
      {loading ? <p>Loading...</p> : (
        <>
          <h2>Top Rated {topRatedGenre} Books</h2>
          <div className="books-container">
            {topRatedGenreBooks.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
          <h2>Most Wished For {mostInterestedGenre} Books</h2>
          <div className="books-container">
            {mostInterestedBooks.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
          <h2>Top Rated Books</h2>
          <div className="books-container">
            {topRatedBooks.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BookList;