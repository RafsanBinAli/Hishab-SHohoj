import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import "./SlipDetails.css"; // Custom CSS for styling
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import banglaFont from "../../font/NikoshGrameen.ttf"; // Replace with your font file path

const SlipDetails = () => {
  const { shopName } = useParams(); // Get shopName from URL parameter
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date
  const [slipDetails, setSlipDetails] = useState(null);

  useEffect(() => {
    const fetchSlipDetails = async () => {
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd"); // Format date as yyyy-MM-dd
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
    doc.text(`তারিখ: ${format(selectedDate, "dd MMMM, yyyy")}`, 14, 40);

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
      <div className="date-picker-container">
        <FaCalendarAlt className="calendar-icon" />
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd MMMM, yyyy"
          className="date-picker"
          placeholderText="Select a date"
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
              <button className="btn btn-primary" onClick={handleDownloadPDF}>
                পিডিএফ ডাউনলোড করুন
              </button>
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
