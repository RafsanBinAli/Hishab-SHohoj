import React, { useState, useEffect } from "react";
import ShopList from "./ShopList";
import MessageModal from "../Modal/MessageModal";
import "./NewDokan.css";
import { fetchShops } from "../../utils/dataService";

const NewDokan = () => {
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
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.shopName.trim()) {
      errors.shopName = "Shop name is required.";
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required.";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{11}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits.";
    }
    if (!formData.imageUrl) {
      errors.imageUrl = "Image is required.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageData = new FormData();
      imageData.append("image", file);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_KEY}`,
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
  useEffect(() => {
    const loadShops = async () => {
      const data = await fetchShops();
      setShops(data);
    };

    loadShops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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

      setModalTitle("Success");
      setModalMessage("নতুন দোকান রেজিট্রেশন সম্পূর্ন হয়েছে !");
      setRedirectTo("/dokans");
      setModalShow(true);

      setFormData({
        shopName: "",
        address: "",
        phoneNumber: "",
        imageUrl: "",
      });

      setImagePreview(null);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage(error.message);
      setModalShow(true);
    }
  };

  const handleModalConfirm = () => {
    setModalShow(false);
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  };


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
                  className={`form-control ${
                    errors.shopName ? "is-invalid" : ""
                  }`}
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  required
                />
                {errors.shopName && (
                  <div className="invalid-feedback">{errors.shopName}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.address ? "is-invalid" : ""
                  }`}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                {errors.address && (
                  <div className="invalid-feedback">{errors.address}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                  মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.phoneNumber ? "is-invalid" : ""
                  }`}
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
                {errors.phoneNumber && (
                  <div className="invalid-feedback">{errors.phoneNumber}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  দোকানের ছবি সংযুক্ত করুন
                </label>
                <input
                  type="file"
                  className={`form-control ${
                    errors.imageUrl ? "is-invalid" : ""
                  }`}
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {errors.imageUrl && (
                  <div className="invalid-feedback">{errors.imageUrl}</div>
                )}
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
        <ShopList shops={shops} />
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

export default NewDokan;
