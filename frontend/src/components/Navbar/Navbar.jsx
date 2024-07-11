import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      ref={navbarRef}
    >
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggle}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link className="navbar-brand" to="/">
          Hishab Shohoj
        </Link>
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                onClick={() => setIsOpen(false)}
              >
                হোম
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/dokans"
                onClick={() => setIsOpen(false)}
              >
                দোকান
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/borrow"
                onClick={() => setIsOpen(false)}
              >
                ধার
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/slip"
                onClick={() => setIsOpen(false)}
              >
                স্লিপ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/hishab-table"
                onClick={() => setIsOpen(false)}
              >
                হিসাব খাতা
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/todays-hishab"
                onClick={() => setIsOpen(false)}
              >
                আজকের হিসাব
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/signup"
                onClick={() => setIsOpen(false)}
              >
                Join <FontAwesomeIcon icon={faUserPlus} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
