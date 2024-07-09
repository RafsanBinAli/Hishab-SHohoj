import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SlipDetails.css"; // Custom CSS for styling
import { format } from "date-fns";

const SlipDetails = () => {
  const { shopName } = useParams(); // Get shopName from URL parameter
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date
  const [slipDetails, setSlipDetails] = useState(null);

  useEffect(() => {
    const fetchSlipDetails = async () => {
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd"); // Format date as yyyy-MM-dd
        console.log(formattedDate);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/slip-details/${formattedDate}?shopName=${shopName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch slip details");
        }
        const data = await response.json();
        setSlipDetails(data);
      } catch (error) {
        console.error("Error fetching slip details:", error);
        // Handle error state or alert user
      }
    };

    fetchSlipDetails();
  }, [selectedDate, shopName]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="slip-details-container">
      <h2 className="slip-details-heading font-weight-bold">হিসাবের বিবরণ</h2>
      <div className="date-picker-container">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd MMMM, yyyy"
          className="date-picker"
          style={{
            width: "100%",
            padding: "0.375rem 0.75rem",
            fontSize: "1rem",
          }}
          placeholderText="Select a date"
          customInput={<input readOnly />}
          renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
            <div>
              <div>{format(date, "MMMM yyyy")}</div>
              <div>
                <button onClick={decreaseMonth}>{"<"}</button>
                <button onClick={increaseMonth}>{">"}</button>
              </div>
            </div>
          )}
        />
      </div>
      {slipDetails ? (
        <div className="slip-card">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{slipDetails.shopName}</h5>
              <p className="card-text">
                Total Amount: {slipDetails.totalAmount}
              </p>
              <table className="table table-striped slip-table">
                <thead>
                  <tr>
                    <th>কৃষকের নাম</th>
                    <th>পণ্যের নাম</th>
                    <th>পরিমাণ (কেজি)</th>
                    <th>দাম (টাকা/কেজি)</th>
                    <th>মোট টাকা</th>{" "}
                    {/* New column for individual total amount */}
                  </tr>
                </thead>
                <tbody>
                  {slipDetails.purchases.map((purchase, index) => (
                    <tr key={index} className="slip-row">
                      <td>{purchase.farmerName}</td>
                      <td>{purchase.stockName}</td>
                      <td>{purchase.quantity}</td>
                      <td>{purchase.price}</td>
                      <td>{purchase.quantity * purchase.price}</td>{" "}
                      {/* Calculate individual total amount */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading slip details...</p>
      )}
    </div>
  );
};

export default SlipDetails;
