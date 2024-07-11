import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phoneNumber: "",
    village: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Send form data to backend for registration
    try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("userAuthToken")}`, // Adding the userAuthToken to headers
            },
            body: new URLSearchParams(formData), // Using URLSearchParams to handle FormData
          }
        );
      const data = await response.json();
      if (response.ok) {
        // Registration successful
        alert("Registration successful");
        // Redirect user to login page or any other page as needed
        navigate("/home");
      } else {
        console.log(data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register user. Please try again later.");
    }
  };

  // Function to handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    </div>
  );
};

export default Signup;
