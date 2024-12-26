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
  const [bestSellerBooks, setBestSellerBooks] = useState([]);
  const [mostInterestedBooks, setMostInterestedBooks] = useState([]);  
  const [mostInterestedGenre, setMostInterestedGenre] = useState("");  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/genre/get-all-genres");
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
        const response = await axios.get("http://localhost:3000/api/v1/book/get-all-books");
        const booksData = response.data;

        const booksWithDetails = await Promise.all(
          booksData.map(async (book) => {
            let discountPercentage = 0;
            let finalPrice = parseFloat(book.price);

            try {
              const discountResponse = await axios.get(
                `http://localhost:3000/api/v1/discount/get-discount/${book.id}`
              );
              if (discountResponse.data) {
                discountPercentage = discountResponse.data.discountPercentage || 0;
                finalPrice =
                  parseFloat(book.price) -
                  parseFloat(book.price) * (discountPercentage / 100);
              }
            } catch (error) {
              console.error(`Error fetching discount for book ID ${book.id}:`, error);
            }

            let rating = 0;
            let reviewCount = 0;

            try {
              const reviewsResponse = await axios.get(
                `http://localhost:3000/api/v1/review/get-reviews-book/${book.id}`
              );
              const reviews = reviewsResponse.data || [];
              reviewCount = reviews.length;

              const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
              rating = reviewCount > 0 ? totalScore / reviewCount / 2 : 0;
            } catch (error) {
              console.error(`Error fetching reviews for book ID ${book.id}:`, error);
            }

            return {
              ...book,
              discountPercentage,
              finalPrice,
              rating: parseFloat(rating),
              reviewCount,
            };
          })
        );

        const sortedBooks = booksWithDetails.sort((a, b) => b.rating - a.rating);
        setTopRatedBooks(sortedBooks.slice(0, 8));

        const randomBestSellerBooks = booksWithDetails.sort(() => 0.5 - Math.random()).slice(0, 8);
        setBestSellerBooks(randomBestSellerBooks);

        if (user) {
          const token = await getFirebaseToken();
          const userResponse = await axios.get(
            `http://localhost:3000/api/v1/user/bytoken`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const favoriteGenres = userResponse.data.favoriteGenres.map(genre => genre.name);
          if (favoriteGenres.length > 0) {
            const randomGenre = favoriteGenres[Math.floor(Math.random() * favoriteGenres.length)];
            setMostInterestedGenre(randomGenre);
            const genreBooks = booksWithDetails.filter(book => book.genres.some(genre => genre.name === randomGenre));
            setMostInterestedBooks(genreBooks.sort(() => 0.5 - Math.random()).slice(0, 8));
          } else {
            const randomGenre = allGenres[Math.floor(Math.random() * allGenres.length)];
            setMostInterestedGenre(randomGenre);
            const genreBooks = booksWithDetails.filter(book => book.genres.some(genre => genre.name === randomGenre));
            setMostInterestedBooks(genreBooks.sort(() => 0.5 - Math.random()).slice(0, 8));
          }
        }
      } catch (error) {
        console.error("Error fetching books, discounts or ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndDetails();
  }, []);

  
  return (
    <div className="book-list">
      {loading ? <p>Loading...</p> : (
        <>
          {user && (
          <><h2>Most Interested {mostInterestedGenre} Books</h2><div className="books-container">
              {mostInterestedBooks.map((book, index) => (
                <BookCard key={index} book={book} />
              ))}
            </div></>)}        
          <h2>Top Rated Books</h2>
          <div className="books-container">
            {topRatedBooks.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
          <h2>Best Seller Books</h2>
          <div className="books-container">
            {bestSellerBooks.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BookList;