// Farmer.js
import React, { useEffect, useState } from "react";
import "./Farmer.css";
import FarmerList from "./FarmerList";
import MessageModal from "../Modal/MessageModal"; // Import the MessageModal component
import Loader from "../Loader/Loader"; // Import the Loader component

const Farmer = () => {
  const [users, setUsers] = useState([]);
  const [newUserInfo, setNewUserInfo] = useState({
    name: "",
    phoneNumber: "",
    village: "",
    fathersName: "",
  });
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-farmers`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchUsers();

    return () => {
      // Optional clean-up logic here
    };
  }, []);

  const handleUserInputChange = (event) => {
    const { name, value } = event.target;
    setNewUserInfo({ ...newUserInfo, [name]: value });
  };

  const handleAddUser = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/create-farmer`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserInfo),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || "Network response was not ok");
      }

      // Set success message and redirect URL
      setModalTitle("Success");
      setModalMessage("নতুন কৃষক সংযুক্ত হয়েছে!");
      setRedirectTo("/farmers"); // Set the desired redirect page
      setModalShow(true);
    } catch (error) {
      // Set error message
      setModalTitle("Error");
      setModalMessage(error.message);
      setModalShow(true);
    }
  };

  const handleModalConfirm = () => {
    setModalShow(false);
    if (redirectTo) {
      window.location.href = redirectTo; // Redirect to the specified page
    }
  };

  return (
    <div className="container mt-4">
      {loading ? (
        <Loader /> // Show loader while fetching data
      ) : (
        <div className="row">
          <div className="card col-md-6">
            <div className="add-user-form">
              <h2 className="card-title mb-4">নতুন কৃষকের তথ্য দিন</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="name">কৃষকের নাম</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={newUserInfo.name}
                    onChange={handleUserInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">নাম্বার</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={newUserInfo.phoneNumber}
                    onChange={handleUserInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="village">গ্রাম</label>
                  <input
                    type="text"
                    className="form-control"
                    id="village"
                    name="village"
                    value={newUserInfo.village}
                    onChange={handleUserInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fathersName">বাবার নাম</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fathersName"
                    name="fathersName"
                    value={newUserInfo.fathersName}
                    onChange={handleUserInputChange}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddUser}
                >
                  সেভ করুন
                </button>
              </form>
            </div>
          </div>
          <FarmerList farmers={users} />
        </div>
      )}
      <MessageModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default Farmer;
