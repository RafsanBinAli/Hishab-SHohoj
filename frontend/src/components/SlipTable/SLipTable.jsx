import React, { useState, useEffect } from "react";
import "./SlipTable.css";
import Loader from "../Loader/Loader";
import { getCurrentDate } from "../../functions/getCurrentDate";
import MessageModal from "../Modal/MessageModal";
import { fetchShops } from "../../utils/dataService"; 

const SlipTable = () => {
  const [slips, setSlips] = useState([]);
  const [allDokanDetails, setAllDokanDetails] = useState([]);
  const [paidInputs, setPaidInputs] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [noInfo, setNoInfo] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const today = getCurrentDate();
    setSelectedDate(today);

    const fetchAllDokanDetails = async () => {
      const shops = await fetchShops();
      if (shops.length === 0) {
        setModalTitle("Error");
        setModalMessage("Failed to fetch dokan details. Please try again.");
        setModalShow(true);
      } else {
        setAllDokanDetails(shops);
      }
    };

    fetchAllDokanDetails();
  }, []);

  useEffect(() => {
    const fetchSlips = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/slip/${selectedDate}`
        );
        if (response.status === 404) {
          setNoInfo(true);
          setSlips([]);
        } else if (!response.ok) {
          throw new Error("Failed to fetch slips");
        } else {
          const data = await response.json();
          setSlips(data);
          setNoInfo(data.length === 0);
        }
      } catch (error) {
        console.error("Error fetching slips:", error);
        setNoInfo(true);
        setModalTitle("Error");
        setModalMessage("Failed to fetch slips. Please try again.");
        setModalShow(true);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchSlips();
    }
  }, [selectedDate]);

  const handlePaidChange = (event, shopName) => {
    const { value } = event.target;
    const paidValue = Number(value);
    setPaidInputs((prev) => ({
      ...prev,
      [shopName]: isNaN(paidValue) ? 0 : paidValue,
    }));
  };

  const handleSave = async (slip) => {
    if (slip.paidAmount === slip.totalAmount) {
      alert("সকল টাকা পরিশোধ করা হয়েছে");
      return;
    }

    const paidAmount = Number(paidInputs[slip.shopName] || 0);
    if (isNaN(paidAmount) || paidAmount <= 0) {
      setModalTitle("Invalid Input");
      setModalMessage("Please enter a valid payment amount.");
      setModalShow(true);
      return;
    }

    setLoading(true);

    try {
      const updateShopResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/shop/update-totalDue`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shopName: slip.shopName, paidAmount }),
        }
      );
      if (!updateShopResponse.ok)
        throw new Error("Failed to update shop's totalDue");

      const updatePurchaseResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/slip/update-editStatus-paid`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slipId: slip._id, paidAmount, edit: true }),
        }
      );
      if (!updatePurchaseResponse.ok)
        throw new Error("Failed to update slip's remainingTotal");

      const transactionResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/dokan-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shopName: slip.shopName, amount: paidAmount }),
        }
      );
      if (!transactionResponse.ok)
        throw new Error("Error setting dokan payment");

      setModalTitle("Success");
      setModalMessage("Slip & Transaction saved successfully");
      setModalShow(true);
    } catch (error) {
      console.error("Error saving slip:", error);
      setModalTitle("Error");
      setModalMessage("Error saving slip. Please try again.");
      setModalShow(true);
    } finally {
      setLoading(false);
    }
  };

  const getTotalDue = (shopName) => {
    const shop = allDokanDetails.find((dokan) => dokan.shopName === shopName);
    return shop && !isNaN(shop.totalDue) ? shop.totalDue : 0;
  };

  const handleModalConfirm = () => {
    setModalShow(false);
    window.location.reload();
  };

  return (
    <div className="slip-table-container">
      <h2 className="table-title text-center my-4 py-2 font-weight-bold">
        দোকানের আজকের হিসাব
      </h2>
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
      {loading ? (
        <Loader />
      ) : (
        <>
          {noInfo ? (
            <div className="no-info">
              No information available for this date.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>দোকানের নাম</th>
                    <th>আজকের স্লিপের টাকা</th>
                    <th>আগের বাকি টাকা</th>
                    <th>পরিশোধ করতে হবে টাকা</th>
                    <th>আজকের পরিশোধ টাকা</th>
                    <th>পরিশোধ</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {slips.map((slip, index) => (
                    <tr key={index}>
                      <td>{slip.shopName}</td>
                      <td>{slip.totalAmount}</td>
                      <td>{Math.max(0, getTotalDue(slip.shopName) - slip.totalAmount)}</td>
                      <td>{getTotalDue(slip.shopName)}</td>
                      <td>{slip.paidAmount}</td>
                      <td>
                        <input
                          type="number"
                          value={paidInputs[slip.shopName] || ""}
                          onChange={(e) => handlePaidChange(e, slip.shopName)}
                          className="paid-input"
                        />
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
          )}
        </>
      )}
      <MessageModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default SlipTable;
