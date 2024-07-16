import React, { useState, useEffect } from "react";
import "./DailyTransaction.css";

const DailyTransaction = () => {
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
    onnanno: [
      { name: "Cha", amount: 200 },
      { name: "Rickshaw", amount: 150 },
      { name: "Pani", amount: 100 },
    ],
  };

  const calculateTotal = (category) => {
    return dummyData[category].reduce((total, item) => total + item.amount, 0);
  };

  const totalJoma = calculateTotal("joma");
  const totalKrishokerTk = calculateTotal("krishokerTk");
  const totalDhar = calculateTotal("dhar");
  const totalOnnanno = calculateTotal("onnanno");
  const totalKhoroch = totalKrishokerTk + totalDhar + totalOnnanno;
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
                    <td className="font-weight-bold">জমা</td>
                    <td colSpan="2">
                      <div
                        className={
                          dummyData.joma.length > 3 ? "scrollable-cell" : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {dummyData.joma.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>{totalJoma}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">কৃষকের টাকা(খরচ)</td>
                    <td colSpan="2">
                      <div
                        className={
                          dummyData.krishokerTk.length > 3
                            ? "scrollable-cell"
                            : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {dummyData.krishokerTk.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>{totalKrishokerTk}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">ধার (খরচ)</td>
                    <td colSpan="2">
                      <div
                        className={
                          dummyData.dhar.length > 3 ? "scrollable-cell" : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {dummyData.dhar.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>{totalDhar}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">অন্যান্য (খরচ)</td>
                    <td colSpan="2">
                      <div
                        className={
                          dummyData.onnanno.length > 3 ? "scrollable-cell" : ""
                        }
                      >
                        <table className="table table-bordered">
                          <tbody>
                            {dummyData.onnanno.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td>{totalOnnanno}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-6 mx-auto">
              <div className="card">
                <div className="card-header text-center font-weight-bold">
                  সারাংশ
                </div>
                <div className="card-body text-center">
                  <p className="font-weight-bold">
                    মোট খরচ: {totalKhoroch} টাকা
                  </p>
                  <p className="font-weight-bold">মোট জমা: {totalJoma} টাকা</p>
                  <p className="font-weight-bold">
                    বাকি টাকা: {remainingBalance} টাকা
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTransaction;
