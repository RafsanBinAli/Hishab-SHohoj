// NewDokan2.js
import React, { useState, useEffect } from "react";
import ShopList from "./ShopList";
import MessageModal from "../Modal/MessageModal"; // Import the MessageModal component
import "./NewDokan2.css";

const NewDokan2 = () => {
  const [shops, setShops] = useState([]);
  const [formData, setFormData] = useState({
    shopName: "",
    address: "",
    phoneNumber: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageData = new FormData();
      imageData.append("image", file);

      try {
        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=c9af6d674adfdc89791fbbddc0ca6ff6",
          {
            method: "POST",
            body: imageData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        setFormData({
          ...formData,
          imageUrl: data.data.url,
        });

        setImagePreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/create-shop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register shop");
      }

      const newShop = await response.json();

      // Set success message and redirect URL
      setModalTitle("Success");
      setModalMessage("নতুন দোকান রেজিট্রেশন সম্পূর্ন হয়েছে !");
      setRedirectTo("/dokans"); // Set the desired redirect page, if any
      setModalShow(true);

      setFormData({
        shopName: "",
        address: "",
        phoneNumber: "",
        imageUrl: "",
      });

      setImagePreview(null);
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

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-shops`
        );
        const data = await response.json();
        setShops(data);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="container mt-4 p-2">
      <div className="d-flex justify-content-center mb-4">
        <div className="card2">
          <div className="card-body2">
            <h2 className="card-title mb-4">নতুন দোকান রেজিট্রেশন</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="shopName" className="form-label">
                  দোকানের নাম
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                  মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
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
              <button type="submit" className="btn btn-primary">
                রেজিস্টার
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="shop-list-container">
        <ShopList shops={shops} /> {/* Removed loading state */}
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

export default NewDokan2;
