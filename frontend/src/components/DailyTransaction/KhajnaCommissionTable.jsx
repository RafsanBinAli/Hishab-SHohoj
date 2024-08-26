import React from "react";
import "./DailyTransaction.css"; // Make sure to import the correct CSS file

const KhajnaCommissionTable = ({ khajna, commission }) => {
  // Calculate the total of khajna and commission
  const total = khajna + commission;

  return (
    <div className="khajna-commission-table">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>খাজনা</th>
            <th>কমিশন</th>
            <th>মোট</th> {/* Header for Total column */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{khajna}</td>
            <td>{commission}</td>
            <td>{total}</td> {/* Display total */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default KhajnaCommissionTable;
