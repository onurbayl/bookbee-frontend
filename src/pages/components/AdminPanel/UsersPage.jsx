import React, { useState, useEffect } from 'react';
import { FaBan, FaUserCheck } from 'react-icons/fa';
import './UsersPage.css';
import { auth } from '../firebase/firebase';
import axiost from "../../../axiosConfig.js";
import { ClipLoader } from 'react-spinners';
import { MdFirstPage, MdNavigateBefore, MdNavigateNext, MdLastPage } from "react-icons/md";
import { Button } from 'antd';
import CouponModal from './CouponModal.jsx';
import { PlusCircleOutlined } from '@ant-design/icons';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const usersPerPage = 5;

  useEffect(() => {
    // Fetch users from backend API
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const crntUser = auth.currentUser;
        const token = await crntUser.getIdToken();
        const response = await axiost.get(`${process.env.REACT_APP_API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedData = response.data.sort((a, b) => a.id - b.id);
        setUsers(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchTermLower) ||
        user.uid.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower)
      );
    })
    .sort((a, b) => a.id - b.id);


  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleRoleChange = async (uId, newRole) => {
    setUsers((prevUsers) => {

      const updatedUsers = prevUsers.map((user) =>
        user.uid === uId ? { ...user, role: newRole } : user
      );


      return updatedUsers.sort((a, b) => a.id - b.id); // Sorting by id
    });


    try {
      const crntUser = auth.currentUser;
      const token = await crntUser.getIdToken();
      const response = await axiost.post(`${process.env.REACT_APP_API_BASE_URL}/user/set-role`,
        { uid: uId, role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      console.log("Role updated for ", response, uId, newRole)

      //update user role in db in set-role endpoint
    } catch (error) {
      console.log("Role set: ", error)
    }
  };

  const handleBanToggle = async (userId) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === userId ? { ...user, isDeleted: !user.isDeleted } : user
      )

      return updatedUsers.sort((a, b) => a.id - b.id);
    });

    try {
      const user = users.find((user) => user.id === userId);

      if (!user) {
        throw new Error("User not found");
      }

      const crntUser = auth.currentUser;
      const token = await crntUser.getIdToken();

      const requestUrl = user.isDeleted
        ? `${process.env.REACT_APP_API_BASE_URL}/user/unban/${user.id}`
        : `${process.env.REACT_APP_API_BASE_URL}/user/ban/${user.id}`;

      const response = await axiost.post(
        requestUrl, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error("Error toggling ban status:", error);

      // Revert the UI change in case of an error
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isDeleted: !user.isDeleted } : user
        )
      );
    }
  };


  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
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
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="users-page">
      <input
        type="text"
        className="users-search-bar"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div style={{padding: '10px', marginBottom: '20px'}}>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />} style={{backgroundColor: 'orange', borderColor: 'orange', fontSize: '18px'}}>
        Create Coupon for User
      </Button>

      <CouponModal
        visible={isModalVisible}
        onCancel={handleCancel}
        users={users}
      />
    </div>
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
              <td>
                <img
                  src={user.imagePath}
                  alt="Profile"
                  className="users-profile-photo"
                />
              </td>
              <td>{user.id}</td>
              <td>{user.uid}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="publisher">Publisher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleBanToggle(user.id)}
                  className={`ban-button ${user.isDeleted ? 'unban' : 'ban'}`}
                >
                  {user.isDeleted ? (
                    <FaUserCheck size={35} />
                  ) : (
                    <FaBan size={35} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bookgrid-pagination">
        <button
          className="bookgrid-pagination-button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          style={{ fontSize: "18px" }}
        >
          <MdFirstPage />
        </button>
        <button
          className="bookgrid-pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ fontSize: "18px" }}
        >
          <MdNavigateBefore />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const startPage = Math.max(
            Math.min(currentPage - 2, totalPages - 4),
            1
          );
          const page = startPage + i;
          return (
            <button
              key={page}
              className={`bookgrid-pagination-button ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          className="bookgrid-pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ fontSize: "18px" }}
        >
          <MdNavigateNext />
        </button>
        <button
          className="bookgrid-pagination-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{ fontSize: "18px" }}
        >
          <MdLastPage />
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
