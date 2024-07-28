import React, { useState, useEffect } from "react";
import "./DailyTransaction.css";
import LastCalculation from "./LastCalculation";

const DailyTransaction = () => {
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [onnannoData, setOnnannoData] = useState([
    { name: "চা-নাস্তা", amount: 0 },
    { name: "রিক্সা ভাডা ও অন্যান্য", amount: 0 },
  ]);
  const dummyData = {
    joma: [
      { name: "Rahim", amount: 1000 },
      { name: "Karim", amount: 1200 },
      { name: "Kalam", amount: 1100 },
      { name: "Abu", amount: 1500 },
    ],
    krishokerTk: [
      { name: "abc", amount: 1000 },
      { name: "def", amount: 900 },
      { name: "ghi", amount: 800 },
      { name: "jkl", amount: 700 },
    ],
    dhar: [
      { name: "abc", amount: 500 },
      { name: "def", amount: 400 },
      { name: "ghi", amount: 300 },
    ],
  };

  const calculateTotal = (category) => {
    return dummyData[category].reduce((total, item) => total + item.amount, 0);
  };

  const totalJoma = calculateTotal("joma");
  const totalKrishokerTk = calculateTotal("krishokerTk");
  const totalDhar = calculateTotal("dhar");

  const totalKhoroch = totalKrishokerTk + totalDhar;
  const remainingBalance = totalJoma - totalKhoroch;

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const today = getCurrentDate();
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/transaction/get-daily`
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

  const handleOnnannoAmountChange = (index, event) => {
    const updatedOnnannoData = [...onnannoData];
    updatedOnnannoData[index].amount = parseInt(event.target.value, 10) || 0;
    setOnnannoData(updatedOnnannoData);
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
                          transactionDetails?.credit.dokanPayment.length > 3 ? "scrollable-cell" : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {transactionDetails?.credit.dokanPayment.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>{transactionDetails?.credit?.dokanPayment
                        ? transactionDetails.credit.dokanPayment.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">খাজনা</td>
                    <td colSpan="2">
                      <div>
                        <table className="table table-bordered">
                          <tbody>{transactionDetails?.credit.khajnas}</tbody>
                        </table>
                      </div>
                    </td>
                    <td>{transactionDetails?.credit.khajnas}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">কমিশন</td>
                    <td colSpan="2">
                      <div>
                        <table className="table table-bordered">
                          <tbody>
                            {transactionDetails?.credit.commissions}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>{transactionDetails?.credit.commissions}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">ধার (porishod)</td>
                    <td colSpan="2">
                      <div
                        className={
                          transactionDetails?.cebit?.dharReturns &&
                          transactionDetails.credit.dharReturns.length > 3
                            ? "scrollable-cell"
                            : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {transactionDetails?.credit?.dharReturns &&
                              transactionDetails.credit.dharReturns.map(
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
                        ? transactionDetails.credit.dharReturns.reduce(
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
                          transactionDetails?.debit.farmersPayment.length > 3 ? "scrollable-cell" : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {transactionDetails?.debit.farmersPayment.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>{transactionDetails?.debit?.farmersPayment
                        ? transactionDetails.debit.farmersPayment.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">ধার (খরচ)</td>
                    <td colSpan="2">
                      <div
                        className={
                          transactionDetails?.debit?.dhar &&
                          transactionDetails.debit.dhar.length > 3
                            ? "scrollable-cell"
                            : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {transactionDetails?.debit?.dhar &&
                              transactionDetails.debit.dhar.map(
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
                        ? transactionDetails.debit.dhar.reduce(
                            (total, item) => total + item.amount,
                            0
                          )
                        : 0}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-weight-bold">অন্যান্য (খরচ)</td>
                    <td colSpan="2">
                      <div>
                        <table className="table table-bordered">
                          <tbody>
                            {onnannoData.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>
                                  <input
                                    type="number"
                                    value={item.amount}
                                    onChange={(e) =>
                                      handleOnnannoAmountChange(index, e)
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <LastCalculation
            totalJoma={totalJoma}
            totalKhoroch={totalKhoroch}
            remainingBalance={remainingBalance}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyTransaction;
