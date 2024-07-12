import React, { useState, useEffect } from "react";
import "./Borrowed.css";

const Borrowed = () => {
  const [newFarmerData, setNewFarmerData] = useState({
    farmerName: "",
    totalDue: "",
    payNow: "",
    remainingDue: "",
  });

  const [farmerList, setFarmerList] = useState([]);
  const [showNewDebtForm, setShowNewDebtForm] = useState(false);
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [filteredFarmers, setFilteredFarmers] = useState([]);

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
    const newValue = name === "farmerName" ? value : parseFloat(value);
    setNewFarmerData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: newValue,
      };
      if (name === "payNow" || name === "totalDue") {
        updatedData.remainingDue = updatedData.totalDue - updatedData.payNow;
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
    setNewFarmerData((prevData) => ({
      ...prevData,
      farmerName: farmer.name,
      totalDue: farmer.totalDue,
      remainingDue: farmer.totalDue - prevData.payNow,
    }));
    setFilteredFarmers([]);
  };

  const handleSaveDebtClick = () => {
    console.log("Saving debt data:", newFarmerData);
    // Example: axios.post('/api/saveDebt', newFarmerData);
  };

  const handleSavePaymentClick = () => {
    console.log("Saving payment data:", newFarmerData);
    // Example: axios.post('/api/savePayment', newFarmerData);
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
              value={newFarmerData.farmerName ? newFarmerData.totalDue : ""}
              onChange={handleNewFarmerInputChange}
              placeholder="মোট ধার"
              disabled={!newFarmerData.farmerName}
            />
            <input
              type="number"
              name="payNow"
              value={newFarmerData.farmerName ? newFarmerData.payNow : ""}
              onChange={handleNewFarmerInputChange}
              placeholder="টাকা প্রদান"
              disabled={!newFarmerData.farmerName}
            />
            <input
              type="number"
              name="remainingDue"
              value={newFarmerData.farmerName ? newFarmerData.remainingDue : ""}
              onChange={handleNewFarmerInputChange}
              placeholder="অবশিষ্ট"
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
              name="payNow"
              value={newFarmerData.farmerName ? newFarmerData.payNow : ""}
              onChange={handleNewFarmerInputChange}
              placeholder="টাকা প্রদান"
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
            </tr>
          </thead>
          <tbody>
            {farmerList.map((farmer, index) => (
              <tr key={index}>
                <td>{farmer.name}</td>
                <td>{farmer.totalDue}</td>
                <td>{farmer.payNow}</td>
                <td>{farmer.remainingDue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Borrowed;
