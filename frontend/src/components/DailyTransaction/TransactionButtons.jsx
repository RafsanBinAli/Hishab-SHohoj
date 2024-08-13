import React, { useState } from "react";
import "./LastCalcu.css";
import { Link } from "react-router-dom";

const TransactionButton = ({ transactionDetails, setTransactionDetails }) => {
  const [otherCost, setOtherCost] = useState(0);
  const [dailyCashStack, setDailyCashStack] = useState(0);
  const [myOwnDebtAmount, setMyOwnDebtAmount] = useState(0);
  const [myOwnDebtRepayAmount, setMyOwnDebtRepayAmount] = useState(0);

  const handleOtherCostSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/update-other-cost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otherCost,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Unable to fetch data: ${errorText}`);
      }

      const data = await response.json();
      setTransactionDetails(data.transaction);
      alert("Saved Successfully!");
      setOtherCost(0);
      console.log("Data updated successfully:", data);
    } catch (error) {
      console.log("Error occurred:", error.message);
    }
  };

  const handleDailyCashStack = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/update-daily-cash-stack`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dailyCashStack,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Unable to fetch data: ${errorText}`);
      }
      const data = await response.json();
      setTransactionDetails(data.transaction);
      alert("Saved Successfully!");
      setDailyCashStack(0);
      console.log("Data updated successfully:", data);
    } catch (error) {
      console.log("Error occurred:", error.message);
    }
    console.log("Daily Cash Stack:", dailyCashStack);
  };

  const handleMyOwnDebtAction = async (event, isRepayment) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/handle-my-own-debt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: isRepayment ? myOwnDebtRepayAmount : myOwnDebtAmount,
            type: isRepayment ? "repayment" : "debt",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Unable to fetch data: ${errorText}`);
      }

      const data = await response.json();
      setTransactionDetails(data.transaction);
      alert("Saved Successfully!");
      setMyOwnDebtAmount(0);
      setMyOwnDebtRepayAmount(0);
      console.log("Data updated successfully:", data);
    } catch (error) {
      console.log("Error occurred:", error.message);
    }
  };

  return (
    <>
      <div className="calcu-row mb-4">
        <div className="calcu-col-md-8">
          <div className="calcu-card">
            <div className="calcu-form-group">
              <label
                htmlFor="otherCost"
                className="calcu-daily-cash-stack-label"
              >
                অন্যান্য খরচ:
              </label>
              <input
                type="number"
                id="otherCost"
                className="calcu-daily-cash-stack-input form-control"
                value={otherCost}
                onChange={(e) => setOtherCost(Number(e.target.value))}
              />
              <button
                type="button"
                className="calcu-daily-cash-stack-submit btn btn-primary"
                onClick={handleOtherCostSubmit}
              >
                সংরক্ষণ করুন
              </button>
            </div>

            <div className="calcu-form-group">
              <label
                htmlFor="dailyCashStack"
                className="calcu-daily-cash-stack-label"
              >
                দৈনিক নগদ জমা:
              </label>
              <input
                type="number"
                id="dailyCashStack"
                className="calcu-daily-cash-stack-input form-control"
                value={dailyCashStack}
                onChange={(e) => setDailyCashStack(Number(e.target.value))}
              />
              <button
                type="button"
                className="calcu-daily-cash-stack-submit btn btn-primary"
                onClick={handleDailyCashStack}
              >
                সংরক্ষণ করুন
              </button>
            </div>

            <div className="calcu-form-group">
              <label
                htmlFor="myOwnDebt"
                className="calcu-daily-cash-stack-label"
              >
                নিজের ঋণ পরিমাণ:
              </label>
              <input
                type="number"
                id="myOwnDebt"
                className="calcu-daily-cash-stack-input form-control"
                value={myOwnDebtAmount}
                onChange={(e) => setMyOwnDebtAmount(Number(e.target.value))}
              />
              <button
                type="button"
                className="calcu-daily-cash-stack-submit btn btn-primary"
                onClick={(e) => handleMyOwnDebtAction(e, false)}
              >
                সংরক্ষণ করুন
              </button>
            </div>

            <div className="calcu-form-group">
              <label
                htmlFor="myOwnDebtRepay"
                className="calcu-daily-cash-stack-label"
              >
                নিজের ঋণ পরিশোধের পরিমাণ:
              </label>
              <input
                type="number"
                id="myOwnDebtRepay"
                className="calcu-daily-cash-stack-input form-control"
                value={myOwnDebtRepayAmount}
                onChange={(e) =>
                  setMyOwnDebtRepayAmount(Number(e.target.value))
                }
              />
              <button
                type="button"
                className="calcu-daily-cash-stack-submit btn btn-primary"
                onClick={(e) => handleMyOwnDebtAction(e, true)}
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>

        <div className="final-hishab-button-container">
          <Link to="/final-hishab">
            <button className="final-hishab-button">Final Hishab</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default TransactionButton;
