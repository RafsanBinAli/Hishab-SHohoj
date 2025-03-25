import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import MessageModal from "../Modal/MessageModal";
import "./BankDetails.css";

const BankDetails = () => {
  const { id } = useParams();
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch bank details
  useEffect(() => {
    const fetchBank = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/bank/info/${id}`,
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch bank details: ${response.statusText}`,
          );
        }
        const data = await response.json();
        console.log("Fetched bank data:", data);
        setBank(data);
        setFormData({
          bankName: data.bankName,
          address: data.village,
          phoneNumber: data.phoneNumber,
          imageUrl: data.imageUrl,
        });
      } catch (error) {
        console.error("Error fetching bank details:", error);
        setError("Bank details could not be retrieved. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBank();
  }, [id]);

  // Handle form updates
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/bank/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update bank details: ${response.statusText}`,
        );
      }

      const updatedBank = await response.json();
      setBank(updatedBank);
      setIsEditable(false);
      setModalTitle("Success");
      setModalMessage("Bank details updated successfully.");
      setModalShow(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Failed to update bank details. Please try again.");
      setModalShow(true);
    } finally {
      setLoading(false);
    }
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

      // Set the preview URL and upload the file
      setImagePreview(URL.createObjectURL(file));
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
        const newImageUrl = data.data.url;

        // Update formData with the new image URL
        setFormData((prevData) => ({
          ...prevData,
          imageUrl: newImageUrl,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        setModalTitle("Error");
        setModalMessage("Image upload failed. Please try again.");
        setModalShow(true);
      }
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

  // Display loading or error states
  if (loading) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!bank) return <div className="alert alert-warning">Bank not found</div>;

  return (
    <div className="container mt-4">
      <Card className="bank-card">
        <Card.Body>
          <Card.Title className="text-center bank-title">
            ব্যাংকের বিবরণ
          </Card.Title>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formBankName" className="mb-3">
                  <Form.Label>ব্যাংক নাম:</Form.Label>
                  <Form.Control
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formBankAddress" className="mb-3">
                  <Form.Label>ঠিকানা:</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formBankPhoneNumber" className="mb-3">
                  <Form.Label>মোবাইল নম্বর:</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group>

                {/* <Form.Group controlId="formBankPaymentDue" className="mb-3">
                  <Form.Label>মোট বাকি:</Form.Label>
                  <Form.Control
                    type="text"
                    name="paymentDue"
                    value={formData.paymentDue}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                  />
                </Form.Group> */}
              </Col>

              <Col md={6} className="text-center">
                <div className="bank-image-container">
                  <img
                    src={imagePreview || formData.imageUrl}
                    alt="Bank"
                    className="bank-image"
                  />
                </div>
                {isEditable && (
                  <Form.Group controlId="formBankImage" className="mt-3">
                    <Form.Label>নতুন ছবি আপলোড করুন:</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                  </Form.Group>
                )}
              </Col>
            </Row>

            <div className="bank-button-container mt-4 text-center">
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

export default BankDetails;
