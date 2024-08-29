import React, { useEffect, useState } from "react";
import MessageModal from "../Modal/MessageModal";
import BankList from "./BankList";

const Bank = () => {
  const [users, setUsers] = useState([]);
  const [newUserInfo, setNewUserInfo] = useState({
    bankName: "",
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
    const fetchBanks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/bank/get-all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch banks");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    fetchBanks();
  }, []);

  const handleUserInputChange = (event) => {
    const { name, value } = event.target;
    setNewUserInfo({ ...newUserInfo, [name]: value });
  };

  const handleAddUser = async () => {

    const { bankName, phoneNumber, village, imageUrl } = newUserInfo;
    if (!bankName) {
      setModalTitle("Validation Error");
      setModalMessage("Bank নাম পূরণ করুন।");
      setModalShow(true);
      return;
    }
    if (!phoneNumber) {
      setModalTitle("Validation Error");
      setModalMessage("নাম্বার পূরণ করুন।");
      setModalShow(true);
      return;
    }
    if (!village) {
      setModalTitle("Validation Error");
      setModalMessage("গ্রাম পূরণ করুন।");
      setModalShow(true);
      return;
    }
    if (!imageUrl) {
      setModalTitle("Validation Error");
      setModalMessage("ছবি সংযুক্ত করুন।");
      setModalShow(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/bank/create`,
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
      setModalMessage("নতুন Bank সংযুক্ত হয়েছে!");
      setRedirectTo("/banks");
      setModalShow(true);

      setNewUserInfo({
        bankName: "",
        phoneNumber: "",
        village: "",
        imageUrl: "",
      });
      setImagePreview(null);

      const updatedUsers = await response.json();
      setUsers(updatedUsers);
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
      console.log(file);
      console.log(process.env.REACT_APP_IMGBB_KEY)
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
      <div className="d-flex justify-content-center mb-4">
        <div className="card2">
          <div className="card-body2">
            <h2 className="card-title mb-4">নতুন Bank তথ্য দিন</h2>
            <form>
              <div className="form-group">
                <label htmlFor="bankName">Bank নাম</label>
                <input
                  type="text"
                  className="form-control"
                  id="bankName"
                  name="bankName"
                  value={newUserInfo.bankName}
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
                  Bank ছবি সংযুক্ত করুন
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

      <div className="bank-list-container">
        <BankList banks={users} />
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

export default Bank;