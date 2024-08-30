import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageModal from "../Modal/MessageModal"; 
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phoneNumber: "",
    village: "",
    password: "",
    confirmPassword: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setModalTitle("Error");
      setModalMessage("Passwords do not match");
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userAuthToken")}`, 
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData).toString(), 
        }
      );
      const data = await response.json();
      if (response.ok) {
        setModalTitle("Success");
        setModalMessage("Registration successful");
        setShowModal(true);
        setTimeout(() => navigate("/home"), 2000); 
      } else {
        setModalTitle("Error");
        setModalMessage(data.message || "Registration failed");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setModalTitle("Error");
      setModalMessage("Failed to register user. Please try again later.");
      setShowModal(true);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (modalTitle === "Success") {
      navigate("/home");
    }
  };

  return (
    <div className="container-reg">
      <div className="title">New Member Registration</div>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="user-details">
            <div className="input-box">
              <span className="details">Full Name</span>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Username</span>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Phone Number</span>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter your number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Village</span>
              <input
                type="text"
                name="village"
                placeholder="Enter your village"
                value={formData.village}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="button">
            <input type="submit" value="Register" />
          </div>
        </form>
      </div>
      <MessageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default Signup;
