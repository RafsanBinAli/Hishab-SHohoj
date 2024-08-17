import React, { useState, useEffect } from "react";
import "./DharDetails.css";
import MessageModal from "../Modal/MessageModal";

const FarmerDetailsToggler = ({ farmer }) => {
  const [showNewDebtForm, setShowNewDebtForm] = useState(false);
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);

  const [newFarmerData, setNewFarmerData] = useState({
    farmerName: farmer.name,
    totalDue: farmer.totalDue,
    payGet: "",
    newDhar: "",
    remainingDue: farmer.totalDue,
  });

  useEffect(() => {
    if (farmer) {
      setNewFarmerData((prevData) => ({
        ...prevData,
        farmerName: farmer.name,
        totalDue: farmer.totalDue,
        remainingDue: farmer.totalDue,
      }));
    }
  }, [farmer]);

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalShow(true);
  };

  const hideModal = () => {
    setModalShow(false);
    setModalTitle("");
    setModalMessage("");
  };

  const handleSaveDebtClick = async () => {
    if (newFarmerData.newDhar <= 0) {
      showModal(
        "Error",
        "Invalid value for ধার দান. Please enter a valid amount."
      );
      return;
    }

    try {
      const userAuthToken = localStorage.getItem("userAuthToken");
      if (!userAuthToken) throw new Error("User is not authenticated.");

      const updateResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/update-farmers/${newFarmerData.farmerName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userAuthToken}`,
          },
          body: JSON.stringify({ newDhar: newFarmerData.newDhar }),
        }
      );
      if (!updateResponse.ok)
        throw new Error("Failed to update farmer's details");

      await updateResponse.json();

      const transactionResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/dhar-entry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            farmerName: newFarmerData.farmerName,
            amount: newFarmerData.newDhar,
          }),
        }
      );
      if (!transactionResponse.ok)
        throw new Error("Failed to update transaction details");

      showModal("Success", "ধারের ডাটা সংরক্ষণ হয়েছে!");
    } catch (error) {
      showModal("Error", error.message || "Failed to save debt data");
    }
  };

  const handleSavePaymentClick = async () => {
    if (newFarmerData.payGet <= 0) {
      showModal(
        "Error",
        "Invalid value for টাকা গ্রহণ/ধার দান. সঠিক তথ্য প্রদান করুন."
      );
      return;
    }

    try {
      const userAuthToken = localStorage.getItem("userAuthToken");
      if (!userAuthToken) throw new Error("User is not authenticated.");

      const updateResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/update-farmers/${newFarmerData.farmerName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userAuthToken}`,
          },
          body: JSON.stringify({ payGet: newFarmerData.payGet }),
        }
      );
      if (!updateResponse.ok)
        throw new Error("Failed to update farmer's details");

      await updateResponse.json();

      const transactionResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/dhar-repay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            farmerName: newFarmerData.farmerName,
            amount: newFarmerData.payGet,
          }),
        }
      );
      if (!transactionResponse.ok)
        throw new Error("Failed to update transaction details");

      showModal("Success", "পরিশোধের ডাটা সংরক্ষণ হয়েছে!");
    } catch (error) {
      showModal("Error", error.message || "Failed to save payment data");
    }
  };

  const handleNewFarmerInputChange = (e) => {
    const { name, value } = e.target;

    setNewFarmerData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "newDhar") {
        updatedData.remainingDue = (
          parseFloat(prevData.totalDue || 0) + parseFloat(value || 0)
        ).toFixed(2);
      } else if (name === "payGet") {
        updatedData.remainingDue = (
          parseFloat(prevData.totalDue || 0) - parseFloat(value || 0)
        ).toFixed(2);
      }

      return updatedData;
    });
  };

  const toggleNewDebtForm = () => {
    setShowNewDebtForm((prev) => !prev);
    setShowNewPaymentForm(false);
  };

  const toggleNewPaymentForm = () => {
    setShowNewPaymentForm((prev) => !prev);
    setShowNewDebtForm(false);
  };

  const handleModalConfirm = () => {
    setModalShow(false);
    if (redirectTo) {
      window.location.href = redirectTo; // Redirect to the specified page
    }
  };

  return (
    <div>
      <div className="button-container">
        <button className="m-2" onClick={toggleNewDebtForm}>
          নতুন ধার
        </button>
        <button onClick={toggleNewPaymentForm}>নতুন পরিশোধ</button>
      </div>

      {showNewDebtForm && (
        <div className="new-farmer-section">
          <h2 className="farmer-header-demo font-weight-bold">
            নতুন ধার এর তথ্য
          </h2>
          <div className="new-farmer-inputs">
            <div>
              <div className="headings">
                <label className="newDhar">ধার দান</label>
              </div>
              <input
                type="number"
                name="newDhar"
                value={newFarmerData.newDhar}
                onChange={handleNewFarmerInputChange}
                placeholder="ধার দান"
              />
            </div>
          </div>
          <div className="saveBtn">
            <div className="headingBtn"></div>
            <button className="btn-primary" onClick={handleSaveDebtClick}>
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      )}

      {showNewPaymentForm && (
        <div className="new-farmer-section">
          <h2 className="farmer-header-demo font-weight-bold">
            নতুন পরিশোধের তথ্য
          </h2>
          <div className="new-farmer-inputs">
            <div>
              <div className="headings">
                <label>টাকা গ্রহণ</label>
              </div>
              <input
                type="number"
                name="payGet"
                value={newFarmerData.payGet}
                onChange={handleNewFarmerInputChange}
                placeholder="টাকা গ্রহণ"
              />
            </div>
          </div>
          <div className="saveBtn">
            <div className="headingBtn"></div>
            <button className="btn-primary" onClick={handleSavePaymentClick}>
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      )}

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

export default FarmerDetailsToggler;
