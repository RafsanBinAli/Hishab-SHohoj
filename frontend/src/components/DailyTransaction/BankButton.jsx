import { useState, useEffect } from "react";
import { fetchBanks } from "../../utils/dataService";

const BankButton = ({ setTransactionDetails }) => {
  const [myOwnDebtAmount, setMyOwnDebtAmount] = useState(0);
  const [myOwnDebtRepayAmount, setMyOwnDebtRepayAmount] = useState(0);
  const [selectedBankDebt, setSelectedBankDebt] = useState("");
  const [selectedBankRepay, setSelectedBankRepay] = useState("");
  const [bankDetails, setBankDetails] = useState([]);

  useEffect(() => {
    const fetchBankData = async () => {
      const banks = await fetchBanks();
      setBankDetails(banks);
      console.log("Fetched Banks:", banks);
    };

    fetchBankData();
  }, []);

  const handleMyOwnDebtAction = async (event, isRepayment) => {
    event.preventDefault();

    const amount = isRepayment ? myOwnDebtRepayAmount : myOwnDebtAmount;
    const selectedBank = isRepayment ? selectedBankRepay : selectedBankDebt;
    const actionType = isRepayment ? "repayment" : "debt";

    if (!selectedBank || amount <= 0) {
      alert("Please select a bank and enter a valid amount.");
      return;
    }

    try {
      const debtResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/handle-my-own-debt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            type: actionType,
            bank: selectedBank,
          }),
        }
      );

      if (!debtResponse.ok) {
        const errorText = await debtResponse.text();
        throw new Error(`Debt API call failed: ${errorText}`);
      }

      const debtData = await debtResponse.json();

      const bankResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/bank/update-debt/${selectedBank}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            editedBy: "Admin User",
            debtAmount: amount,
            action: isRepayment ? "repayDebt" : "newDebt",
          }),
        }
      );

      if (!bankResponse.ok) {
        const errorText = await bankResponse.text();
        throw new Error(`Bank API call failed: ${errorText}`);
      }

      const bankData = await bankResponse.json();

      setTransactionDetails(debtData.transaction);
      alert("Transaction and bank details saved successfully!");

      setMyOwnDebtAmount(0);
      setMyOwnDebtRepayAmount(0);
      setSelectedBankDebt("");
      setSelectedBankRepay("");
      
    } catch (error) {
      console.log("Error occurred:", error.message);
    }
  };

  return (
    <>
      <div className="calcu-form-group">
        <label htmlFor="myOwnDebt" className="calcu-daily-cash-stack-label">
          নিজের ধার :
        </label>
        <div className="calcu-form-field mr-2">
          <label
            htmlFor="bankNameDebt"
            className="small-label font-weight-bold"
          >
            ব্যাংক নাম
          </label>
          <select
            id="bankNameDebt"
            className="calcu-daily-cash-stack-input form-control"
            value={selectedBankDebt}
            onChange={(e) => setSelectedBankDebt(e.target.value)}
          >
            <option value="">Select Bank</option>
            {bankDetails.map((bank) => (
              <option key={bank.bankName} value={bank.bankName}>
                {bank.bankName}
              </option>
            ))}
          </select>
        </div>
        <div className="calcu-form-field mr-2">
          <label htmlFor="myOwnDebt" className="small-label font-weight-bold">
            টাকা
          </label>
          <input
            type="number"
            id="myOwnDebt"
            className="calcu-daily-cash-stack-input form-control"
            value={myOwnDebtAmount}
            onChange={(e) => setMyOwnDebtAmount(Number(e.target.value))}
          />
        </div>
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
          নিজের ধার পরিশোধ:
        </label>
        <div className="calcu-form-field mr-2">
          <label
            htmlFor="bankNameRepay"
            className="small-label font-weight-bold"
          >
            ব্যাংক নাম
          </label>
          <select
            id="bankNameRepay"
            className="calcu-daily-cash-stack-input form-control"
            value={selectedBankRepay}
            onChange={(e) => setSelectedBankRepay(e.target.value)}
          >
            <option value="">Select Bank</option>
            {bankDetails.map((bank) => (
              <option key={bank.bankName} value={bank.bankName}>
                {bank.bankName}
              </option>
            ))}
          </select>
        </div>
        <div className="calcu-form-field mr-2">
          <label
            htmlFor="myOwnDebtRepay"
            className="small-label font-weight-bold"
          >
            টাকা
          </label>
          <input
            type="number"
            id="myOwnDebtRepay"
            className="calcu-daily-cash-stack-input form-control"
            value={myOwnDebtRepayAmount}
            onChange={(e) => setMyOwnDebtRepayAmount(Number(e.target.value))}
          />
        </div>
        <button
          type="button"
          className="calcu-daily-cash-stack-submit btn btn-primary"
          onClick={(e) => handleMyOwnDebtAction(e, true)}
        >
          সংরক্ষণ করুন
        </button>
      </div>
    </>
  );
};

export default BankButton;
