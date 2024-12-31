import React, { useState } from 'react';
import './UsersPage.css';
import { FaBan, FaUndo, FaUserCheck } from 'react-icons/fa';

const mockUsers = [
  {
    id: 1,
    uid: 'UID123',
    name: 'Ali Veli',
    email: 'ali.veli@example.com',
    role: 'user',
    isBanned: false,
    profilePhoto: 'https://via.placeholder.com/40',
  },
  {
    id: 2,
    uid: 'UID456',
    name: 'Ayse Fatma',
    email: 'ayse.fatma@example.com',
    role: 'admin',
    isBanned: true,
    profilePhoto: 'https://via.placeholder.com/40',
  },
  {
    id: 3,
    uid: 'UID789',
    name: 'Mehmet Can',
    email: 'mehmet.can@example.com',
    role: 'publisher',
    isBanned: false,
    profilePhoto: 'https://via.placeholder.com/40',
  },
  // Additional mock users for testing pagination
  { id: 4, uid: 'UID101', name: 'Zeynep Gunes', email: 'zeynep.g@example.com', role: 'user', isBanned: false, profilePhoto: 'https://via.placeholder.com/40' },
  { id: 5, uid: 'UID102', name: 'Hakan Yildiz', email: 'hakan.y@example.com', role: 'publisher', isBanned: true, profilePhoto: 'https://via.placeholder.com/40' },
  { id: 6, uid: 'UID103', name: 'Elif Kaya', email: 'elif.k@example.com', role: 'admin', isBanned: false, profilePhoto: 'https://via.placeholder.com/40' },
  { id: 7, uid: 'UID104', name: 'Burak Demir', email: 'burak.d@example.com', role: 'user', isBanned: false, profilePhoto: 'https://via.placeholder.com/40' },
  { id: 8, uid: 'UID105', name: 'Melis Aslan', email: 'melis.a@example.com', role: 'user', isBanned: true, profilePhoto: 'https://via.placeholder.com/40' },
  { id: 9, uid: 'UID106', name: 'Eren Aksoy', email: 'eren.a@example.com', role: 'publisher', isBanned: false, profilePhoto: 'https://via.placeholder.com/40' },
  { id: 10, uid: 'UID107', name: 'Duygu Tekin', email: 'duygu.t@example.com', role: 'admin', isBanned: false, profilePhoto: 'https://via.placeholder.com/40' },
];

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usersPerPage = 6;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleRoleChange = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleBanToggle = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isBanned: !user.isBanned } : user
      )
    );
  };

  

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="users-page">
      <input
        type="text"
        className="users-search-bar"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="users-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>ID</th>
            <th>UID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td><img src={user.profilePhoto} alt="Profile" className="users-profile-photo" /></td>
              <td>{user.id}</td>
              <td>{user.uid}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="publisher">Publisher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                    onClick={() => handleBanToggle(user.id)}
                    className={`ban-button ${user.isBanned ? 'unban' : 'ban'}`} // Conditional class based on ban status
                    >
                    {user.isBanned ? <FaUserCheck size={35} /> : <FaBan size={35} />}
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

export default UsersPage;