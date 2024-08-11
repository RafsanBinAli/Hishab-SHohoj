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
      setOtherCost(0)
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
      setDailyCashStack(0)
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
      setMyOwnDebtRepayAmount(0)
      console.log("Data updated successfully:", data);
    } catch (error) {
      console.log("Error occurred:", error.message);
    }
  };

  return (
    <>
      <div className="calcu-row mb-4">
        <div className="col-md-12" style={{ width: "50%" }}>
          <div className="mb-3">
            <label htmlFor="otherCost" className="font-weight-bold">
              অন্যান্য খরচ:
            </label>
            <input
              type="number"
              id="otherCost"
              className="calcu-daily-cash-stack-input form-control d-inline-block"
              value={otherCost}
              onChange={(e) => setOtherCost(Number(e.target.value))}
              style={{
                width: "auto",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            />
            <button
              type="button"
              className="calcu-daily-cash-stack-submit btn btn-primary"
              onClick={handleOtherCostSubmit}
            >
              সংরক্ষণ করুন
            </button>
          </div>

          <div className="mb-3">
            <label htmlFor="dailyCashStack" className="font-weight-bold">
              দৈনিক নগদ জমা:
            </label>
            <input
              type="number"
              id="dailyCashStack"
              className="calcu-daily-cash-stack-input form-control d-inline-block"
              value={dailyCashStack}
              onChange={(e) => setDailyCashStack(Number(e.target.value))}
              style={{
                width: "auto",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            />
            <button
              type="button"
              className="calcu-daily-cash-stack-submit btn btn-primary"
              onClick={handleDailyCashStack}
            >
              সংরক্ষণ করুন
            </button>
          </div>

          <div className="mb-3">
            <label htmlFor="myOwnDebtAmount" className="font-weight-bold">
              নিজের ঋণ পরিমাণ:
            </label>
            <input
              type="number"
              id="myOwnDebtAmount"
              className="calcu-daily-cash-stack-input form-control d-inline-block"
              value={myOwnDebtAmount}
              onChange={(e) => setMyOwnDebtAmount(Number(e.target.value))}
              style={{
                width: "auto",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            />
            <button
              type="button"
              className="calcu-daily-cash-stack-submit btn btn-primary"
              onClick={(e) => handleMyOwnDebtAction(e, false)} // For debt submission
            >
              সংরক্ষণ করুন
            </button>
          </div>

          <div className="mb-3">
            <label htmlFor="myOwnDebtRepayAmount" className="font-weight-bold">
              নিজের ঋণ পরিশোধের পরিমাণ:
            </label>
            <input
              type="number"
              id="myOwnDebtRepayAmount"
              className="calcu-daily-cash-stack-input form-control d-inline-block"
              value={myOwnDebtRepayAmount}
              onChange={(e) => setMyOwnDebtRepayAmount(Number(e.target.value))}
              style={{
                width: "auto",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            />
            <button
              type="button"
              className="calcu-daily-cash-stack-submit btn btn-primary"
              onClick={(e) => handleMyOwnDebtAction(e, true)} // For debt repayment
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
        <Link to="/final-hishab" style={{ marginLeft: "auto" }}>
          <button className="btn btn-primary">Final Hishab</button>
        </Link>
      </div>
    </>
  );
};

export default TransactionButton;
