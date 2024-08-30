import React, { useState, useEffect } from "react";
import "./OwnDebtTable.css"; // Create and style this CSS file
import Loader from "../Loader/Loader"; // Import the Loader component

const OwnDebtTable = () => {
  const [debtHistory, setDebtHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        console.log(data);
        setDebtHistory(data);
      } catch (error) {
        console.error("Error fetching debt data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDebtData();
  }, []);

  return (
    <div className="own-debt-tables">
      {loading ? (
        <Loader />
      ) : (
        <div className="tables-wrapper">
          {/* Table for Debt Taken */}
          <div className="debt-table">
            <h3>ধার হিসাব
            </h3>
            <table className="table">
              <thead>
                <tr>
                <th>Bank Name</th>
                  <th>Amount</th>
                  <th>তারিখ</th>
                </tr>
              </thead>
              <tbody>
                {debtHistory
                  .filter((entry) => entry.type === "debt")
                  .map((debt, index) => (
                    <tr key={index}>
                      <td>{debt.bankName}</td>
                      <td>{debt.amount} টাকা</td>
                      <td>{new Date(debt.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
  
          {/* Table for Repayment */}
          <div className="debt-table">
            <h3>পরিশোধ হিসাব
            </h3>
            <table className="table">
              <thead>
                <tr>
                <th>Bank Name</th>
                  <th>Amount</th>
                  <th>তারিখ</th>
                </tr>
              </thead>
              <tbody>
                {debtHistory
                  .filter((entry) => entry.type === "repayment")
                  .map((repayment, index) => (
                    <tr key={index}>
                      <td> {repayment.bankName}</td>
                      <td>{repayment.amount} টাকা</td>
                      <td>{new Date(repayment.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}  

export default OwnDebtTable;
