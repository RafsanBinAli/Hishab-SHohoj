import { useState, useEffect } from "react";
import "./DailyTransaction.css";
import LastCalculation from "./LastCalculation";
import TransactionButton from "./TransactionButtons";
import DailyTransactionTable from "./DailyTransactionTable";
import KhajnaCommissionTable from "./KhajnaCommissionTable";

const DailyTransaction = () => {
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [khajna, setKhajna] = useState(0);
  const [commission, setCommission] = useState(0);

  const dateNow = new Date();
  const normalizedDate = new Date(
    Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()),
  );
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(normalizedDate));

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/transaction/get-daily/${selectedDate}`,
        );
        if (!response.ok) {
          throw new Error("Unable to fetch data");
        }
        const data = await response.json();
        setTransactionDetails(data);
        setKhajna(data.credit?.khajnas || 0);
        setCommission(data.credit?.commissions || 0);
      } catch (error) {
        console.log("Error occurred", error);
      }
    };
    fetchTransactionDetails();
  }, [selectedDate]);

  const isToday = selectedDate === formatDate(normalizedDate);

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setSelectedDate(newDate.toISOString().slice(0, 10));
  };

  return (
    <div className="container-dailyTransaction mt-4">
      <h2 className="text-center my-4 py-2 font-weight-bold">আজকের হিসাব</h2>
      <div className="date-picker-container">
        <button
          className="arrow-button"
          onClick={() => handleDateChange("previous")}
        >
          &#9664;
        </button>
        <label htmlFor="datePicker" className="font-weight-bold">
          তারিখ:
        </label>
        <input
          type="date"
          id="datePicker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />
        <button
          className="arrow-button"
          onClick={() => handleDateChange("next")}
        >
          &#9654;
        </button>
      </div>

      {/* Conditionally render TransactionButton only for today's date */}
      {isToday && (
        <TransactionButton
          transactionDetails={transactionDetails}
          setTransactionDetails={setTransactionDetails}
        />
      )}

      <div className="row mb-4">
        <div className="col-md-6">
          <DailyTransactionTable
            title="আয়"
            data={[
              {
                title: "দৈনিক নগদ জমা",
                transactionData: transactionDetails?.dailyCashStack || [],
              },
              {
                title: "দোকানের জমা",
                transactionData: transactionDetails?.credit?.dokanPayment || [],
              },
              {
                title: "ধার (porishod)",
                transactionData: transactionDetails?.credit?.dharReturns || [],
              },
              {
                title: "নিজের ধার",
                transactionData: transactionDetails?.todayDebt || [],
              },
            ]}
          />
        </div>

        <div className="col-md-6">
          <DailyTransactionTable
            title="ব্যয়"
            data={[
              {
                title: "কৃষকের টাকা(খরচ)",
                transactionData:
                  transactionDetails?.debit?.farmersPayment || [],
              },
              {
                title: "ধার (খরচ)",
                transactionData: transactionDetails?.debit?.dhar || [],
              },
              {
                title: "অন্যান্য (খরচ)",
                transactionData: transactionDetails?.debit?.otherCost || [],
              },
              {
                title: "নিজের ধার পরিশোধ",
                transactionData: transactionDetails?.todayDebtRepay || [],
              },
              {
                title: "Unpaid Deals",
                transactionData:
                  transactionDetails?.debit?.farmersPaymentLater || [],
              },
            ]}
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <KhajnaCommissionTable khajna={khajna} commission={commission} />
        </div>
        <div className="col-md-6">
          <LastCalculation transactionDetails={transactionDetails} />
        </div>
      </div>
    </div>
  );
};

export default DailyTransaction;
