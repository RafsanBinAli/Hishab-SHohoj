import React, { useState, useEffect } from "react";
import "./Borrowed.css";
import BorrowedTable from "./BorrowedTable";

const Borrowed = () => {
  return (
    <div className="borrowed-container">
      <h2 className="borrowed-heading font-weight-bold">কৃষকের ধার</h2>

      <BorrowedTable />
    </div>
  );
};

export default Borrowed;
