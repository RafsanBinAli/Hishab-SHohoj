import React, { useState, useEffect } from "react";
import "./DailyTransaction.css";
import LastCalculation from "./LastCalculation";
import TransactionButton from "./TransactionButtons";
import DailyTransactionTable from "./DailyTransactionTable";

const DailyTransaction = () => {
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [totalDifference, setTotalDifference] = useState(0); // State to store the difference

  const dateNow = new Date();
  const normalizedDate = new Date(
    Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
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
          `${process.env.REACT_APP_BACKEND_URL}/transaction/get-daily/${selectedDate}`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch data");
        }
        const data = await response.json();
        setTransactionDetails(data);
        console.log("transaction data", data);

        // Calculate the difference between total income and total expense
        const totalIncome = calculateTotalIncome(data);
        const totalExpense = calculateTotalExpense(data);
        console.log("total income", totalIncome);
        console.log("total expense", totalExpense);
        setTotalDifference(totalIncome - totalExpense);
      } catch (error) {
        console.log("Error occurred", error);
      }
    };
    fetchTransactionDetails();
  }, [selectedDate]);

  const calculateTotalIncome = (data) => {
    return [
      data?.dailyCashStack || 0,
      data?.credit?.dokanPayment || [],
      data?.credit?.dharReturns || [],
      data?.todayDebt || 0,
    ].reduce((total, section) => {
      if (Array.isArray(section)) {
        return total + section.reduce((sum, item) => sum + item.amount, 0);
      } else if (typeof section === "number") {
        return total + section;
      }
      return total;
    }, 0);
  };

  const calculateTotalExpense = (data) => {
    return [
      data?.debit?.farmersPayment || [],
      data?.debit?.dhar || [],
      data?.debit?.otherCost || [],
      data?.todayDebtRepay || [],
    ].reduce((total, section) => {
      if (Array.isArray(section)) {
        return total + section.reduce((sum, item) => sum + item.amount, 0);
      } else if (typeof section === "number") {
        return total + section;
      }
      return total;
    }, 0);
  };

  return (
    <div className="container-dailyTransaction mt-4">
      <h2 className="text-center my-4 py-2 font-weight-bold">আজকের হিসাব</h2>
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
      <TransactionButton
        transactionDetails={transactionDetails}
        setTransactionDetails={setTransactionDetails}
      />

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
                title: "নিজের ঋণ",
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
                title: "নিজের ঋণ পরিশোধ",
                transactionData: transactionDetails?.todayDebtRepay || [],
              },
            ]}
          />
        </div>
      </div>

      {/* Add a new section to display the total difference */}
      <div className="text-center mb-4">
        <label htmlFor="totalDifference" className="font-weight-bold">
          আয় - ব্যয় এর ফলাফল:
        </label>
        <input
          type="text"
          id="totalDifference"
          value={totalDifference}
          readOnly
          className="ml-2"
        />
      </div>

      <LastCalculation transactionDetails={transactionDetails} />
    </div>
  );
};

export default DailyTransaction;
