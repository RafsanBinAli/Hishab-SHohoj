import React, { useState } from "react";
import "./Borrowed.css";

const BorrowedTable = ({
  filteredFarmersList,
  searchTerm,
  handleSearch,
  handleEditClick,
}) => {
  return (
    <div>
      <h2 className="card-title mb-4">দোকানের লিস্ট </h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="কৃষকের নাম দিয়ে সার্চ করুন"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="table-responsive">
        <table className="borrowed-table">
          <thead>
            <tr>
              <th>কৃষকের নাম</th>
              <th>মোট ধার</th>
              <th>টাকা প্রদান</th>
              <th>বাকী টাকা</th>
              <th>Updated By</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmersList.map((farmer) => (
              <tr key={farmer.id}>
                <td>{farmer.name}</td>
                <td>{farmer.totalDue}</td>
                <td>{farmer.totalPaid}</td>
                <td>{farmer.totalDue - farmer.totalPaid}</td>
                <td>abc</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditClick(farmer)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowedTable;
