import "./LastCalcu.css";

const LastCalculation = ({ transactionDetails, totalIncome, totalExpense }) => {
  return (
    <div className="last-calculation-container">
      <div className="last-calculation-card">
        <div className="last-calculation-header">সারাংশ</div>
        <div className="last-calculation-body">
          <p className="last-calculation-item">
            মোট জমা: {totalIncome - transactionDetails?.dailyCashStack || 0}{" "}
            টাকা
          </p>
          <p className="last-calculation-item">
            Daily Cash Stack: {transactionDetails?.dailyCashStack || 0} টাকা
          </p>
          <p className="last-calculation-item">
            মোট খরচ: {totalExpense || 0} টাকা
          </p>
          <p className="last-calculation-item">
            মোট লাভ: {totalIncome - totalExpense || 0} টাকা
          </p>
        </div>
      </div>
    </div>
  );
};

export default LastCalculation;
