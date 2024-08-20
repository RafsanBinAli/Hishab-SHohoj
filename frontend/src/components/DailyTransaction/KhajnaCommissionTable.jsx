import React from "react";
import "./DailyTransaction"; // Create this CSS file for styling

const KhajnaCommissionTable = ({ khajna, commission }) => {
  return (
    <div className="khajna-commission-table">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>খাজনা</th>
            <th>কমিশন</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{khajna}</td>
            <td>{commission}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default KhajnaCommissionTable;
