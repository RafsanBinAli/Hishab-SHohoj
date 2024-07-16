import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CardDetail.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import banglaFont from "../../font/Nikosh.ttf"; // Replace with your font file path

const CardDetail = () => {
  const { id } = useParams(); // Assuming id is passed as a URL parameter

  const [loadedData, setLoadedData] = useState(null);

  const [shops, setShops] = useState([]);

  const [formRows, setFormRows] = useState([
    { shopName: "", stockName: "", quantity: "", price: "" },
  ]);

  const [commission, setCommission] = useState(0);

  const [finalAmount, setFinalAmount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      const newPurchases = formRows.map((row) => ({
        farmerName: loadedData?.farmerName,
        shopName: row.shopName,
        stockName: row.stockName,
        quantity: row.quantity,
        price: row.price,
        total: row.quantity * row.price,
      }));

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

      const slipsMap = new Map(); // Use Map instead of Set

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
                body: JSON.stringify({ shopName: purchase.shopName }),
              }
            );
            if (!response.ok) {
              throw new Error(
                `Failed to find or create slip for ${purchase.shopName}`
              );
            }
            const slip = await response.json();

            // Add to slipsMap using _id as key and shopName as value
            slipsMap.set(slip._id, slip.shopName);
            console.log("Slip added to map:", slip._id, slip.shopName);
          } catch (error) {
            console.error(
              `Error finding or creating slip for ${purchase.shopName}:`,
              error
            );
            throw error;
          }
        })
      );

      // Step 4: Update slips with new purchases
      const updateSlipResponses = await Promise.all(
        Array.from(slipsMap.keys()).map(async (_id) => {
          try {
            const shopName = slipsMap.get(_id);
            const purchasesToUpdate = newPurchases.filter(
              (p) => p.shopName === shopName
            );
            const totalAmountToUpdate = purchasesToUpdate.reduce(
              (total, p) => total + p.total,
              0
            );

            const updateSlipResponse = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/slip/update/${_id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  shopName,
                  purchases: purchasesToUpdate,
                  totalAmount: totalAmountToUpdate,
                }),
              }
            );
            if (!updateSlipResponse.ok) {
              throw new Error(`Failed to update slip ${_id}`);
            }
            console.log(
              `Slip ${_id} updated successfully with purchases:`,
              purchasesToUpdate
            );
          } catch (error) {
            console.error(`Error updating slip ${_id}:`, error);
            throw error;
          }
        })
      );

      alert("সকল স্লিপ আপডেট সম্পূর্ন হয়েছে !!");
    } catch (error) {
      console.error("Error in handleSave:", error);
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
    doc.text(`কৃষকের নাম: ${loadedData.farmerName}`, 14, 30);
    doc.text(`তারিখ: ${format(selectedDate, "dd MMMM, yyyy")}`, 14, 40);

    // Table headers
    const tableColumn = [
      { header: "দোকানের নাম", dataKey: "Name" },
      { header: "পণ্যের নাম", dataKey: "stockName" },
      { header: "পরিমাণ (কেজি)", dataKey: "quantity" },
      { header: "দাম (টাকা/কেজি)", dataKey: "price" },
      { header: "মোট টাকা", dataKey: "totalAmount" },
    ];

    // Table rows
    const tableRows = loadedData.purchases.map((purchase) => ({
      shopName: purchase.shopName,
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

    doc.save("farmers-slip.pdf");
  };

  return (
    <div className="container-card-details mt-4">
      <h2 className="my-4 py-2 text-center font-weight-bold">হিসাবের বিবরণ</h2>

      {loadedData && (
        <div className="row mb-2">
          <div className="col-md-4 ml-10">
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

          <div className="col-1 d-flex align-items-center justify-content-center">
            <div className="vr"></div> {/* Vertical divider */}
          </div>

          <div className="col-md-7">
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
                      Khajna(টাকা):
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
              পিডিএফ ডাউনলোড করুন
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
