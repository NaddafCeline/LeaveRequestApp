import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const UserForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all required fields are filled
    if (
      !firstName ||
      !lastName ||
      !reason ||
      (reason === "other" && !otherReason)
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const selectedReason = reason === "other" ? otherReason : reason;
      const response = await axios.post("http://localhost:5000/submit-leave", {
        firstName,
        lastName,
        reason: selectedReason,
      });
      setRequestId(response.data.requestId);
      setResponse("Pending");
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting leave request:", error);
      setResponse("Error");
    }
    setLoading(false);
  };

  useEffect(() => {
    let interval;
    if (requestId) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/request-status/${requestId}`
          );
          setResponse(response.data.status);
          if (response.data.status !== "Pending") {
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error fetching request status:", error);
          clearInterval(interval);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [requestId]);

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    if (e.target.value !== "other") {
      setOtherReason("");
    }
  };

  return (
    <div>
      <h1>Submit a Leave Request</h1>
      {formSubmitted && (
        <Alert
          variant="success"
          onClose={() => setFormSubmitted(false)}
          dismissible
        >
          Form submitted successfully!
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName">
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </Form.Group>
        <Form.Group controlId="reason">
          <Form.Control
            as="select"
            value={reason}
            onChange={handleReasonChange}
          >
            <option value="">Select a Reason</option>
            <option value="sick">Sick Leave</option>
            <option value="vacation">Vacation</option>
            <option value="other">Other</option>
          </Form.Control>
        </Form.Group>
        {reason === "other" && (
          <Form.Group controlId="otherReason">
            <Form.Control
              type="text"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Enter Other Reason"
            />
          </Form.Group>
        )}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {loading && <Spinner animation="border" variant="primary" />}
      {response === "Approved" && (
        <p style={{ color: "green" }}>Leave Request Status: {response}</p>
      )}
    </div>
  );
};

export default UserForm;
