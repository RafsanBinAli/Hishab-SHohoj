import React, { useState, useEffect } from "react";
import "./Borrowed.css";

const FarmerDetailsToggler = () => {
  const [showNewDebtForm, setShowNewDebtForm] = useState(false);
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [farmerList, setFarmerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-farmers`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch farmer data");
        }
        const data = await response.json();
        setFarmerList(data);
      } catch (error) {
        console.error("Error fetching farmer data:", error);
      }
    };
    fetchFarmerData();
  }, []);

  const [newFarmerData, setNewFarmerData] = useState({
    farmerName: "",
    totalDue: "",
    totalPaid: "",
    remainingDue: "",
    payGet: "",
    newDhar: "",
    editHistory: [],
  });

  const handleSaveDebtClick = async () => {
    if (newFarmerData.newDhar <= 0) {
      alert("Invalid value for ধার দান. Please enter a valid amount.");
      return;
    }

    try {
      const userAuthToken = localStorage.getItem("userAuthToken");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/update-farmers/${newFarmerData.farmerName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userAuthToken}`,
          },
          body: JSON.stringify({
            newDhar: newFarmerData.newDhar,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update farmer's details");
      }

      const updatedFarmer = await response.json();
      const updatedFarmerList = farmerList.map((farmer) =>
        farmer.name === newFarmerData.farmerName
          ? {
              ...farmer,
              totalDue: updatedFarmer.totalDue,
              editHistory: updatedFarmer.editHistory,
            }
          : farmer
      );
      setFarmerList(updatedFarmerList);
      alert("ধারের ডাটা সংরক্ষণ হয়েছে!");
      console.log("Debt data saved:", updatedFarmer);
    } catch (error) {
      console.error("Error saving debt data:", error);
      alert(error.message || "Failed to save debt data");
    }
  };

  const handleSavePaymentClick = async () => {
    if (newFarmerData.payGet <= 0) {
      alert("Invalid value for টাকা গ্রহণ/ধার দান. সঠিক তথ্য প্রদান করুন.");
      return;
    }

    try {
      const userAuthToken = localStorage.getItem("userAuthToken");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/update-farmers/${newFarmerData.farmerName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userAuthToken}`,
          },
          body: JSON.stringify({
            payGet: newFarmerData.payGet,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update farmer's details");
      }

      const updatedFarmer = await response.json();
      const updatedFarmerList = farmerList.map((farmer) =>
        farmer.name === newFarmerData.farmerName
          ? {
              ...farmer,
              totalDue: updatedFarmer.totalDue,
              totalPaid: updatedFarmer.totalPaid,
              editHistory: updatedFarmer.editHistory,
            }
          : farmer
      );

      setFarmerList(updatedFarmerList);
      alert("পরিশোধের ডাটা সংরক্ষণ হয়েছে!");
      console.log("Payment data saved:", updatedFarmer);
    } catch (error) {
      console.error("Error saving payment data:", error);
      alert(error.message || "Failed to save payment data");
    }
  };

  const filteredFarmersList = farmerList.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFarmerSelection = (farmer) => {
    setNewFarmerData({
      farmerName: farmer.name,
      totalDue: farmer.totalDue,
      totalPaid: "",
      remainingDue: farmer.totalDue,
      payGet: "",
    });
    setFilteredFarmers([]);
  };

  const handleNewFarmerInputChange = (e) => {
    const { name, value } = e.target;

    setNewFarmerData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      if (name === "newDhar") {
        updatedData.remainingDue =
          parseFloat(updatedData.totalDue || 0) + parseFloat(value || 0);
      } else if (name === "payGet") {
        updatedData.remainingDue =
          parseFloat(updatedData.totalDue || 0) - parseFloat(value || 0);
      }

      if (name === "farmerName") {
        const searchTerm = value.toLowerCase();
        const filtered = farmerList.filter((farmer) =>
          farmer.name.toLowerCase().includes(searchTerm)
        );
        setFilteredFarmers(filtered);
      }

      return updatedData;
    });
  };

  const toggleNewDebtForm = () => {
    setShowNewDebtForm(!showNewDebtForm);
    setShowNewPaymentForm(false);
  };

  const toggleNewPaymentForm = () => {
    setShowNewPaymentForm(!showNewPaymentForm);
    setShowNewDebtForm(false);
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
              <div>
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
                disabled={!newFarmerData.farmerName}
              />
            </div>

            <div>
              <div className="headings">
                <label className="payGet">ধার দান</label>
              </div>
              <input
                type="number"
                name="newDhar"
                value={newFarmerData.newDhar}
                onChange={handleNewFarmerInputChange}
                placeholder="ধার দান"
                disabled={!newFarmerData.farmerName}
              />
            </div>

            <div>
              <div className="headings">
                <label className="remainingDue">মোট ধার</label>
              </div>

              <input
                type="number"
                name="remainingDue"
                value={newFarmerData.remainingDue}
                placeholder="মোট ধার"
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
              <div>
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
                disabled={!newFarmerData.farmerName}
              />
            </div>

            <div>
              <div className="headings">
                <label className="payGet">টাকা গ্রহণ</label>
              </div>
              <input
                type="number"
                name="payGet"
                value={newFarmerData.payGet}
                onChange={handleNewFarmerInputChange}
                placeholder="টাকা গ্রহণ"
                disabled={!newFarmerData.farmerName}
              />
            </div>

            <div>
              <div className="headings">
                <label className="remainingDue">বাকী টাকা</label>
              </div>
              <input
                type="number"
                name="remainingDue"
                value={newFarmerData.remainingDue}
                placeholder="বাকী টাকা"
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
    </div>
  );
};

export default FarmerDetailsToggler;
