import React, { useState, useEffect } from "react";
import "./DailyTransaction.css";
import LastCalculation from "./LastCalculation";
import TransactionButton from "./TransactionButtons";

const DailyTransaction = () => {
  const [transactionDetails, setTransactionDetails] = useState(null);
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
      } catch (error) {
        console.log("Error occurred", error);
      }
    };
    fetchTransactionDetails();
  }, [selectedDate]);

  // Calculate totals for each table
  const totalJoma =
    (transactionDetails?.dailyCashStack || 0) +
    (transactionDetails?.credit?.dokanPayment
      ? transactionDetails.credit.dokanPayment.reduce(
          (total, item) => total + item.amount,
          0
        )
      : 0) +
    (transactionDetails?.credit?.dharReturns
      ? transactionDetails.credit.dharReturns.reduce(
          (total, item) => total + item.amount,
          0
        )
      : 0) +
    (transactionDetails?.credit?.ownDebt || 0);

  const totalKhoroch =
    (transactionDetails?.debit?.farmersPayment
      ? transactionDetails.debit.farmersPayment.reduce(
          (total, item) => total + item.amount,
          0
        )
      : 0) +
    (transactionDetails?.debit?.dhar
      ? transactionDetails.debit.dhar.reduce(
          (total, item) => total + item.amount,
          0
        )
      : 0) +
    (transactionDetails?.debit?.otherCost || 0) +
    (transactionDetails?.debit?.ownDebtRepayment || 0);

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
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-3 mt-3 font-weight-bold">জমা</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ধরণ</th>
                    <th>টাকা</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-weight-bold">দৈনিক জমা</td>
                    <td>{transactionDetails?.dailyCashStack || 0}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">দোকানের জমা</td>
                    <td>
                      {transactionDetails?.credit?.dokanPayment
                        ? transactionDetails.credit.dokanPayment.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">ধার (porishod)</td>
                    <td>
                      {transactionDetails?.credit?.dharReturns
                        ? transactionDetails.credit.dharReturns.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">নিজের ধার</td>
                    <td>{transactionDetails?.credit?.ownDebt || 0}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">মোট</td>
                    <td className="font-weight-bold">{totalJoma}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-3 mt-3 font-weight-bold">খরচ</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ধরণ</th>
                    <th>টাকা</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-weight-bold">কৃষকের টাকা</td>
                    <td>
                      {transactionDetails?.debit?.farmersPayment
                        ? transactionDetails.debit.farmersPayment.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">ধার (খরচ)</td>
                    <td>
                      {transactionDetails?.debit?.dhar
                        ? transactionDetails.debit.dhar.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">অন্যান্য </td>
                    <td>{transactionDetails?.debit?.otherCost || 0}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">নিজের ধার পরিশোধ</td>
                    <td>{transactionDetails?.debit?.ownDebtRepayment || 0}</td>
                  </tr>

                  <tr>
                    <td className="font-weight-bold">মোট</td>
                    <td className="font-weight-bold">{totalKhoroch}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <LastCalculation transactionDetails={transactionDetails} />
    </div>
  );
};

export default DailyTransaction;
