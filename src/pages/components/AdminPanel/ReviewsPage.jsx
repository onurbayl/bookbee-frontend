import React, { useState, useEffect } from 'react';
import './ReviewsPage.css';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { auth } from '../firebase/firebase';



const ReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviewsPerPage = 7;
  

  useEffect(() => {
    // Fetch reviews from backend API
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const crntUser = auth.currentUser;
        const token = await crntUser.getIdToken();
        
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/review`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response)

        const sortedData = response.data.sort((a, b) => a.id - b.id);
        setReviews(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);


  const filteredReviews = reviews
  .filter((review) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      review.user.name.toLowerCase().includes(searchTermLower) ||
      review.user.email.toLowerCase().includes(searchTermLower) ||
      review.content.toLowerCase().includes(searchTermLower) ||
      review.book.name.toLowerCase().includes(searchTermLower) 
    );
  })
  .sort((a, b) => a.id - b.id);

  
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const handleDeleteReview = async (reviewId, bookId, userId) => {
    setReviews((prevReviews) => {
        const updatedReviews = prevReviews.filter((review) => review.id !== reviewId)
        return updatedReviews.sort((a, b) => a.id - b.id)
    });

    try {
        const crntUser = auth.currentUser;
        const token = await crntUser.getIdToken();

        const requestUrl = `${process.env.REACT_APP_API_BASE_URL}/review/delete-review/${bookId}/${userId}`;

        const response = await axios.delete(requestUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(response)
    } catch (error) {
        console.error("Error deleting review:", error);
    }
  };


  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <ClipLoader color="#36d7b7" loading={loading} size={50} />
    </div>;
  }

  if (error) {
    return <div style={{color: 'red'}}>Error: {error}</div>;
  }

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
            <th>User UID</th>
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
              <td>{review.user.uid}</td>
              <td>{review.book.id}</td>
              <td>{review.score}</td>
              <td>{review.content}</td>
              <td>{review.dateCreated}</td>
              <td>
              <button className="delete-btn" onClick={() => handleDeleteReview(review.id, review.book.id, review.user.id)}>
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
