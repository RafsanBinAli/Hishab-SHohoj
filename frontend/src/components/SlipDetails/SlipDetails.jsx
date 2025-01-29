import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { format, addDays, subDays } from "date-fns";
import Loader from "../Loader/Loader";
import { getCurrentDate } from "../../functions/getCurrentDate";
import handleDownload from "../../functions/handleDownload";
import "./SlipDetails.css";

const SlipDetails = () => {
  const { shopName } = useParams();
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [slipDetails, setSlipDetails] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const slipRef = useRef(null);

  useEffect(() => {
    const fetchSlipDetails = async () => {
      setLoading(true);
      try {
        const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/slip-details/${formattedDate}?shopName=${shopName}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch slip details");
        }
        const data = await response.json();
        setSlipDetails(data);
      } catch (error) {
        console.error("Error fetching slip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlipDetails();
  }, [selectedDate, shopName]);

  useEffect(() => {
    const getShopDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-shop-details/${shopName}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch shop details");
        }
        const data = await response.json();
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

  const handleNextDate = () => {
    setSelectedDate((prevDate) =>
      format(addDays(new Date(prevDate), 1), "yyyy-MM-dd"),
    );
  };

  const handlePreviousDate = () => {
    setSelectedDate((prevDate) =>
      format(subDays(new Date(prevDate), 1), "yyyy-MM-dd"),
    );
  };

  const downloadPdf = () => {
    handleDownload(slipRef, "Shop Slip");
  };

  return (
    <div className="slip-details-container">
      <h2 className="slip-details-heading font-weight-bold">হিসাবের বিবরণ</h2>
      <div className="text-center date-picker-container">
        <button onClick={handlePreviousDate} className="arrow-button">
          &#9664;
        </button>
        <label htmlFor="datePicker" className="font-weight-bold">
          তারিখ:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="date-picker"
        />
        <button onClick={handleNextDate} className="arrow-button">
          &#9654;
        </button>
      </div>
      {loading ? (
        <Loader />
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
                    <td>{slipDetails?.totalAmount} টাকা</td>
                  </tr>
                  <tr className="slip-row font-weight-bold">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>আগের মোট বাকি</td>
                    <td>
                      {shopDetails?.totalDue - slipDetails?.totalAmount} টাকা
                    </td>
                  </tr>
                  <tr className="slip-row font-weight-bold">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>চূড়ান্ত মোট </td>
                    <td>
                      {Math.abs(
                        shopDetails?.totalDue - slipDetails?.totalAmount,
                      ) + slipDetails?.totalAmount}{" "}
                      টাকা
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <button className="download-button" onClick={downloadPdf}>
            পিডিএফ ডাউনলোড করুন
          </button>
        </div>
      ) : (
        <p className="loading-text">এই তারিখের জন্য কোনো তথ্য পাওয়া যায়নি।</p>
      )}
    </div>
  );
};

export default SlipDetails;
