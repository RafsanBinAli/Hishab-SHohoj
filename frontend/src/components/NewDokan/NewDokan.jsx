import { useState, useEffect } from "react";
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

  // State for overlay
  const [showOverlay, setShowOverlay] = useState(false);
  // New state for image upload loading
  const [isImageUploading, setIsImageUploading] = useState(false);

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
      // Set loading state to true when upload starts
      setIsImageUploading(true);
      
      // Fixed bug: Using imageData instead of formData
      const imageData = new FormData();
      imageData.append("image", file);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_APP_IMGBB_KEY}`,
          {
            method: "POST",
            body: imageData, // Fixed: using imageData instead of formData
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
        setModalTitle("Error");
        setModalMessage("Image upload failed. Please try again.");
        setModalShow(true);
      } finally {
        // Set loading state to false when upload completes (success or error)
        setIsImageUploading(false);
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

    setShowOverlay(true); // Show overlay during submission

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/create-shop`,
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

      await response.json();

      setModalTitle("Success");
      setModalMessage("নতুন দোকান রেজিট্রেশন সম্পূর্ন হয়েছে !");
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
    } finally {
      setShowOverlay(false); // Hide overlay when submission completes
    }
  };

  const handleModalConfirm = () => {
    setModalShow(false);
  };

  return (
    <div className="container mt-4 p-2">
      {showOverlay && <div className="overlay"></div>}
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
                  মোবাইল নাম্বার
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
                <div className="position-relative">
                  <input
                    type="file"
                    className={`form-control ${
                      errors.imageUrl ? "is-invalid" : ""
                    }`}
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isImageUploading}
                    required
                  />
                  {isImageUploading && (
                    <div className="image-upload-loading">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span className="ms-2">ছবি আপলোড হচ্ছে...</span>
                    </div>
                  )}
                  {errors.imageUrl && (
                    <div className="invalid-feedback">{errors.imageUrl}</div>
                  )}
                </div>
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
                type="submit" 
                className="btn btn-primary"
                disabled={isImageUploading} // Disable submit button during image upload
              >
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