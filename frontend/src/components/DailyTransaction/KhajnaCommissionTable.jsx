import React from "react";
import "./DailyTransaction.css"; 

const KhajnaCommissionTable = ({ khajna, commission }) => {
 
  const total = khajna + commission;

  return (
    <div className="khajna-commission-table">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>খাজনা</th>
            <th>কমিশন</th>
            <th>মোট</th> 
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{khajna}</td>
            <td>{commission}</td>
            <td>{total}</td> 
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default KhajnaCommissionTable;
