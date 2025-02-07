import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageModal from "../Modal/MessageModal"; // Adjust the import path as needed
import "./Login.css";

const Login = ({ setIsUserLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Track login status
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if either field is empty
    if (!username || !password) {
      setModalTitle("Error");
      setModalMessage("Username and Password cannot be empty.");
      setShowModal(true);
      return; // Stop the submission if fields are empty
    }

    setIsLoggingIn(true); // Disable inputs and change button text
console.log(process.env.REACT_APP_BACKEND_URL)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isUserLoggedIn", "true");
        localStorage.setItem("userAuthToken", data.token);
        setIsUserLoggedIn(true);
        setModalTitle("Success");
        setModalMessage("Login Successful");
        setShowModal(true);
      } else {
        setModalTitle("Error");
        setModalMessage(data.message || "Invalid Username or Password");
        setShowModal(true);
        setIsLoggingIn(false); // Enable inputs if login fails
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setModalTitle("Error");
      setModalMessage("Failed to login. Please try again later.");
      setShowModal(true);
      setIsLoggingIn(false); // Enable inputs if there's an error
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (modalTitle === "Success") {
      navigate("/"); // Redirect to homepage on success
    }
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <div className="login100-pic js-tilt" data-tilt>
            <img src="https://i.ibb.co/Jt07D3f/IMG.png" alt="IMG" />
          </div>
          <form
            className="login100-form validate-form"
            onSubmit={handleSubmit}
            method="POST"
          >
            <span className="login100-form-title">Member Login</span>

            <div
              className="wrap-input100 validate-input"
              data-validate="Valid username is required: ex@abc.xyz"
            >
              <input
                className="input100"
                type="text"
                name="username"
                value={username}
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoggingIn} // Disable input when logging in
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>
            <div
              className="wrap-input100 validate-input"
              data-validate="Password is required"
            >
              <input
                className="input100"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn} // Disable input when logging in
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>

            <div className="container-login100-form-btn">
              <button
                className="login100-form-btn"
                type="submit"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Login"}{" "}
                {/* Change button text */}
              </button>
            </div>
          </form>
        </div>
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

export default Login;
