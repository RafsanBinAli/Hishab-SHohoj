import  { useState } from "react";
import "./LastCalcu.css";
import { Link } from "react-router-dom";
import BankButton from "./BankButton";
import MessageModal from "../Modal/MessageModal"; // Import the MessageModal

const TransactionButton = ({ setTransactionDetails }) => {
  const [otherCost, setOtherCost] = useState(0);
  const [otherCostName, setOtherCostName] = useState("");
  const [dailyCashStack, setDailyCashStack] = useState(0);
  const [dailyCashStackName, setDailyCashStackName] = useState("");
  const [modalShow, setModalShow] = useState(false); // State to control modal visibility
  const [modalTitle, setModalTitle] = useState(""); // State for modal title
  const [modalMessage, setModalMessage] = useState(""); // State for modal message

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
            otherCost: [{ name: otherCostName, amount: otherCost }],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Unable to fetch data: ${errorText}`);
      }

      const data = await response.json();
      setTransactionDetails(data.transaction);
      setModalTitle("Success"); // Set success title
      setModalMessage("সফলভাবে সংরক্ষণ হয়েছে!"); // Set success message
      setOtherCost(0);
      setOtherCostName("");
    } catch (error) {
      console.log("Error occurred:", error.message);
      setModalTitle("Error"); // Set error title
      setModalMessage(`Error occurred: ${error.message}`); // Set error message
    } finally {
      setModalShow(true); // Show the modal
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
            dailyCashStackName,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Unable to fetch data: ${errorText}`);
      }
      const data = await response.json();
      setTransactionDetails(data.transaction);
      setModalTitle("Success"); // Set success title
      setModalMessage("সফলভাবে সংরক্ষণ হয়েছে!"); // Set success message
      setDailyCashStack(0);
      setDailyCashStackName("");
    } catch (error) {
      console.log("Error occurred:", error.message);
      setModalTitle("Error"); // Set error title
      setModalMessage(`Error occurred: ${error.message}`); // Set error message
    } finally {
      setModalShow(true); // Show the modal
    }
    console.log("Daily Cash Stack:", dailyCashStack);
  };

  return (
    <>
      <div className="calcu-row mb-4">
        <div className="calcu-col-md-12">
          <div className="calcu-card">
            <div className="calcu-form-group">
              <label className="calcu-daily-cash-stack-label">
                অন্যান্য খরচ এবং খরচের নাম:
              </label>

              <div className="calcu-form-field mr-2">
                <label
                  htmlFor="otherCostName"
                  className="small-label font-weight-bold"
                >
                  খরচের নাম
                </label>
                <input
                  type="text"
                  id="otherCostName"
                  className="calcu-daily-cash-stack-input form-control"
                  value={otherCostName}
                  onChange={(e) => setOtherCostName(e.target.value)}
                />
              </div>
              <div className="calcu-form-field mr-2">
                <label
                  htmlFor="otherCost"
                  className="small-label font-weight-bold"
                >
                  অন্যান্য খরচ
                </label>
                <input
                  type="number"
                  id="otherCost"
                  className="calcu-daily-cash-stack-input form-control"
                  value={otherCost}
                  onChange={(e) => setOtherCost(Number(e.target.value))}
                />
              </div>

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
                className="calcu-daily-cash-stack-input1 form-control"
                value={dailyCashStack}
                onChange={(e) => setDailyCashStack(Number(e.target.value))}
              />
              <button
                type="button"
                className="calcu-daily-cash-stack-submit1 btn btn-primary"
                onClick={handleDailyCashStack}
              >
                সংরক্ষণ করুন
              </button>
            </div>
            <BankButton setTransactionDetails={setTransactionDetails} />
          </div>
        </div>

        <div className="final-hishab-button-container">
          <Link to="/final-hishab">
            <button className="final-hishab-button">Final Hishab</button>
          </Link>
        </div>
      </div>

      {/* MessageModal for success or error messages */}
      <MessageModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => setModalShow(false)}
      />
    </>
  );
};

export default TransactionButton;
