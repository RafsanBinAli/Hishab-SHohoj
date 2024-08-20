import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import Loader from "../Loader/Loader"; // Import the Loader component
import { getCurrentDate } from "../../functions/getCurrentDate"; // Import the getCurrentDate function
import "./SlipDetails.css"; // Custom CSS for styling
import handleDownload from "../../functions/handleDownload"; // Import the handleDownload function

const SlipDetails = () => {
  const { shopName } = useParams(); // Get shopName from URL parameter
  const [selectedDate, setSelectedDate] = useState(getCurrentDate()); // Initialize with today's date from getCurrentDate function
  const [slipDetails, setSlipDetails] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state
  const slipRef = useRef(null); // Ref to capture the slip details

  useEffect(() => {
    const fetchSlipDetails = async () => {
      setLoading(true); // Start loading
      try {
        const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd"); // Format date as yyyy-MM-dd
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
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchSlipDetails();
  }, [selectedDate, shopName]);

  useEffect(() => {
    const getShopDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-shop-details/${shopName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch shop details");
        }
        const data = await response.json();
        console.log(data);
        setShopDetails(data);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      }
    };
    getShopDetails();
  }, [shopName]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="slip-details-container">
      <h2 className="slip-details-heading font-weight-bold">হিসাবের বিবরণ</h2>
      <div className="text-center mb-4">
        <label htmlFor="datePicker" className="font-weight-bold">
          তারিখ:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="date-picker"
        />
      </div>
      {loading ? (
        <Loader /> // Show loader while data is being fetched
      ) : slipDetails ? (
        <div className="slip-card" ref={slipRef}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{slipDetails?.shopName}</h5>
              <table className="table table-striped slip-table">
                <thead>
                  <tr>
                    <th>কৃষকের নাম</th>
                    <th>পণ্যের নাম</th>
                    <th>পরিমাণ (কেজি)</th>
                    <th>দাম (টাকা/কেজি)</th>
                    <th>মোট টাকা</th>
                  </tr>
                </thead>
                <tbody>
                  {slipDetails?.purchases.map((purchase, index) => (
                    <tr key={index} className="slip-row">
                      <td>{purchase.farmerName}</td>
                      <td>{purchase.stockName}</td>
                      <td>{purchase.quantity}</td>
                      <td>{purchase.price}</td>
                      <td>{purchase.quantity * purchase.price}</td>
                    </tr>
                  ))}
                  <tr className="slip-row font-weight-bold">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>মোট টাকা </td>
                    <td>{shopDetails?.totalAmount} টাকা</td>
                  </tr>
                  <tr className="slip-row font-weight-bold">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>আগের মোট বাকি</td>
                    <td>{slipDetails?.totalDue} টাকা</td>
                  </tr>
                  <tr className="slip-row font-weight-bold">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>চূড়ান্ত মোট </td>
                    <td>
                      {slipDetails?.totalDue - slipDetails?.totalAmount} টাকা
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <button
            className="download-button"
            onClick={() => handleDownload(slipRef)} // Use the imported handleDownload function
          >
            পিডিএফ ডাউনলোড করুন
          </button>
        </div>
      ) : (
        <p className="loading-text">No slip details found.</p>
      )}
    </div>
  );
};

export default SlipDetails;
