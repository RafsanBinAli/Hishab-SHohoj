import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import MessageModal from "../Modal/MessageModal"; // Import the MessageModal
import "./FarmerDetails.css"; // Import the CSS file

const FarmerDetails = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const [newUserInfo, setNewUserInfo] = useState({
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
          `${process.env.REACT_APP_BACKEND_URL}/farmers/${id}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch farmer details: ${response.statusText}`
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
        setError("Farmer details could not be retrieved. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [id]);

  // Handle form updates (new details and image)
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/farmers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUserInfo),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update farmer details: ${response.statusText}`
        );
      }

      const updatedFarmer = await response.json();
      setFarmer(updatedFarmer);
      setIsEditable(false); // Exit edit mode
      setModalTitle("Success");
      setModalMessage("Farmer details updated successfully.");
      setModalShow(true);
      setLoading(false);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Failed to update farmer details. Please try again.");
      setModalShow(true);
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

  // Handle image selection
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

      // Update newImage state with selected file for preview
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set preview URL

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
      } catch (error) {
        console.error("Error uploading image:", error);
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
    <div className="container mt-4">
      <Card className="farmer-card">
        <Card.Body>
          <Card.Title className="text-center farmer-title">
            কৃষকের বিবরণ
          </Card.Title>
          <Form>
            <Row>
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

                {/*<Form.Group controlId="formFarmerTotalDue" className="mb-3">
                  <Form.Label>মোট বাকি:</Form.Label>
                  <Form.Control
                    type="text"
                    name="totalDue"
                    value={formData.totalDue}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group> */}
              </Col>

              <Col md={6} className="text-center">
                <div className="farmer-image-container">
                  <img
                    src={
                      newImage
                        ? imagePreview // If new image is selected, show preview
                        : formData.imageUrl // Otherwise, show saved image
                    }
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

            <div className="farmer-button-container mt-4 text-center">
              {isEditable ? (
                <Button variant="success" onClick={handleUpdate}>
                  আপডেট করুন
                </Button>
              ) : (
                <Button variant="primary" onClick={handleEdit}>
                  সম্পাদনা করুন
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
