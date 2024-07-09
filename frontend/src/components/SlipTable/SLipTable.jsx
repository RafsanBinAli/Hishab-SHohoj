import React, { useState, useEffect } from "react";
import "./SlipTable.css"; // Custom CSS for styling, adjust as per your design needs

const SlipTable = () => {
  const [slips, setSlips] = useState([]);
  const [paidInputs, setPaidInputs] = useState({});
  const [savedRows, setSavedRows] = useState({});
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const fetchSlips = async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0];
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/slip/${currentDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch slips");
        }
        const data = await response.json();
        setSlips(data);
      } catch (error) {
        console.error("Error fetching slips:", error);
      }
    };

    fetchSlips();
  }, []);

  const handlePaidChange = (event, shopName, totalAmount) => {
    const { value } = event.target;
    const paidValue = Number(value);
    if (paidValue <= totalAmount) {
      setPaidInputs({ ...paidInputs, [shopName]: paidValue });
    } else {
      alert(`Paid amount cannot be greater than Total Amount (${totalAmount})`);
    }
  };

  const handleSave = async (slip) => {
    setClicked(true);
    const paidAmount = paidInputs[slip.shopName] || 0;
    const due = slip.totalAmount - paidAmount;

    try {
      const updateShopResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/shop/update-totalDue`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shopName: slip.shopName,
            totalDue: due,
          }),
        }
      );

      if (!updateShopResponse.ok) {
        throw new Error("Failed to update shop's totalDue");
      }

      const updatePurchaseResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/slip/update-editStatus-paid`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slipId: slip._id,
            paidAmount,
            edit: true,
          }),
        }
      );

      if (!updatePurchaseResponse.ok) {
        throw new Error("Failed to update slip's remainingTotal");
      }

      alert("Slip saved successfully");

      setSavedRows({ ...savedRows, [slip.shopName]: true });
    } catch (error) {
      console.error("Error saving slip:", error);
    }
  };

  return (
    <div className="slip-table-container">
      <h2 className="table-title font-weight-bold">আজকের স্লিপ</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>দোকানের নাম</th>
              <th>মোট টাকা</th>
              <th>পরিশোধ</th>
              <th>বাকি</th>
              <th>স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            {slips.map((slip, index) => (
              <tr key={index}>
                <td>{slip.shopName}</td>
                <td>{slip.totalAmount}</td>
                <td>
                  {slip.isEdited ? (
                    slip.paidAmount
                  ) : (
                    <input
                      type="number"
                      value={paidInputs[slip.shopName] || ""}
                      onChange={(e) =>
                        handlePaidChange(e, slip.shopName, slip.totalAmount)
                      }
                      className="paid-input"
                      disabled={savedRows[slip.shopName]}
                    />
                  )}
                </td>
                <td>
                  {slip.isEdited
                    ? slip.totalAmount - slip.paidAmount
                    : slip.totalAmount - (paidInputs[slip.shopName] || 0)}
                </td>
                <td>
                  {!savedRows[slip.shopName] && !slip.isEdited && (
                    <button
                      className="save-button"
                      onClick={() => handleSave(slip)}
                    >
                      Save
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SlipTable;
