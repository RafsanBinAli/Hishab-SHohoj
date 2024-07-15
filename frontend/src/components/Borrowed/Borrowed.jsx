// Borrowed.js

import React, { useState, useEffect } from "react";
import "./Borrowed.css";
import BorrowedTable from "./BorrowedTable";
import FarmerDetailsToggler from "./FarmerDetailsToggler";

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

      if (name === "payNow") {
        updatedData.remainingDue =
          parseFloat(updatedData.totalDue || 0) - parseFloat(value || 0);
      } else if (name === "totalDue") {
        updatedData.remainingDue =
          parseFloat(value || 0) - parseFloat(updatedData.payNow || 0);
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

    if (
      newFarmerData.newDhar <= 0 ||
      newFarmerData.newDhar > newFarmerData.totalDue
    ) {
      alert("Invalid value for ধার দান. Please enter a valid amount.");
      return;
    }
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
    if (
      newFarmerData.newDhar <= 0 ||
      newFarmerData.newDhar > newFarmerData.totalDue ||
      newFarmerData.payNow <= 0 ||
      newFarmerData.payNow > newFarmerData.totalDue
    ) {
      alert("Invalid value for টাকা গ্রহণ/ধার দান. সঠিক তথ্য প্রদান করুন.");
      return;
    }

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

  const handleEditClick = async (farmerName, updatedData) => {
    console.log(farmerName);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/update-farmers/${farmerName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update farmer's details");
      }
      const updatedFarmer = await response.json();
      const updatedFarmerList = farmerList.map((farmer) =>
        farmer.name === farmerName ? updatedFarmer : farmer
      );
      setFarmerList(updatedFarmerList);
      alert("Farmer data updated successfully!");
    } catch (error) {
      console.error("Error updating farmer data:", error);
      alert("Failed to update farmer data");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFarmersList = farmerList.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="borrowed-container">
      <h2 className="borrowed-heading font-weight-bold">কৃষকের ধার</h2>

      <FarmerDetailsToggler
        toggleNewDebtForm={toggleNewDebtForm}
        toggleNewPaymentForm={toggleNewPaymentForm}
        newFarmerData={newFarmerData}
        handleNewFarmerInputChange={handleNewFarmerInputChange}
        filteredFarmers={filteredFarmers}
        handleFarmerSelection={handleFarmerSelection}
        handleSavePaymentClick={handleSavePaymentClick}
        handleSaveDebtClick={handleSaveDebtClick}
        showNewPaymentForm={showNewPaymentForm}
        showNewDebtForm={showNewDebtForm}
      />
      <BorrowedTable
        filteredFarmersList={filteredFarmersList}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleEditClick={handleEditClick}
      />
    </div>
  );
};

export default Borrowed;
