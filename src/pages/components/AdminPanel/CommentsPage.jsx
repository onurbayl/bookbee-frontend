import React, { useState, useEffect } from 'react';
import './CommentsPage.css';
import { FaTrashAlt } from 'react-icons/fa';
import { auth } from '../firebase/firebase';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';


const CommentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const commentsPerPage = 7;

  useEffect(() => {
    // Fetch reviews from backend API
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const crntUser = auth.currentUser;
        const token = await crntUser.getIdToken();
        
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/comment`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response)

        const sortedData = response.data.sort((a, b) => a.id - b.id);
        setComments(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);


  const filteredComments = comments
  .filter((comment) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      comment.user.name.toLowerCase().includes(searchTermLower) ||
      comment.user.email.toLowerCase().includes(searchTermLower) ||
      comment.content.toLowerCase().includes(searchTermLower) ||
      comment.review.content.toLowerCase().includes(searchTermLower) 
    );
  })
  .sort((a, b) => a.id - b.id);

  
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  const handleDeleteComment = async (commentId) => {
    setComments((prevComments) => {
        const updatedComments = prevComments.filter((comment) => comment.id !== commentId)
        return updatedComments.sort((a, b) => a.id - b.id)
    });

    try {
        const crntUser = auth.currentUser;
        const token = await crntUser.getIdToken();

        const requestUrl = `${process.env.REACT_APP_API_BASE_URL}/comment/delete-comment/${commentId}`;

        const response = await axios.delete(requestUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(response)
    } catch (error) {
        console.error("Error deleting comment:", error);
    }
  };

  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
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
        placeholder="Search comments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="reviews-table">
        <thead>
          <tr>
            <th>Comment ID</th>
            <th>User UID</th>
            <th>Review ID</th>
            <th>Content</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedComments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.user.uid}</td>
              <td>{comment.review.id}</td>
              <td>{comment.content}</td>
              <td>{comment.dateCreated}</td>
              <td>
              <button className="delete-btn" onClick={() => handleDeleteComment(comment.id)}>
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
