import React, { useState } from 'react';
import './CommentsPage.css';
import { FaTrashAlt } from 'react-icons/fa';

const mockReviews = [
  { id: 1, userId: 101, reviewId: 201, content: "content", dateCreated: '2024-12-01' },
  { id: 2, userId: 102, reviewId: 202, content: "content", dateCreated: '2024-12-02' },
  { id: 3, userId: 103, reviewId: 203, content: "content", dateCreated: '2024-12-03' },
  { id: 4, userId: 104, reviewId: 204, content: "content", dateCreated: '2024-12-04' },
  { id: 5, userId: 105, reviewId: 205, content: "content", dateCreated: '2024-12-05' },
  { id: 6, userId: 106, reviewId: 206, content: "content", dateCreated: '2024-12-06' },
  { id: 7, userId: 107, reviewId: 207, content: "content", dateCreated: '2024-12-07' },
  { id: 8, userId: 108, reviewId: 208, content: "content", dateCreated: '2024-12-08' },
  { id: 9, userId: 109, reviewId: 209, content: "content", dateCreated: '2024-12-09' },
  { id: 10, userId: 110, reviewId: 210, content: "content", dateCreated: '2024-12-10' },
];

const CommentsPage = () => {
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
        placeholder="Search comments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="reviews-table">
        <thead>
          <tr>
            <th>Comment ID</th>
            <th>User ID</th>
            <th>Review ID</th>
            <th>Content</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReviews.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.userId}</td>
              <td>{comment.reviewId}</td>
              <td>{comment.content}</td>
              <td>{comment.dateCreated}</td>
              <td>
              <button className="delete-btn" onClick={() => handleDeleteReview(comment.id)}>
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

export default CommentsPage;
