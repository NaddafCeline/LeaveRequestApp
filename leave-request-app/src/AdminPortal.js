import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Import custom CSS

const AdminPortal = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/view-requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const authenticateAdmin = () => {
    // You can replace this with a more secure authentication mechanism
    if (password === "adminpassword") {
      setAuthenticated(true);
      fetchRequests();
    } else {
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchRequests();
    }
  }, [authenticated]);

  // Function to update request status
  const updateRequestStatus = async (requestId, status) => {
    try {
      await axios.post("http://localhost:5000/update-request", {
        requestId,
        status,
      });
      fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Portal</h2>
      {!authenticated ? (
        <div>
          <p>Please enter the admin password to view requests:</p>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={authenticateAdmin}>
            Authenticate
          </button>
        </div>
      ) : (
        <div>
          {requests.length === 0 ? (
            <p>No requests available.</p>
          ) : (
            <ul className="list-group">
              {requests.map((request) => (
                <li key={request.id} className="list-group-item">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        {request.firstName} {request.lastName}
                      </h5>
                      <p className="card-text">
                        Reason: {request.reason} <br />
                        Status: {request.status}
                      </p>
                      <button
                        className="btn btn-approve mr-2"
                        onClick={() =>
                          updateRequestStatus(request.id, "Approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() =>
                          updateRequestStatus(request.id, "Rejected")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
