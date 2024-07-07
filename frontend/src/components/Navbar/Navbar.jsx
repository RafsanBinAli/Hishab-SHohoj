import React from "react";
import { Link } from "react-router-dom";
// import "./Navbar.css"; // Import the CSS file
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Hishab Shohoj
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dokans">
                Dokans
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/borrow">
                Borrow
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link " to="/Slip">
                স্লিপ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link " to="/hishab-table">
              হিসাব খাতা
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
