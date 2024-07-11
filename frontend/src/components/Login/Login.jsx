import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsUserLoggedIn })=> {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("isUserLoggedIn", "true");
        localStorage.setItem("userAuthToken", data.token);
        setIsUserLoggedIn(true);  // Update the state to re-render the Navbar
        navigate("/home");
        alert("Login Successful");
      } else {
        alert("Invalid Username or Password");
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
                onChange={(e) => setusername(e.target.value)} // Ensure this line is correctly updating the state
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
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>

            <div className="container-login100-form-btn">
              <button className="login100-form-btn" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
