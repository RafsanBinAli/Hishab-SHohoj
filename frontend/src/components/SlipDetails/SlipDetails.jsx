import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import "./SlipDetails.css"; // Custom CSS for styling
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import banglaFont from "../../font/NikoshGrameen.ttf"; // Replace with your font file path
import Loader from "../Loader/Loader"; // Import the Loader component
import { getCurrentDate } from "../../functions/getCurrentDate"; // Import the getCurrentDate function

const SlipDetails = () => {
  const { shopName } = useParams(); // Get shopName from URL parameter
  const [selectedDate, setSelectedDate] = useState(getCurrentDate()); // Initialize with today's date from getCurrentDate function
  const [slipDetails, setSlipDetails] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Load Bangla font
    doc.addFileToVFS(banglaFont);
    doc.addFont(banglaFont, "BanglaFont", "normal");

    // Set font for the entire document
    doc.setFont("BanglaFont");

    // Set font size
    doc.setFontSize(12);

    // Document content
    doc.text("হিসাবের বিবরণ", 14, 20);
    doc.text(`দোকানের নাম: ${shopName}`, 14, 30);
    doc.text(
      `তারিখ: ${format(new Date(selectedDate), "dd MMMM, yyyy")}`,
      14,
      40
    );

    // Table headers
    const tableColumn = [
      { header: "কৃষকের নাম", dataKey: "farmerName" },
      { header: "পণ্যের নাম", dataKey: "stockName" },
      { header: "পরিমাণ (কেজি)", dataKey: "quantity" },
      { header: "দাম (টাকা/কেজি)", dataKey: "price" },
      { header: "মোট টাকা", dataKey: "totalAmount" },
    ];

    // Table rows
    const tableRows = slipDetails.purchases.map((purchase) => ({
      farmerName: purchase.farmerName,
      stockName: purchase.stockName,
      quantity: purchase.quantity.toString(),
      price: purchase.price.toString(),
      totalAmount: (purchase.quantity * purchase.price).toString(),
    }));

    // Add the 'Ager Mot Baki' and 'Mot Taka' as new rows in the table
    tableRows.push(
      {
        farmerName: "আগের মোট বাকি",
        stockName: "",
        quantity: "",
        price: "",
        totalAmount: shopDetails?.totalDue.toString(),
      },
      {
        farmerName: "মোট টাকা",
        stockName: "",
        quantity: "",
        price: "",
        totalAmount: slipDetails?.totalAmount.toString(),
      }
    );

    // Set table headers font
    doc.autoTable(tableColumn, tableRows, {
      startY: 50,
      margin: { top: 50 },
      styles: { font: "BanglaFont", fontStyle: "normal" },
      columnStyles: {
        0: { fontStyle: "normal" },
        1: { fontStyle: "normal" },
        2: { fontStyle: "normal" },
        3: { fontStyle: "normal" },
        4: { fontStyle: "normal" },
      },
      headerStyles: { fontStyle: "normal" },
      bodyStyles: { fontStyle: "normal" },
      showHead: "firstPage",
    });

    doc.save("slip-details.pdf");
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
        <div className="slip-card">
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
                    <td>আগের মোট বাকি</td>
                    <td>{shopDetails?.totalDue} টাকা</td>
                  </tr>
                  <tr className="slip-row font-weight-bold">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>মোট টাকা</td>
                    <td>{slipDetails?.totalAmount} টাকা</td>
                  </tr>
                </tbody>
              </table>
              <button className="download-button" onClick={handleDownloadPDF}>
                পিডিএফ ডাউনলোড করুন
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="loading-text">No slip details found.</p>
      )}
    </div>
  );
};

export default SlipDetails;
