import React, { useState } from "react";
import ManageUsers from "../ManageUsers/ManageUsers"; // Adjust the path if needed
import PastActivity from "../PastActivity/PastActivity"; // Adjust the path if needed
import "./AdminPanel.css";

const AdminPanel = () => {
  const [currentPage, setCurrentPage] = useState("adminPanel");

  const renderPage = () => {
    switch (currentPage) {
      case "manageUsers":
        return <ManageUsers />;
      case "pastActivity":
        return <PastActivity />;
      default:
        return (
          <div className="admin-panel">
            <h1>Admin Panel</h1>
            <div className="admin-buttons">
              <button
                onClick={() => setCurrentPage("manageUsers")}
                className="admin-button"
              >
                Manage Users
              </button>
              <button
                onClick={() => setCurrentPage("pastActivity")}
                className="admin-button"
              >
                Past Activity
              </button>
            </div>
          </div>
        );
    }
  };

  return <div className="admin-panel-container">{renderPage()}</div>;
};

export default AdminPanel;
