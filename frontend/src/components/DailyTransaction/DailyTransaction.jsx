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
  const [isLoading, setIsLoading] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);

  // Get current date in Bangladesh timezone
  const getBangladeshDate = () => {
    const now = new Date();
    const options = { timeZone: 'Asia/Dhaka' };
    // Format the date in Bangladesh timezone
    return new Date(now.toLocaleString('en-US', options));
  };

  const dateNow = getBangladeshDate();
  const normalizedDate = new Date(
    Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
  );

  const formatDate = (date) => {
    // Ensure we're working with the Bangladesh date
    const options = { timeZone: 'Asia/Dhaka' };
    const bdDate = new Date(date.toLocaleString('en-US', options));
    
    const year = bdDate.getFullYear();
    const month = String(bdDate.getMonth() + 1).padStart(2, "0");
    const day = String(bdDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(normalizedDate));

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      setIsLoading(true);
      setNoDataFound(false);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/transaction/get-daily/${selectedDate}`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch data");
        }
        const data = await response.json();
        
        // Check if there's no meaningful transaction data
        const hasData = data && 
          (data.credit || 
           data.debit || 
           (data.dailyCashStack && data.dailyCashStack.length > 0) ||
           (data.todayDebt && data.todayDebt.length > 0) ||
           (data.todayDebtRepay && data.todayDebtRepay.length > 0) ||
           (data.unpaidDeals && data.unpaidDeals.length > 0));
        
        if (!hasData) {
          setNoDataFound(true);
          setTransactionDetails(null);
        } else {
          setTransactionDetails(data);
          setKhajna(data.credit?.khajnas || 0);
          setCommission(data.credit?.commissions || 0);
          setNoDataFound(false);
        }
      } catch (error) {
        console.log("Error occurred", error);
        setNoDataFound(true);
        setTransactionDetails(null);
      } finally {
        setIsLoading(false);
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
        <button
          className="arrow-button"
          onClick={() => handleDateChange("next")}
          disabled={isLoading}
        >
          &#9654;
        </button>
      </div>

      {/* Conditionally render TransactionButton only for today's date */}
      {isToday && !isLoading && !noDataFound && (
        <TransactionButton
          transactionDetails={transactionDetails}
          setTransactionDetails={setTransactionDetails}
        />
      )}

      {isLoading && (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">লোড হচ্ছে...</span>
          </div>
          <p className="mt-3">হিসাব লোড হচ্ছে...</p>
        </div>
      )}

      {noDataFound && !isLoading && (
        <div className="alert alert-info text-center my-5">
          <h4>এই তারিখে কোন হিসাব তৈরি করা হয়নি</h4>
          {isToday && (
            <p className="mt-3">আজকের হিসাব তৈরি করতে নতুন লেনদেন যোগ করুন</p>
          )}
        </div>
      )}

      {!isLoading && !noDataFound && (
        <>
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
                      transactionDetails?.unpaidDeals || [],
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
        </>
      )}
    </div>
  );
};

export default DailyTransaction;