import React from "react";
import { useLocation } from "react-router-dom";
import FarmerDetailsToggler from "./FarmerDetailsToggler";
import "./DharDetails.css";

const DharDetails = () => {
  const location = useLocation();
  const { farmer } = location.state || {};

  console.log("Farmer Data:", farmer); // Debug log

  if (!farmer) {
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
                <h2 className="entries-header">Farmer Debt</h2>
                <div className="farmer-info">
                  <div className="info-item-farmer">
                    <span className="label">Farmer Name:</span> {farmer.name}
                  </div>
                  <div className="info-item-farmer">
                    <span className="label">Total Due:</span> {farmer.totalDue}
                  </div>
                  <div className="info-item-farmer">
                    <span className="label">Total Paid:</span>{" "}
                    {farmer.totalPaid}
                  </div>
                  <div className="info-item-farmer">
                    <span className="label">Remaining Due:</span>{" "}
                    {farmer.totalDue - farmer.totalPaid}
                  </div>
                </div>

                <FarmerDetailsToggler />
              </div>
              <div className="card-section-right">
                <div className="debt-entries">
                  <h2 className="entries-header">Debt Entries</h2>
                  {farmer.lastEditedBy && farmer.lastEditedBy.length > 0 ? (
                    <ul className="entries-list">
                      {farmer.lastEditedBy.map((entry, index) => (
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
                            {entry.debtAmount}{" "}
                            <b style={{ marginLeft: "5px" }}>টাকা</b>
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
