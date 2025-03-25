import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import MessageModal from "../Modal/MessageModal";
import "./FarmerDetails.css";

const FarmerDetails = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [newUserInfo] = useState({
    name: "",
    phoneNumber: "",
    village: "",
    imageUrl: "",
  });

  // Fetch farmer details
  useEffect(() => {
    const fetchFarmer = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/farmers/${id}`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch farmer details: ${response.statusText}`,
          );
        }

        const data = await response.json();
        setFarmer(data);
        setFormData({
          name: data.name,
          village: data.village,
          phoneNumber: data.phoneNumber,
          imageUrl: data.imageUrl,
        });
      } catch (error) {
        console.error("Error fetching farmer details:", error); // Log error for debugging
        setError("Farmer details could not be retrieved. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [id]);

  // Update function to handle updates
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    const updatedInfo = {
      ...formData,
      imageUrl: newUserInfo.imageUrl || formData.imageUrl, // Use new image URL if available
    };


    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/farmers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedInfo),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update farmer details: ${response.statusText}`,
        );
      }

      const updatedFarmer = await response.json();
      setFarmer(updatedFarmer);
      setFormData({
        name: updatedFarmer.name,
        phoneNumber: updatedFarmer.phoneNumber,
        village: updatedFarmer.village,
        imageUrl: updatedFarmer.imageUrl,
      });
      setIsEditable(false); // Exit edit mode
      setModalTitle("Success");
      setModalMessage("Farmer details updated successfully.");
      setModalShow(true);
    } catch (error) {
      console.error("Error updating farmer details:", error);
      setModalTitle("Error");
      setModalMessage("Failed to update farmer details. Please try again.");
      setModalShow(true);
    } finally {
      setLoading(false);
    }
  };

  // Enter edit mode
  const handleEdit = () => {
    setIsEditable(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
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
          "The file size exceeds the 5MB limit. Please upload a smaller file.",
        );
        setModalShow(true);
        return;
      }

      // Set the preview URL
      setImagePreview(URL.createObjectURL(file));

      // Upload image to a service (like imgbb)
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_KEY}`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) throw new Error("Failed to upload image");
        const data = await response.json();
        const newImageUrl = data.data.url;

        // Update formData with the new image URL
        setFormData((prevData) => ({
          ...prevData,
          imageUrl: newImageUrl,
        }));
      } catch (error) {
        setModalTitle("Error");
        setModalMessage("Image upload failed. Please try again.");
        setModalShow(true);
      }
    }
  };

  // Display loading or error states
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!farmer) {
    return <div className="alert alert-warning">Farmer not found</div>;
  }

  return (
    <div className="container mt-4 farmer-details-container">
      <Card className="farmer-card shadow-sm">
        <Card.Body>
          <Card.Title className="text-center farmer-title">
            কৃষকের বিবরণ
          </Card.Title>
          <Form>
            <Row className="align-items-center">
              <Col md={6}>
                <Form.Group controlId="formFarmerName" className="mb-3">
                  <Form.Label>নাম:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formFarmerVillage" className="mb-3">
                  <Form.Label>গ্রাম:</Form.Label>
                  <Form.Control
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formFarmerPhoneNumber" className="mb-3">
                  <Form.Label>ফোন নম্বর:</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="text-center">
                <div className="farmer-image-container">
                  <img
                    src={imagePreview || formData.imageUrl}
                    alt="Farmer"
                    className="farmer-image"
                  />
                </div>
                {isEditable && (
                  <Form.Group controlId="formFarmerImage" className="mt-3">
                    <Form.Label>নতুন ছবি আপলোড করুন:</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                  </Form.Group>
                )}
              </Col>
            </Row>

            <div className="text-center mt-4">
              {isEditable ? (
                <Button variant="success" onClick={handleUpdate}>
                  Update
                </Button>
              ) : (
                <Button variant="primary" onClick={handleEdit}>
                  Edit
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Message Modal */}
      <MessageModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => setModalShow(false)}
      />
    </div>
  );
};

export default FarmerDetails;
