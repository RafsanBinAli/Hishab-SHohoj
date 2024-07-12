import React, { useState, useEffect } from "react";
import "./Borrowed.css";

const Borrowed = () => {
  const [newFarmerData, setNewFarmerData] = useState({
    farmerName: "",
    totalDue: 0,
    payNow: 0,
    remainingDue: 0,
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
    setNewFarmerData((prevData) => ({
      ...prevData,
      [name]: name === "farmerName" ? value : parseFloat(value),
    }));

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
      totalDue: farmer.totalDue, // Adding totalDue from selected farmer
      payNow: newFarmerData.payNow, // Preserve other fields if needed
      remainingDue: newFarmerData.remainingDue,
    });
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
  const handleEditFarmer = (index) => {
    const farmerToEdit = farmerList[index];
    setNewFarmerData({
      farmerName: farmerToEdit.name,
      totalDue: farmerToEdit.totalDue,
      payNow: farmerToEdit.payNow,
      remainingDue: farmerToEdit.remainingDue,
    });
    // Additional logic for showing the edit form or any specific behavior
  };
 

  return (
    <div className="borrowed-container">
      <h2 className="borrowed-heading font-weight-bold">Due of Farmers</h2>

      <div className="button-container">
        <button onClick={toggleNewDebtForm}>Add New Debt Data</button>
        <button onClick={toggleNewPaymentForm}>Add New Payment Data</button>
      </div>

      {showNewDebtForm && (
        <div className="new-farmer-section">
          <h3 className="farmer-header-demo">Add New Debt Data</h3>
          <div className="new-farmer-inputs">
            <input
              type="text"
              name="farmerName"
              className="farmer-name"
              value={newFarmerData.farmerName}
              onChange={handleNewFarmerInputChange}
              placeholder="Farmer Name"
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
              name="due"
              value={newFarmerData?.totalDue}
              onChange={handleNewFarmerInputChange}
              placeholder="Due"
            />
            <input
              type="number"
              name="payNow"
              value={newFarmerData.payNow}
              onChange={handleNewFarmerInputChange}
              placeholder="Pay Now"
            />
            <input
              type="number"
              name="remainingDue"
              value={newFarmerData.remainingDue}
              onChange={handleNewFarmerInputChange}
              placeholder="Remaining Due"
            />
            <button onClick={handleSaveDebtClick}>Save</button>
          </div>
        </div>
      )}

      {showNewPaymentForm && (
        <div className="new-farmer-section">
          <h3 className="farmer-header-demo">Add New Payment Data</h3>
          <div className="new-farmer-inputs">
            <input
              type="text"
              name="farmerName"
              className="farmer-name"
              value={newFarmerData.farmerName}
              onChange={handleNewFarmerInputChange}
              placeholder="Farmer Name"
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
              value={newFarmerData.payNow}
              onChange={handleNewFarmerInputChange}
              placeholder="Pay Now"
            />
            <button onClick={handleSavePaymentClick}>Save</button>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="borrowed-table">
          <thead>
            <tr>
              <th>Farmer's Name</th>
              <th>Total Due</th>
              <th>Paid Untill now</th>
              <th>Remaining Due</th>
              <th>Action</th>

            </tr>
          </thead>
          <tbody>
            {farmerList.map((farmer, index) => (
              <tr key={index}>
                <td>{farmer.name}</td>
                <td>{farmer.totalDue}</td>
                <td>{farmer.payNow}</td>
                <td>{farmer.remainingDue}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEditFarmer(index)}>Edit</button>
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
