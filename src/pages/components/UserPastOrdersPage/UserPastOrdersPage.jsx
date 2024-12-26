import React from 'react';
import BookGrid from '../BookGrid/BookGrid'; // Import the BookGrid component
import './UserPastOrdersPage.css';

const UserPastOrdersPage = () => {
  const pastOrders = [
    {
      id: 1,
      orderDate: '2023-12-10',
      books: [
        {
          id: 1,
          name: 'Animal Farm',
          writer: 'George Orwell',
          publisher: 'Secker & Warburg',
          rating: 4.5,
          genre: 'Dystopian',
          pageNumber: 112,
          language: 'English',
          datePublished: '1945-08-17',
          bookDimension: '7.5 x 5.2 x 0.5 inches',
          isbn: '978-0451526342',
          editionNumber: 1,
          discountPercentage: 10,
          normalPrice: 19.80,
          finalPrice: 17.82,
        },
        {
          id: 2,
          name: '1984',
          writer: 'George Orwell',
          publisher: 'Secker & Warburg',
          rating: 4.8,
          genre: 'Dystopian',
          pageNumber: 328,
          language: 'English',
          datePublished: '1949-06-08',
          bookDimension: '7.5 x 5.2 x 0.8 inches',
          isbn: '978-0451524935',
          editionNumber: 2,
          discountPercentage: 5,
          normalPrice: 21.50,
          finalPrice: 20.43,
        },
      ],
    },
    {
      id: 2,
      orderDate: '2023-11-15',
      books: [
        {
          id: 3,
          name: 'Brave New World',
          writer: 'Aldous Huxley',
          publisher: 'Chatto & Windus',
          rating: 4.3,
          genre: 'Science Fiction',
          pageNumber: 288,
          language: 'English',
          datePublished: '1932-09-01',
          bookDimension: '8 x 5.5 x 1 inches',
          isbn: '978-0060850524',
          editionNumber: 1,
          discountPercentage: 0,
          normalPrice: 18.00,
          finalPrice: 18.00,
        },
      ],
    },
  ]; // Replace with actual API data

  return (
    <div className="past-orders-page">
      <h1>Your Past Orders</h1>
      {pastOrders.map((order) => (
        <div key={order.id} className="order-container">
          <h2>Order placed on {order.orderDate}</h2>
          <BookGrid books={order.books} />
        </div>
      ))}
    </div>
  );
};

export default UserPastOrdersPage;
