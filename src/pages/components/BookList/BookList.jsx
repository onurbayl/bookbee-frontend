import React from 'react';
import BookCard from '../BookCard/BookCard';
import './BookList.css';

const topRatedBooks = [
  { title: 'Pride and Prejudice', author: 'Jane Austen', price: 16.2 },
  { title: 'Lord of the Flies', author: 'William Golding', price: 17.5 },
  { title: 'Madame Bovary', author: 'Gustave Flaubert', price: 18.25 },
  { title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', price: 21.5 },
  { title: 'Brave New World', author: 'Aldous Huxley', price: 19.5 },
];

const mostInterestedBooks = [
  { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', price: 27.3 },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', price: 26.5 },
  { title: 'War and Peace', author: 'Leo Tolstoy', price: 24.8 },
  { title: 'Anna Karenina', author: 'Leo Tolstoy', price: 24.6 },
  { title: 'The Grapes of Wrath', author: 'John Steinbeck', price: 22.5 },
];

const BookList = () => {
  return (
    <div className="book-list">
      <h2>Top Rated Books</h2>
      <div className="books-container">
        {topRatedBooks.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>

      <h2>Most Interested World Classics</h2>
      <div className="books-container">
        {mostInterestedBooks.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
}

export default BookList;