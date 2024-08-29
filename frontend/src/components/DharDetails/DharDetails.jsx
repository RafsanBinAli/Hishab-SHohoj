import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FarmerDetailsToggler from "./FarmerDetailsToggler";
import "./DharDetails.css";

const DharDetails = () => {
  const location = useLocation();
  const { farmer } = location.state || {};
  const [farmerData, setFarmerData] = useState(farmer);

  useEffect(() => {
    if (farmer) {
      setFarmerData(farmer);
    }
  }, [farmer]);

  const onUpdate = async () => {
    console.log("onUpdate called");
    try {
      const userAuthToken = localStorage.getItem("userAuthToken");
      if (!userAuthToken) throw new Error("User is not authenticated.");

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/farmer/${encodeURIComponent(
          farmerData.name
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userAuthToken}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(
          `Failed to fetch updated farmer data for ${farmerData.name}.`
        );

      const updatedFarmer = await response.json();
      setFarmerData(updatedFarmer);
    } catch (error) {
      console.error("Error fetching updated farmer data:", error);
    }
  };

  if (!farmerData) {
    return <p>No dhar details available.</p>;
  }

  return (
    <div className="dhar-details-container">
      <h1 className="details-header">Dhar Details</h1>
      <div className="details-content">
        <div className="card-item entry-item">
          <div className="card-content">
            <div className="card-section">
              <div className="card-section-left">
                <h2 className="entries-header font-weight-bold">কৃষকের ধার</h2>

                {/* Farmer Image */}
                <div className="dhar-farmer-image-container">
                  <img
                    src={farmerData.imageUrl || "placeholder-image-url.jpg"}
                    alt={farmerData.name}
                    className="dhar-farmer-image"
                  />
                </div>

                <div className="farmer-info">
                  <div className="info-item-farmer">
                    <span className="label">কৃষকের নাম:</span> {farmerData.name}
                  </div>
                  <div className="info-item-farmer">
                    <span className="label">মোট ধার:</span>{" "}
                    {farmerData.totalDue}
                  </div>
                  <div className="info-item-farmer">
                    <span className="label">পরিশোধ :</span>{" "}
                    {farmerData.totalPaid}
                  </div>
                  <div className="info-item-farmer">
                    <span className="label">বাকি:</span>{" "}
                    {farmerData.totalDue - farmerData.totalPaid}
                  </div>
                </div>

                <FarmerDetailsToggler farmer={farmerData} onUpdate={onUpdate} />
              </div>
              <div className="card-section-right">
                <div className="debt-entries">
                  <h2 className="entries-header font-weight-bold">
                    ধার/পরিশোধ তথ্য
                  </h2>
                  {farmerData.lastEditedBy &&
                  farmerData.lastEditedBy.length > 0 ? (
                    <ul className="entries-list">
                      {farmerData.lastEditedBy.map((entry, index) => (
                        <li
                          key={index}
                          className={`entry-item ${
                            entry.action === "newDebt"
                              ? "debt-added"
                              : "debt-repaid"
                          }`}
                        >
                          <div className="info-item">
                            <span className="label">ধার/ পরিশোধ:</span>{" "}
                            {entry.action === "newDebt" ? "ধার" : "পরিশোধ"}
                          </div>
                          <div className="info-item">
                            <span className="label">পরিমান :</span>{" "}
                            {entry.debtAmount} টাকা
                          </div>

                          <div className="info-item">
                            <span className="label">বাকি :</span> {entry.due}{" "}
                            টাকা
                          </div>

                          <div className="info-item">
                            <span className="label">তারিখ :</span>{" "}
                            {new Date(entry.date).toLocaleDateString()}
                          </div>

                          <div className="info-item">
                            <span className="label">ডাটা এন্ট্রি :</span>{" "}
                            {entry.editedBy}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No debt entries available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DharDetails;
