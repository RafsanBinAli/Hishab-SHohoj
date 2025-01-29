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

  // State for overlay
  const [showOverlay, setShowOverlay] = useState(false);

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

  const validateInputs = () => {
    if (!newUserInfo.name) {
      setModalTitle("Validation Error");
      setModalMessage("Please enter the farmer's name.");
      setModalShow(true);
      return false;
    }
    if (!newUserInfo.phoneNumber) {
      setModalTitle("Validation Error");
      setModalMessage("Please enter the farmer's phone number.");
      setModalShow(true);
      return false;
    }
    if (!newUserInfo.village) {
      setModalTitle("Validation Error");
      setModalMessage("Please enter the farmer's village.");
      setModalShow(true);
      return false;
    }
    if (!newUserInfo.imageUrl) {
      setModalTitle("Validation Error");
      setModalMessage("Please upload an image.");
      setModalShow(true);
      return false;
    }
    return true;
  };

  const handleAddUser = async () => {
    if (!validateInputs()) return;

    setShowOverlay(true); // Show overlay during registration

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
    } finally {
      setShowOverlay(false); // Hide overlay when registration completes
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (!file.type.startsWith("image/")) {
        setModalTitle("Invalid File");
        setModalMessage("Please upload a valid image file.");
        setModalShow(true);
        return;
      }
      if (file.size > maxSize) {
        setModalTitle("File Too Large");
        setModalMessage(
          "The file size exceeds the 5MB limit. Please upload a smaller file."
        );
        setModalShow(true);
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_KEY}`,
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
        setModalTitle("Error");
        setModalMessage("Image upload failed. Please try again.");
        setModalShow(true);
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
      {showOverlay && <div className="overlay"></div>}
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
                <label htmlFor="village">ঠিকানা</label>
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
