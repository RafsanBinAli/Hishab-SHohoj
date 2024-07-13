import React, { useState, useEffect } from "react";
import "./Borrowed.css";

const Borrowed = () => {
  const [newFarmerData, setNewFarmerData] = useState({
    farmerName: "",
    totalDue: "",
    totalPaid: "",
    remainingDue: "",
    payGet: "",
    newDhar: "",
  });

  const [farmerList, setFarmerList] = useState([]);
  const [showNewDebtForm, setShowNewDebtForm] = useState(false);
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [editingFarmer, setEditingFarmer] = useState(null);

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
      } else if (name === "totalDue") {
        updatedData.remainingDue =
          parseFloat(value || 0) + parseFloat(updatedData.totalPaid || 0);
      }

      // Calculate remainingDue based on payGet and totalDue
      if (name === "payGet") {
        updatedData.remainingDue =
          parseFloat(updatedData.totalDue || 0) - parseFloat(value || 0);
      } else if (name === "totalDue") {
        updatedData.remainingDue =
          parseFloat(value || 0) - parseFloat(updatedData.payGet || 0);
      }

      return updatedData;
    });

    if (name === "farmerName") {
      const searchTerm = value.toLowerCase();
      const filtered = farmerList.filter((farmer) =>
        farmer.name.toLowerCase().includes(searchTerm)
      );
      setFilteredFarmers(filtered);
    }
  };

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

  const handleSaveDebtClick = async () => {
    console.log("new dhar", newFarmerData.newDhar);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/update-farmers/${newFarmerData.farmerName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/update-farmers/${newFarmerData.farmerName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payGet: newFarmerData.payGet,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update farmer's payment details");
      }
      const updatedFarmer = await response.json();
      const updatedFarmerList = farmerList.map((farmer) =>
        farmer.name === newFarmerData.farmerName
          ? {
              ...farmer,
              totalDue: newFarmerData.totalDue,
            }
          : farmer
      );
      setFarmerList(updatedFarmerList);
      alert("পরিশোধের ডাটা সংরক্ষণ হয়েছে!");
      console.log("Payment data saved:", newFarmerData);
    } catch (error) {
      console.error("Error saving payment data:", error);
    }
  };

  const toggleNewDebtForm = () => {
    setShowNewDebtForm(!showNewDebtForm);
    setShowNewPaymentForm(false);
  };

  const toggleNewPaymentForm = () => {
    setShowNewPaymentForm(!showNewPaymentForm);
    setShowNewDebtForm(false);
  };

  const handleEditClick = (farmer) => {
    setEditingFarmer(farmer);
    setNewFarmerData({
      farmerName: farmer.name,
      totalDue: farmer.totalDue,
      totalPaid: farmer.totalPaid,
      remainingDue: farmer.remainingDue,
      payGet: farmer.payGet,
    });
    setShowNewDebtForm(true);
    setShowNewPaymentForm(false);
  };

  return (
    <div className="borrowed-container">
      <h2 className="borrowed-heading font-weight-bold">কৃষকের ধার</h2>

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
          <h3 className="farmer-header-demo">নতুন ধার এর তথ্য সংযুক্ত করুন</h3>
          <div className="new-farmer-inputs">
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

            <input
              type="number"
              name="totalDue"
              value={newFarmerData.totalDue}
              placeholder="পূর্বের ধার"
              disabled={!newFarmerData.farmerName}
            />
            <input
              type="number"
              name="newDhar"
              value={newFarmerData.newDhar}
              onChange={handleNewFarmerInputChange}
              placeholder="টাকা প্রদান"
              disabled={!newFarmerData.farmerName}
            />
            <input
              type="number"
              name="remainingDue"
              value={newFarmerData.remainingDue}
              onChange={handleNewFarmerInputChange}
              placeholder="মোট ধার"
              disabled={!newFarmerData.farmerName}
            />
            <button
              onClick={handleSaveDebtClick}
              disabled={!newFarmerData.farmerName}
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      )}

      {showNewPaymentForm && (
        <div className="new-farmer-section">
          <h3 className="farmer-header-demo">
            নতুন পরিশোধের তথ্য সংযুক্ত করুন
          </h3>
          <div className="new-farmer-inputs">
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

            <input
              type="number"
              name="totalDue"
              value={newFarmerData.totalDue}
              onChange={handleNewFarmerInputChange}
              placeholder="মোট ধার"
              disabled={!newFarmerData.farmerName}
            />

            <input
              type="number"
              name="payGet"
              value={newFarmerData.payGet}
              onChange={handleNewFarmerInputChange}
              placeholder="টাকা গ্রহণ"
              disabled={!newFarmerData.farmerName}
            />

            <input
              type="number"
              name="remainingDue"
              value={newFarmerData.remainingDue}
              onChange={handleNewFarmerInputChange}
              placeholder="অবশিষ্ট ধার"
              disabled={!newFarmerData.farmerName}
            />
            <button
              onClick={handleSavePaymentClick}
              disabled={!newFarmerData.farmerName}
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="borrowed-table">
          <thead>
            <tr>
              <th>কৃষকের নাম</th>
              <th>মোট ধার</th>
              <th>টাকা প্রদান</th>
              <th>অবশিষ্ট</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {farmerList.map((farmer, index) => (
              <tr key={index}>
                <td>{farmer.name}</td>
                <td>{farmer.totalDue}</td>
                <td>{farmer.totalPaid}</td>
                <td>{farmer.totalDue - farmer.totalPaid}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditClick(farmer)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Borrowed;
