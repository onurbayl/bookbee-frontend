import React, { useState } from 'react';
import './ReviewsPage.css';
import { FaTrashAlt } from 'react-icons/fa';

const mockReviews = [
  { id: 1, userId: 101, bookId: 201, score: 9, content: 'Great product!', dateCreated: '2024-12-01', comments: ['Awesome!', 'Agreed!'] },
  { id: 2, userId: 102, bookId: 202, score: 6, content: 'Could be better.', dateCreated: '2024-12-02', comments: ['What issues did you face?'] },
  { id: 3, userId: 103, bookId: 203, score: 3, content: 'Not worth it.', dateCreated: '2024-12-03', comments: ['Why not?', 'Disagree.'] },
  { id: 4, userId: 104, bookId: 204, score: 10, content: 'Fantastic experience!', dateCreated: '2024-12-04', comments: ['Loved it!', 'Absolutely amazing!'] },
  { id: 5, userId: 105, bookId: 205, score: 4, content: 'Poor quality.', dateCreated: '2024-12-05', comments: ['Not satisfied.', 'Could improve.'] },
  { id: 6, userId: 106, bookId: 206, score: 9, content: 'Highly recommend!', dateCreated: '2024-12-06', comments: ['Definitely worth it!', 'Perfect.'] },
  { id: 7, userId: 107, bookId: 207, score: 5, content: 'Not as described.', dateCreated: '2024-12-07', comments: ['Disappointed.', 'Expected better.'] },
  { id: 8, userId: 108, bookId: 208, score: 8, content: 'Amazing service!', dateCreated: '2024-12-08', comments: ['Great staff.', 'Quick response.'] },
  { id: 9, userId: 109, bookId: 209, score: 2, content: 'Waste of money.', dateCreated: '2024-12-09', comments: ['Terrible.', 'Regret buying.'] },
  { id: 10, userId: 110, bookId: 210, score: 10, content: 'Five stars!', dateCreated: '2024-12-10', comments: ['Excellent!', 'Would buy again.'] },
];

const ReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState(mockReviews);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReviews = reviews.filter((review) =>
    review.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reviewsPerPage = 7;
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const handleDeleteReview = (reviewId) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
  };

  const handleViewComments = (reviewId) => {
    const review = reviews.find((review) => review.id === reviewId);
    if (review) {
      alert(`Comments: \n${review.comments.join('\n')}`);
    }
  };

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="reviews-page">
      <input
        type="text"
        className="reviews-search-bar"
        placeholder="Search reviews..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="reviews-table">
        <thead>
          <tr>
            <th>Review ID</th>
            <th>User ID</th>
            <th>Book ID</th>
            <th>Score</th>
            <th>Content</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReviews.map((review) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.userId}</td>
              <td>{review.bookId}</td>
              <td>{review.score}</td>
              <td>{review.content}</td>
              <td>{review.dateCreated}</td>
              <td>
              <button className="delete-btn" onClick={() => handleDeleteReview(review.id)}>
                  <FaTrashAlt size={20} /> {/* Use FaTrashAlt from react-icons */}
                </button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
