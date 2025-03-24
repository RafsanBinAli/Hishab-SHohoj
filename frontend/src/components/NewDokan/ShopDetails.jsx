import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import MessageModal from "../Modal/MessageModal";
import "./ShopDetails.css";

const ShopDetails = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [, setNewImage] = useState(null);
  const [newUserInfo, setNewUserInfo] = useState({
    shopName: "",
    address: "",
    phoneNumber: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchShop = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/shops/${id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch shop details");
        }
        const data = await response.json();
        setShop(data);
        setFormData({
          shopName: data.shopName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          imageUrl: data.imageUrl,
        });
      } catch (error) {
        setError("Shop details could not be retrieved. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id]);

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
          "The file size exceeds the 5MB limit. Please upload a smaller file.",
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
          },
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        setNewUserInfo((prev) => ({
          ...prev,
          imageUrl: data.data.url,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        setModalTitle("Error");
        setModalMessage("Image upload failed. Please try again.");
        setModalShow(true);
      }
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedData = {
        ...formData,
        imageUrl: newUserInfo.imageUrl || formData.imageUrl,
      };

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/shops/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update shop details");
      }

      const updatedShop = await response.json();
      setShop(updatedShop);
      setIsEditable(false);
      setModalTitle("Success");
      setModalMessage("Shop details updated successfully.");
      setModalShow(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Failed to update shop details. Please try again.");
      setModalShow(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!shop) return <div className="alert alert-warning">Shop not found</div>;

  return (
    <div className="container mt-4">
      <Card className="shop-card">
        <Card.Body>
          <Card.Title className="text-center">দোকানের বিবরণ</Card.Title>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formShopName" className="mb-3">
                  <Form.Label>দোকানের নাম:</Form.Label>
                  <Form.Control
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formShopAddress" className="mb-3">
                  <Form.Label>ঠিকানা:</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formShopPhoneNumber" className="mb-3">
                  <Form.Label>মোবাইল নম্বর:</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group>

                {/*<Form.Group controlId="formShopTotalDue" className="mb-3">
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
                <div className="shop-image-container">
                  <img
                    src={imagePreview || formData.imageUrl}
                    alt="shop"
                    className="shop-image"
                  />
                </div>
                {isEditable && (
                  <Form.Group controlId="formShopImage" className="mt-3">
                    <Form.Label>নতুন ছবি আপলোড করুন:</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                  </Form.Group>
                )}
              </Col>
            </Row>

            <div className="shop-button-container mt-4 text-center">
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

export default ShopDetails;
