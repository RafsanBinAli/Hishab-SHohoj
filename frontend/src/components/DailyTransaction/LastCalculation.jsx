import "./LastCalcu.css";
import { useState, useEffect } from "react";

const LastCalculation = ({ transactionDetails }) => {
  const [totalLav, setTotalLav] = useState(null);

  useEffect(() => {
    const netProfit = transactionDetails?.netProfit || 0;
    setTotalLav(netProfit + (transactionDetails?.dailyCashStack || 0));
  }, [transactionDetails]);

  return (
    <div className="last-calculation-container">
      <div className="last-calculation-card">
        <div className="last-calculation-header">সারাংশ</div>
        <div className="last-calculation-body">
          <p className="last-calculation-item">
            মোট জমা: {transactionDetails?.totalProfit || 0} টাকা
          </p>
          <p className="last-calculation-item">
            Daily Cash Stack: {transactionDetails?.dailyCashStack || 0} টাকা
          </p>
          <p className="last-calculation-item">
            মোট খরচ: {transactionDetails?.totalCost || 0} টাকা
          </p>
          <p className="last-calculation-item">মোট লাভ: {totalLav || 0} টাকা</p>
        </div>
      </div>
    </div>
  );
};

export default LastCalculation;
