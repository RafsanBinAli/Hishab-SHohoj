import "./LastCalcu.css";
import { useState, useEffect } from "react";

const LastCalculation = ({ transactionDetails }) => {
  const [totalLav, setTotalLav] = useState(null);
  useEffect(() => {
    const netProfit = transactionDetails?.netProfit;
    setTotalLav(netProfit + transactionDetails?.dailyCashStack);
  }, [transactionDetails]);

  return (
    <>
      <div className="calcu-row mb-4">
        <div className="calcu-col-md-6 mx-auto">
          <div className="calcu-card">
            <div className="calcu-card-header text-center font-weight-bold">
              সারাংশ
            </div>
            <div className="calcu-card-body text-center">
            <p className="calcu-font-weight-bold">
                মোট জমা: {transactionDetails?.totalProfit} টাকা
              </p>

              <p className="calcu-font-weight-bold">
                Daily Cash Stack: {transactionDetails?.dailyCashStack} টাকা
              </p>
              <p className="calcu-font-weight-bold">
                মোট খরচ: {transactionDetails?.totalCost} টাকা
              </p>
              
              <p className="calcu-font-weight-bold">মোট লাভ: {totalLav} টাকা</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LastCalculation;
