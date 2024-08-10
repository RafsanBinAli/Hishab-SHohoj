import React, { useState, useEffect } from "react";
import "./Borrowed.css";
import MessageModal from "../Modal/MessageModal";

const FarmerDetailsToggler = () => {
  const [showNewDebtForm, setShowNewDebtForm] = useState(false);
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [farmerList, setFarmerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);

  const [newFarmerData, setNewFarmerData] = useState({
    farmerName: "",
    totalDue: "",
    payGet: "",
    newDhar: "",
    remainingDue: "",
  });

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-farmers`
        );
        if (!response.ok) throw new Error("Failed to fetch farmer data");
        const data = await response.json();
        setFarmerList(data);
      } catch (error) {
        console.error("Error fetching farmer data:", error);
      }
    };
    fetchFarmerData();
  }, []);

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

      const updatedFarmer = await updateResponse.json();
      setFarmerList(
        farmerList.map((farmer) =>
          farmer.name === newFarmerData.farmerName
            ? {
                ...farmer,
                totalDue: updatedFarmer.totalDue,
                editHistory: updatedFarmer.editHistory,
              }
            : farmer
        )
      );

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

      const updatedFarmer = await updateResponse.json();
      setFarmerList(
        farmerList.map((farmer) =>
          farmer.name === newFarmerData.farmerName
            ? {
                ...farmer,
                totalDue: updatedFarmer.totalDue,
                totalPaid: updatedFarmer.totalPaid,
                editHistory: updatedFarmer.editHistory,
              }
            : farmer
        )
      );

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
      setRedirectTo("/borrow");
    } catch (error) {
      showModal("Error", error.message || "Failed to save payment data");
    }
  };

  const filteredFarmersList = farmerList.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFarmerSelection = (farmer) => {
    setNewFarmerData({
      farmerName: farmer.name,
      totalDue: farmer.totalDue,
      payGet: "",
      newDhar: "",
      remainingDue: farmer.totalDue,
    });
    setFilteredFarmers([]);
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

      if (name === "farmerName") {
        const searchTerm = value.toLowerCase();
        setFilteredFarmers(
          farmerList.filter((farmer) =>
            farmer.name.toLowerCase().includes(searchTerm)
          )
        );
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
        <button onClick={toggleNewDebtForm}>
          নতুন ধার এর তথ্য সংযুক্ত করুন
        </button>
        <button onClick={toggleNewPaymentForm}>
          নতুন পরিশোধের তথ্য সংযুক্ত করুন
        </button>
      </div>

      {showNewDebtForm && (
        <div className="new-farmer-section">
          <h2 className="farmer-header-demo font-weight-bold">
            নতুন ধার এর তথ্য সংযুক্ত করুন
          </h2>
          <div className="new-farmer-inputs">
            <div>
              <div className="headings">
                <label className="farmerName">কৃষকের নাম</label>
              </div>
              <input
                type="text"
                name="farmerName"
                className="farmer-name"
                value={newFarmerData.farmerName}
                onChange={handleNewFarmerInputChange}
                placeholder="কৃষকের নাম"
              />
              {filteredFarmers.length > 0 && (
                <ul className="list-group-f">
                  {filteredFarmers.map((farmer) => (
                    <li
                      key={farmer._id}
                      className="list-group-item"
                      onClick={() => handleFarmerSelection(farmer)}
                    >
                      {farmer.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div className="headings">
                <label className="totalDue">পূর্বের ধার</label>
              </div>
              <input
                type="number"
                name="totalDue"
                value={newFarmerData.totalDue}
                placeholder="পূর্বের ধার"
                disabled
              />
            </div>
            <div>
              <div className="">
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
            <div>
              <div className="headings">
                <label className="remainingDue">বাকি</label>
              </div>
              <input
                type="number"
                name="remainingDue"
                value={newFarmerData.remainingDue}
                placeholder="বাকি"
                disabled
              />
            </div>
            <div className="saveBtn">
              <div className="headingBtn"></div>
              <button
                onClick={handleSaveDebtClick}
                disabled={!newFarmerData.farmerName}
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewPaymentForm && (
        <div className="new-farmer-section">
          <h2 className="farmer-header-demo font-weight-bold">
            নতুন পরিশোধের তথ্য সংযুক্ত করুন
          </h2>
          <div className="new-farmer-inputs">
            <div>
              <div className="headings">
                <label className="farmerName">কৃষকের নাম</label>
              </div>
              <input
                type="text"
                name="farmerName"
                className="farmer-name"
                value={newFarmerData.farmerName}
                onChange={handleNewFarmerInputChange}
                placeholder="কৃষকের নাম"
              />
              {filteredFarmers.length > 0 && (
                <ul className="list-group-f">
                  {filteredFarmers.map((farmer) => (
                    <li
                      key={farmer._id}
                      className="list-group-item"
                      onClick={() => handleFarmerSelection(farmer)}
                    >
                      {farmer.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div className="headings">
                <label className="totalDue">পূর্বের ধার</label>
              </div>
              <input
                type="number"
                name="totalDue"
                value={newFarmerData.totalDue}
                placeholder="পূর্বের ধার"
                disabled
              />
            </div>
            <div>
              <div className="headings">
                <label className="payGet">টাকা গ্রহণ/ধার দান</label>
              </div>
              <input
                type="number"
                name="payGet"
                value={newFarmerData.payGet}
                onChange={handleNewFarmerInputChange}
                placeholder="টাকা গ্রহণ/ধার দান"
              />
            </div>
            <div>
              <div className="headings">
                <label className="remainingDue">বাকি</label>
              </div>
              <input
                type="number"
                name="remainingDue"
                value={newFarmerData.remainingDue}
                placeholder="বাকি"
                disabled
              />
            </div>
            <div className="saveBtn">
              <div className="headingBtn"></div>
              <button
                onClick={handleSavePaymentClick}
                disabled={!newFarmerData.farmerName}
              >
                সংরক্ষণ করুন
              </button>
            </div>
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
