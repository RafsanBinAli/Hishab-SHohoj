import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import "./CardDetail.css";

import jsPDF from "jspdf";

const CardDetail = () => {
  const { id } = useParams(); // Assuming id is passed as a URL parameter

  const [loadedData, setLoadedData] = useState(null);

  const [shops, setShops] = useState([]);

  const [formRows, setFormRows] = useState([
    { shopName: "", stockName: "", quantity: "", price: "" },
  ]);

  const [commission, setCommission] = useState(0);

  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-card-details/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch card details");
        }

        const data = await response.json();

        setLoadedData(data);
      } catch (error) {
        console.error("Error fetching card details:", error);

        // Handle error state or alert user
      }
    };

    fetchCardDetails();
  }, [id]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-shops`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch shops");
        }

        const data = await response.json();

        setShops(data);
      } catch (error) {
        console.error("Error fetching shops:", error);

        // Handle error state or alert user
      }
    };

    fetchShops();
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;

    const newFormRows = [...formRows];

    newFormRows[index][name] = value;

    setFormRows(newFormRows);
  };

  const handleAddRow = () => {
    setFormRows([
      ...formRows,

      { shopName: "", stockName: "", quantity: "", price: "" },
    ]);
  };

  const handleSave = async () => {
    try {
      // Step 1: Update the card details (assumed this updates purchases related to market deals)
      const newPurchases = formRows.map((row) => ({
        farmerName: loadedData?.farmerName,
        shopName: row.shopName,
        stockName: row.stockName,
        quantity: row.quantity,
        price: row.price,
        total: row.quantity * row.price, // Calculate total price per item
      }));

      // Send a PUT request to update the card details
      const updateCardResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/update-card-details/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ purchases: newPurchases }),
        }
      );

      if (!updateCardResponse.ok) {
        throw new Error("Failed to update card details");
      }

      console.log("Card details updated successfully");

      // Step 2: Get the current date and ensure it is formatted correctly
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Add 1 to month as it's zero-based
      const day = String(currentDate.getDate()).padStart(2, "0");
      const date = `${year}-${month}-${day}`;

      // Step 3: Check if a slip exists for the shop and selected date, and update the slip
      const findOrCreateSlipResponses = await Promise.all(
        newPurchases.map(async (purchase) => {
          try {
            // Find or create the slip
            const response = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/slip/findOrCreate`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ shopName: purchase.shopName, date }),
              }
            );

            if (!response.ok) {
              throw new Error(
                `Failed to find or create slip for ${purchase.shopName}`
              );
            }

            const slips = await response.json(); // Parse the JSON response (array of objects)

            // Iterate through each slip in the array
            await Promise.all(
              slips.map(async (slip) => {
                // Filter newPurchases for the current slip's shopName
                const purchasesToUpdate = newPurchases.filter(
                  (p) => p.shopName === slip.shopName
                );

                // Calculate totalAmount for the purchasesToUpdate
                const totalAmountToUpdate = purchasesToUpdate.reduce(
                  (total, p) => total + p.total,
                  0
                );

                // Make the updateSlip API call for each slip with filtered purchases
                const updateSlipResponse = await fetch(
                  `${process.env.REACT_APP_BACKEND_URL}/slip/update/${slip._id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      shopName: slip.shopName,
                      date,
                      purchases: purchasesToUpdate, // Use filtered purchases
                      totalAmount: totalAmountToUpdate, // Use calculated total amount
                    }),
                  }
                );

                if (!updateSlipResponse.ok) {
                  throw new Error(`Failed to update slip ${slip._id}`);
                }

                console.log(
                  `Slip ${slip._id} updated successfully with purchases:`,
                  purchasesToUpdate
                );
              })
            );
          } catch (error) {
            console.error(
              `Error finding or creating slip for ${purchase.shopName}:`,
              error
            );
            throw error; // Rethrow the error to handle it further if needed
          }
        })
      );

      // Success message or further handling
      alert("সকল স্লিপ আপডেট সম্পূর্ন হয়েছে !!");
    } catch (error) {
      console.error("Error in handleSave:", error);
      // Handle error state or alert user
    }
  };

  const handleShopChange = (index, event) => {
    const { name, value } = event.target;

    const newFormRows = [...formRows];

    newFormRows[index][name] = value;

    setFormRows(newFormRows);
  };

  const handleCommissionChange = (event) => {
    const commissionValue = event.target.value;

    setCommission(commissionValue);
  };

  useEffect(() => {
    const totalAmount = loadedData?.purchases.reduce(
      (total, item) => total + item.total,

      0
    );

    setFinalAmount(totalAmount - commission);
  }, [commission, loadedData]);

  const handleDownload = () => {
    const doc = new jsPDF("p", "pt", "a4");

    const elementHTML = document.querySelector("#dokaner-slip");

    doc.html(elementHTML, {
      callback: function (pdf) {
        const totalPages = pdf.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

          const styleElement = document.createElement("style");

          styleElement.innerHTML = ` 

            #dokaner-slip { 

              color: #000000 !important; 

              background-color: #ffffff !important; 

            } 

            #dokaner-slip table { 

              color: #000000 !important; 

            } 

          `;

          document.head.appendChild(styleElement);
        }

        pdf.output("dataurlnewwindow");

        pdf.save("dokaner-slip.pdf");
      },

      x: 10,

      y: 10,

      width: 540, // Adjusted to fit within A4 width with margin

      windowWidth: 595.28,

      windowHeight: 841.89,
    });
  };

  return (
    <div className="container-card-details mt-4">
      <h2 className="my-4 py-2 text-center font-weight-bold">হিসাবের বিবরণ</h2>

      {loadedData && (
        <div className="row mb-2">
          <div className="col-md-5 ml-20">
            <div className="card-body">
              <h5 className="header-title">কৃষকের হিসাব</h5>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>পণ্যের নাম</th>

                    <th>পরিমাণ (কেজি)</th>
                  </tr>
                </thead>

                <tbody>
                  {loadedData.stock.map((item, index) => (
                    <tr key={index}>
                      <td>{item.stockName}</td>

                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-1 d-flex align-items-center justify-content-center">
            <div className="vr"></div> {/* Vertical divider */}
          </div>

          <div className="col-md-6">
            <div className="card-body" id="dokaner-slip">
              <h5 className="header-title">দোকানের হিসাব</h5>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>দোকানের নাম</th>

                    <th>পণ্যের নাম</th>

                    <th>পরিমাণ (কেজি)</th>

                    <th>দাম (টাকা/কেজি)</th>

                    <th>মোট (টাকা)</th>
                  </tr>
                </thead>

                <tbody>
                  {loadedData.purchases.map((item, index) => (
                    <tr key={index}>
                      <td>{item.shopName}</td>

                      <td>{item.stockName}</td>

                      <td>{item.quantity}</td>

                      <td>{item.price}</td>

                      <td>{item.total}</td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan="4" className="text-right font-weight-bold">
                      মোট (টাকা):
                    </td>

                    <td className="font-weight-bold">
                      {loadedData.purchases.reduce(
                        (total, item) => total + item.total,

                        0
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="4" className="text-right font-weight-bold">
                      কমিশন (টাকা):
                    </td>

                    <td className="commission font-weight-bold">
                      <input
                        type="number"
                        value={commission}
                        onChange={handleCommissionChange}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="4" className="text-right font-weight-bold">
                      চূড়ান্ত মোট (টাকা):
                    </td>

                    <td className="font-weight-bold">{finalAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              className="btn btn-primary mt-2 mb-2"
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h2 className="my-4 py-2 text-center font-weight-bold">
          নতুন দোকানের হিসাব যোগ করুন
        </h2>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>দোকানের নাম</th>

              <th>দ্রব্যের নাম</th>

              <th>পরিমাণ (কেজি)</th>

              <th>দাম ( টাকা/কেজি )</th>

              <th></th>
            </tr>
          </thead>

          <tbody>
            {formRows.map((row, index) => (
              <tr key={index}>
                <td>
                  <select
                    className="form-control"
                    name="shopName"
                    value={row.shopName || ""}
                    onChange={(e) => handleShopChange(index, e)}
                  >
                    <option value="">সিলেক্ট দোকান</option>

                    {shops.map((shop, idx) => (
                      <option key={idx} value={shop.shopName}>
                        {shop.shopName}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <select
                    className="form-control"
                    name="stockName"
                    value={row.stockName}
                    onChange={(e) => handleInputChange(index, e)}
                  >
                    <option value="">সিলেক্ট স্টক</option>

                    {loadedData &&
                      loadedData.stock.map((stockItem, idx) => (
                        <option key={idx} value={stockItem.stockName}>
                          {stockItem.stockName}
                        </option>
                      ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={row.price}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>

                <td>
                  {index === formRows.length - 1 && (
                    <button className="btn btn-primary" onClick={handleAddRow}>
                      নতুন সারি
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn1 btn-success mt-3" onClick={handleSave}>
          সেভ করুন
        </button>
      </div>
    </div>
  );
};

export default CardDetail;
