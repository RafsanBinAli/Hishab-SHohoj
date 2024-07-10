import React from "react";
import "./DailyTransaction.css";

const DailyTransaction = () => {
  const todayData = {
    receivedFromShops: [
      { shopName: "Shop A", amount: 1500 },
      { shopName: "Shop B", amount: 2000 },
    ],
    givenToFarmers: [
      { farmerName: "Farmer X", amount: 1200 },
      { farmerName: "Farmer Y", amount: 1800 },
    ],
    borrowGiven: [
      { name: "Person A", amount: 500 },
      { name: "Person B", amount: 700 },
    ],
    dailyExpenses: [
      { description: "Transport", amount: 300 },
      { description: "Miscellaneous", amount: 400 },
    ],
  };

  const totalReceived = todayData.receivedFromShops.reduce(
    (total, item) => total + item.amount,
    0
  );

  const totalGivenToFarmers = todayData.givenToFarmers.reduce(
    (total, item) => total + item.amount,
    0
  );

  const totalBorrowGiven = todayData.borrowGiven.reduce(
    (total, item) => total + item.amount,
    0
  );

  const totalDailyExpenses = todayData.dailyExpenses.reduce(
    (total, item) => total + item.amount,
    0
  );

  const totalReceivedToday = totalReceived;
  const totalGivenToday =
    totalGivenToFarmers + totalBorrowGiven + totalDailyExpenses;

  // Get today's date
  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div className="container mt-4">
      <h2 className="text-center my-4 py-2 font-weight-bold">আজকের হিসাব</h2>
      <h4 className="text-center">তারিখ:{today}</h4>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center font-weight-bold">জমা</div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>দোকানের নাম</th>
                    <th>পরিমাণ (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {todayData.receivedFromShops.map((item, index) => (
                    <tr key={index}>
                      <td>{item.shopName}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>মোট (৳)</th>
                    <th>{totalReceived}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center font-weight-bold">
              কৃষকের খরচ
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>কৃষকের নাম</th>
                    <th>পরিমাণ (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {todayData.givenToFarmers.map((item, index) => (
                    <tr key={index}>
                      <td>{item.farmerName}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>মোট (৳)</th>
                    <th>{totalGivenToFarmers}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center font-weight-bold">ধার</div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>নাম</th>
                    <th>পরিমাণ (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {todayData.borrowGiven.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>মোট (৳)</th>
                    <th>{totalBorrowGiven}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center font-weight-bold">
              অন্যান্য খরচ
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ধরণ </th>
                    <th>পরিমাণ (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {todayData.dailyExpenses.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>মোট (৳)</th>
                    <th>{totalDailyExpenses}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-header text-center font-weight-bold">
              Summary
            </div>
            <div className="card-body text-center">
              <p className="font-weight-bold">
                আজকের জমা : {totalReceivedToday} ৳
              </p>
              <p className="font-weight-bold">
                আজকের খরচ : {totalGivenToday} ৳
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTransaction;
