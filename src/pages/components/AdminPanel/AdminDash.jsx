import React, { useState } from 'react';
import { FaUsers, FaRegStar, FaComment, FaCommentAlt } from 'react-icons/fa'; // Import icons from React Icons
import UsersPage from './UsersPage';
import ReviewsPage from './ReviewsPage';
import './AdminDash.css';
import CommentsPage from './CommentsPage';

const AdminDash = () => {
  const [activePage, setActivePage] = useState('Users');

  return (
    <div className="admin-dash">
      <nav className="admin-menu">
        <div
          className={`admin-menu-item ${activePage === 'Users' ? 'active' : ''}`}
          onClick={() => setActivePage('Users')}
        >
          <FaUsers size={36} color={activePage === 'Users' ? 'orange' : 'gray'} /> {/* Increased size */}
        </div>
        <div
          className={`admin-menu-item ${activePage === 'Reviews' ? 'active' : ''}`}
          onClick={() => setActivePage('Reviews')}
        >
          <FaRegStar size={36} color={activePage === 'Reviews' ? 'orange' : 'gray'} /> {/* Increased size */}
        </div>
        <div
          className={`admin-menu-item ${activePage === 'Comments' ? 'active' : ''}`}
          onClick={() => setActivePage('Comments')}
        >
          <FaCommentAlt size={36} color={activePage === 'Comments' ? 'orange' : 'gray'} /> {/* Increased size */}
        </div>
      </nav>
      <div className="admin-content">
        {activePage === 'Users' && <UsersPage />}
        {activePage === 'Reviews' && <ReviewsPage />}
        {activePage === 'Comments' && <CommentsPage />}
      </div>
    </div>
  );
};

export default AdminDash;
