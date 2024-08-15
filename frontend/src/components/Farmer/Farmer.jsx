// Farmer.js
import React, { useEffect, useState } from "react";
import "./Farmer.css";
import FarmerList from "./FarmerList";
import MessageModal from "../Modal/MessageModal";

const Farmer = () => {
  const [users, setUsers] = useState([]);
  const [newUserInfo, setNewUserInfo] = useState({
    name: "",
    phoneNumber: "",
    village: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
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
      }
    };

    fetchUsers();
  }, []);

  const handleUserInputChange = (event) => {
    const { name, value } = event.target;
    setNewUserInfo({ ...newUserInfo, [name]: value });
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/create-farmer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUserInfo),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || "Network response was not ok");
      }

      setModalTitle("Success");
      setModalMessage("নতুন কৃষক সংযুক্ত হয়েছে!");
      setRedirectTo("/farmers");
      setModalShow(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage(error.message);
      setModalShow(true);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=c9af6d674adfdc89791fbbddc0ca6ff6",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        setNewUserInfo({
          ...newUserInfo,
          imageUrl: data.data.url,
        });

        setImagePreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleModalConfirm = () => {
    setModalShow(false);
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center mb-4">
        <div className="card2">
          <div className="card-body2">
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
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  দোকানের ছবি সংযুক্ত করুন
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>
              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Uploaded"
                    className="img-thumbnail"
                    style={{ maxHeight: "200px", maxWidth: "200px" }}
                  />
                </div>
              )}

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
      </div>

      <div className="farmer-list-container">
        <FarmerList farmers={users} />
      </div>

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
