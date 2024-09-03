import React, { useState, useEffect } from "react";
import "./OwnDebtTable.css";
import Loader from "../Loader/Loader";

const OwnDebtTable = () => {
  const [debtHistory, setDebtHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDebtData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/debt/get-own-debt`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch debt data");
      }

      const data = await response.json();
      setDebtHistory(data); // Data should only include entries with status: true
    } catch (error) {
      console.error("Error fetching debt data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtData(); // Fetch data when component mounts
  }, []);

  const handleHideEntry = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/debt/update-status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: false }), // Update status to false
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update entry status");
      }

      // Refetch the updated debt data
      fetchDebtData();
    } catch (error) {
      console.error("Error updating entry status:", error);
    }
  };

  return (
    <div className="own-debt-tables">
      {loading ? (
        <Loader />
      ) : (
        <div className="tables-wrapper">
          <div className="debt-table">
            <h3 className="font-weight-bold">ধার হিসাব</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Bank Name</th>
                  <th>Amount</th>
                  <th>তারিখ</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {debtHistory
                  .filter((entry) => entry.type === "debt") // No need to filter by status, as data is already filtered
                  .map((debt, index) => (
                    <tr key={index}>
                      <td>{debt.bankName}</td>
                      <td>{debt.amount} টাকা</td>
                      <td>{new Date(debt.date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleHideEntry(debt._id)}
                        >
                          Hide
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="debt-table">
            <h3 className="font-weight-bold">পরিশোধ হিসাব</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Bank Name</th>
                  <th>Amount</th>
                  <th>তারিখ</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {debtHistory
                  .filter((entry) => entry.type === "repayment") // No need to filter by status, as data is already filtered
                  .map((repayment, index) => (
                    <tr key={index}>
                      <td>{repayment.bankName}</td>
                      <td>{repayment.amount} টাকা</td>
                      <td>{new Date(repayment.date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleHideEntry(repayment._id)}
                        >
                          Hide
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnDebtTable;
