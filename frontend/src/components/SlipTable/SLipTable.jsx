import React, { useState, useEffect } from "react";
import "./SlipTable.css";
import Loader from "../Loader/Loader";
import { getCurrentDate } from "../../functions/getCurrentDate";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MessageModal from "../Modal/MessageModal"; // Import MessageModal

const SlipTable = () => {
  const [slips, setSlips] = useState([]);
  const [allDokanDetails, setAllDokanDetails] = useState([]);
  const [paidInputs, setPaidInputs] = useState({});
  const [savedRows, setSavedRows] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [noInfo, setNoInfo] = useState(false);
  const [modalShow, setModalShow] = useState(false); // State for modal
  const [modalTitle, setModalTitle] = useState(""); // Modal title
  const [modalMessage, setModalMessage] = useState(""); // Modal message
  const [refreshPage, setRefreshPage] = useState(false); // State to trigger page refresh

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const today = getCurrentDate();
    setSelectedDate(today);
    const fetchAllDokanDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-shops`
        );
        if (!response.ok) throw new Error("Failed to fetch dokan details");
        const data = await response.json();
        setAllDokanDetails(data);
      } catch (error) {
        console.log("Error in fetching dokan details:", error);
        setModalTitle("Error");
        setModalMessage("Failed to fetch dokan details. Please try again.");
        setModalShow(true);
        setRefreshPage(true); // Set refresh flag to true for error
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
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch slips");
        const data = await response.json();
        setSlips(data);
        setNoInfo(data.length === 0);
      } catch (error) {
        console.error("Error fetching slips:", error);
        setNoInfo(true);
        setModalTitle("Error");
        setModalMessage("Failed to fetch slips. Please try again.");
        setModalShow(true);
        setRefreshPage(true); // Set refresh flag to true for error
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
    setPaidInputs({ ...paidInputs, [shopName]: paidValue });
  };

  const handleSave = async (slip) => {
    if (slip.paidAmount === slip.totalAmount) {
      alert("সকল টাকা পরিশোধ করা হয়েছে");
      return;
    }
    setLoading(true);
    const paidAmount = paidInputs[slip.shopName] || 0;

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
            totalDue:
              getTotalDue(slip.shopName) - paidAmount > 0
                ? getTotalDue(slip.shopName) - paidAmount
                : 0,
          }),
        }
      );

      if (!updateShopResponse.ok) {
        throw new Error("Failed to update shop's totalDue");
      }

      if (paidAmount > getTotalDue(slip.shopName)) {
        const updatePurchaseResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/slip/update-editStatus-paid`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slipId: slip._id,
              paidAmount: paidAmount - getTotalDue(slip.shopName),
              edit: true,
            }),
          }
        );

        if (!updatePurchaseResponse.ok) {
          throw new Error("Failed to update slip's remainingTotal");
        }
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

      // Show success modal and set a flag to refresh the page
      setModalTitle("Success");
      setModalMessage("Slip & Transaction saved successfully");
      setModalShow(true);
      setRefreshPage(true); // Set refresh flag to true
    } catch (error) {
      console.error("Error saving slip:", error);

      // Show error modal and set a flag to refresh the page
      setModalTitle("Error");
      setModalMessage("Error saving slip. Please try again.");
      setModalShow(true);
      setRefreshPage(true); // Set refresh flag to true
    } finally {
      setLoading(false);
    }
  };

  const getTotalDue = (shopName) => {
    const shop = allDokanDetails.find((dokan) => dokan.shopName === shopName);
    return shop ? shop.totalDue : 0;
  };

  const handleModalConfirm = () => {
    setModalShow(false);
    if (refreshPage) {
      window.location.reload(); // Refresh the page
    }
  };

  return (
    <div className="slip-table-container">
      {loading ? (
        <Loader />
      ) : (
        <>
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
                    <th>আজকের স্লিপের পরিশোধ টাকা</th>
                    <th>আগের বাকি টাকা</th>
                    <th>পরিশোধ করতে হবে টাকা</th>
                    <th>পরিশোধ</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {slips.map((slip, index) => (
                    <tr key={index}>
                      <td>{slip.shopName}</td>
                      <td>{slip.totalAmount}</td>
                      <td>{slip.paidAmount}</td>
                      <td>{getTotalDue(slip.shopName)}</td>
                      <td>
                        {slip.totalAmount +
                          getTotalDue(slip.shopName) -
                          slip.paidAmount}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={paidInputs[slip.shopName] || ""}
                          onChange={(e) =>
                            handlePaidChange(e, slip.shopName, slip.totalAmount)
                          }
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

      {/* Message Modal */}
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
