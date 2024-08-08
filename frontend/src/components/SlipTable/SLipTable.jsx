import React, { useState, useEffect } from "react";
import "./SlipTable.css"; // Custom CSS for styling, adjust as per your design needs
import Loader from "../Loader/Loader";

const SlipTable = () => {
  const [slips, setSlips] = useState([]);
  const [paidInputs, setPaidInputs] = useState({});
  const [savedRows, setSavedRows] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const today = getCurrentDate();
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    const fetchSlips = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/slip/${selectedDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch slips");
        }
        const data = await response.json();
        setSlips(data);
      } catch (error) {
        console.error("Error fetching slips:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchSlips();
    }
  }, [selectedDate]);

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
    setLoading(true);
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

      const transactionResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/dokan-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shopName: slip.shopName,
            amount: paidAmount,
          }),
        }
      );

      if (!transactionResponse.ok) {
        throw new Error("Error setting dokan payment");
      }

      alert("Slip & Transaction saved successfully");
      setSavedRows({ ...savedRows, [slip.shopName]: true });
    } catch (error) {
      console.error("Error saving slip:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slip-table-container">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className="table-title font-weight-bold">দোকানের আজকের হিসাব</h2>
          <div className="text-center mb-4">
            <label htmlFor="datePicker" className="font-weight-bold">
              তারিখ:
            </label>
            <input
              type="date"
              id="datePicker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="ml-2"
            />
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>দোকানের নাম</th>
                  <th>ajker sliper টাকা</th>
                  <th>ager baki টাকা</th>
                  <th>mot paoana tk</th>
                  <th>porishod tk</th>
                  <th>ekhon porishod</th>
                  <th>baki tk</th>
                  <th> Status</th>
                </tr>
              </thead>
              <tbody>
                {slips.map((slip, index) => (
                  <tr key={index}>
                    <td>{slip.shopName}</td>
                    <td>{slip.totalAmount}</td>
                    <td> {slip.totalAmount}</td>
                    <td>
                      {slip.totalAmount + slip.totalAmount}
                    </td>
                    <td>
                      { slip.paidAmount}
                    </td>
                    <td>
                      
                        <input
                          type="number"
                          value={paidInputs[slip.shopName] || ""}
                          onChange={(e) =>
                            handlePaidChange(e, slip.shopName, slip.totalAmount)
                          }
                          className="paid-input"
                          disabled={savedRows[slip.shopName]}
                        />
                      
                    </td>
                    <td>
                      {slip.isEdited
                        ? slip.totalAmount - slip.paidAmount
                        : slip.totalAmount - (paidInputs[slip.shopName] || 0)}
                    </td>
                    <td>
                     
                        <button
                          className="save-button"
                          onClick={() => handleSave(slip)}
                        >
                          সেভ করুন
                        </button>
                     
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SlipTable;
