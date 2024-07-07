import React, { useState, useEffect } from "react";
import ShopList from "./ShopList";
import "./NewDokan2.css"

const NewDokan2 = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    address: "",
    phoneNumber: "",
    imageUrl: "", // To store the image URL
  });

  const [imagePreview, setImagePreview] = useState(null); // To preview the uploaded image

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true); // Set loading to true when image upload starts
      const imageData = new FormData();
      imageData.append("image", file);

      try {
        // Upload image to ImageBB or your preferred image hosting service
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
          imageUrl: data.data.url, // Set the image URL from response
        });

        setImagePreview(URL.createObjectURL(file)); // Preview the uploaded image
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false); // Set loading to false when image upload completes
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
      alert("Shop created successfully!");

      setFormData({
        shopName: "",
        address: "",
        phoneNumber: "",
        imageUrl: "", // Clear imageUrl after submission
      });

      setImagePreview(null); // Clear image preview
      window.location.reload();

    } catch (error) {
      console.error("Error registering shop:", error);
    }
  };
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-shops`
        ); // Replace with your API endpoint
        const data = await response.json();
        setShops(data);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    fetchShops();
  }, []);
  useEffect(() => {}, [shops]);
  return (
    <div className="container mt-4 p-2">
      <div className="row2 ">
        
          <div className="card2">
            <div className="card-body2">
              <h2 className="card-title mb-4">Register a Shop</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="shopName" className="form-label">
                    Shop Name
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
                    Address
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
                    Phone Number
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
                    Upload Image
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
                {loading ? (
                  <button type="button" className="btn btn-primary" disabled>
                    Loading...
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    Register Shop
                  </button>
                )}
              </form>
            </div>
         
        </div>
      </div>
      
      <div className="card3">
          <ShopList shops={shops} />
        </div>
    </div>
  );
};

export default NewDokan2;
