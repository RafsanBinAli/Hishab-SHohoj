import "./LastCalcu.css";

const LastCalculation = ({ transactionDetails }) => {
  return (
    <div className="last-calculation-container">
      <div className="last-calculation-card">
        <div className="last-calculation-header">সারাংশ</div>
        <div className="last-calculation-body">
          <p className="last-calculation-item">
            মোট জমা: {transactionDetails?.totalProfit || 0}
            টাকা
          </p>
         
          <p className="last-calculation-item">
            মোট খরচ: {transactionDetails?.totalCost  || 0} টাকা
          </p>
          <p className="last-calculation-item">
          অবশিষ্ট : {transactionDetails?.netProfit || 0} টাকা
          </p>
        </div>
      </div>
    </div>
  );
};

export default LastCalculation;
