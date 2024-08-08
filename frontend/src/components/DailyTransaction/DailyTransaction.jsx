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
        console.log("Error occured", error);
      }
    };
    fetchTransactionDetails();
  }, [selectedDate]);

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
        <div className="col-md-12">
          <div className="card">
            <div className="card-body table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th> হিসাবের ধরণ </th>
                    <th>নাম</th>
                    <th>টাকা</th>
                    <th>মোট</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-weight-bold">দোকানের জমা</td>
                    <td colSpan="2">
                      <div
                        className={
                          transactionDetails?.credit.dokanPayment.length > 3
                            ? "scrollable-cell"
                            : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {transactionDetails?.credit.dokanPayment.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td>{item.name}</td>
                                  <td>{item.amount}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>
                      {transactionDetails?.credit?.dokanPayment
                        ? transactionDetails?.credit.dokanPayment.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-weight-bold">ধার (porishod)</td>
                    <td colSpan="2">
                      <div
                        className={
                          transactionDetails?.cebit?.dharReturns &&
                          transactionDetails?.credit.dharReturns.length > 3
                            ? "scrollable-cell"
                            : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {transactionDetails?.credit?.dharReturns &&
                              transactionDetails?.credit.dharReturns.map(
                                (item, index) => (
                                  <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.amount}</td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>
                      {transactionDetails?.credit?.dharReturns
                        ? transactionDetails?.credit.dharReturns.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">কৃষকের টাকা(খরচ)</td>
                    <td colSpan="2">
                      <div
                        className={
                          transactionDetails?.debit.farmersPayment.length > 3
                            ? "scrollable-cell"
                            : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {transactionDetails?.debit.farmersPayment.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td>{item.name}</td>
                                  <td>{item.amount}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>
                      {transactionDetails?.debit?.farmersPayment
                        ? transactionDetails?.debit.farmersPayment.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">ধার (খরচ)</td>
                    <td colSpan="2">
                      <div
                        className={
                          transactionDetails?.debit?.dhar &&
                          transactionDetails?.debit.dhar.length > 3
                            ? "scrollable-cell"
                            : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {transactionDetails?.debit?.dhar &&
                              transactionDetails?.debit.dhar.map(
                                (item, index) => (
                                  <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.amount}</td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>
                      {transactionDetails?.debit?.dhar
                        ? transactionDetails?.debit.dhar.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-weight-bold">অন্যান্য (খরচ)</td>
                    <td>{transactionDetails?.debit.otherCost} </td>
                  </tr>
                  <tr>
                    <td className="calcu-font-weight-bold">দৈনিক নগদ জমা:</td>
                    <td>{transactionDetails?.dailyCashStack}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <LastCalculation transactionDetails={transactionDetails} />
        </div>
      </div>
    </div>
  );
};

export default DailyTransaction;
