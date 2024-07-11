import React from "react";
import "./DailyTransaction.css";

const DailyTransaction = () => {
  const todayData = {
    joma: [
      { name: "abc", amount: 1000 },
      { name: "abc", amount: 1000 },
      { name: "abc", amount: 1000 },
      { name: "abc", amount: 1000 },
    ],
    krishokerTk: [
      { name: "abc", amount: 1000 },
      { name: "abc", amount: 1000 },
      { name: "abc", amount: 1000 },
      { name: "abc", amount: 1000 },
    ],
    dhar: [
      { name: "abc", amount: 1000 },
      { name: "abc", amount: 1000 },
      { name: "abc", amount: 1000 },
    ],
    onnanno: [
      { name: "abc", amount: 1000 },
      { name: "abc", amount: 1000 },
      { name: "abc", amount: 1000 },
    ],
  };

  const calculateTotal = (category) => {
    return todayData[category].reduce((total, item) => total + item.amount, 0);
  };

  const totalJoma = calculateTotal("joma");
  const totalKrishokerTk = calculateTotal("krishokerTk");
  const totalDhar = calculateTotal("dhar");
  const totalOnnanno = calculateTotal("onnanno");
  const grandTotal = totalJoma + totalKrishokerTk + totalDhar + totalOnnanno;

  const totalKhoroch = totalKrishokerTk + totalDhar + totalOnnanno;
  const remainingBalance = totalJoma - totalKhoroch;

  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div className="container-dailyTransaction mt-4">
      <h2 className="text-center my-4 py-2 font-weight-bold">আজকের হিসাব</h2>
      <h4 className="text-center">তারিখ: {today}</h4>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-weight-bold">জমা</td>
                    <td colSpan="2">
                      <div
                        className={
                          todayData.joma.length > 3 ? "scrollable-cell" : ""
                        }
                      >
                        {todayData.joma.map((item, index) => (
                          <div
                            key={index}
                            className="items d-flex justify-content-between"
                          >
                            <span>{item.name}</span>
                            <span>{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>{totalJoma}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">কৃষকের টাকা</td>
                    <td colSpan="2">
                      <div
                        className={
                          todayData.krishokerTk.length > 3
                            ? "scrollable-cell"
                            : ""
                        }
                      >
                        {todayData.krishokerTk.map((item, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between"
                          >
                            <span>{item.name}</span>
                            <span>{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>{totalKrishokerTk}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">ধার</td>
                    <td colSpan="2">
                      <div
                        className={
                          todayData.dhar.length > 3 ? "scrollable-cell" : ""
                        }
                      >
                        {todayData.dhar.map((item, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between"
                          >
                            <span>{item.name}</span>
                            <span>{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>{totalDhar}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">অন্যান্য</td>
                    <td colSpan="2">
                      <div
                        className={
                          todayData.onnanno.length > 3 ? "scrollable-cell" : ""
                        }
                      >
                        {todayData.onnanno.map((item, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between"
                          >
                            <span>{item.name}</span>
                            <span>{item.amount}</span>
                          </div>
                        ))}
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
