import { useState } from "react";
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
  const [isSaving, setIsSaving] = useState(false); // Track saving status
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setModalTitle("Error");
      setModalMessage("Passwords do not match");
      setShowModal(true);
      return;
    }

    setIsSaving(true); // Start saving process

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/signup`,
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
      } else {
        setModalTitle("Error");
        setModalMessage(data.message || "Registration failed");
        setShowModal(true);
        setIsSaving(false); // Re-enable the form in case of failure
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setModalTitle("Error");
      setModalMessage("Failed to register user. Please try again later.");
      setShowModal(true);
      setIsSaving(false); // Re-enable the form in case of error
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
                disabled={isSaving} // Disable input when saving
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
                disabled={isSaving} // Disable input when saving
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
                disabled={isSaving} // Disable input when saving
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
                disabled={isSaving} // Disable input when saving
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
                disabled={isSaving} // Disable input when saving
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
                disabled={isSaving} // Disable input when saving
              />
            </div>
          </div>
          <div className="button">
            <input
              type="submit"
              value={isSaving ? "Saving..." : "Register"} // Change button text
              disabled={isSaving} // Disable button when saving
            />
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
