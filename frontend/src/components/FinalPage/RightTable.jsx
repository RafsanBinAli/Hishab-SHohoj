import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./FinalPage.css";

const RightTable = ({ startDate2 }) => {
  const [transactionDetails2, setTransactionDetails2] = useState({});

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_BACKEND_URL
          }/transaction/get-daily/${formatDate(startDate2)}`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch data");
        }
        const data = await response.json();
        setTransactionDetails2(data);
        console.log("Transaction data:", data);
      } catch (error) {
        console.log("Error occurred:", error);
      }
    };

    fetchTransactionDetails();
  }, [startDate2]);

  return (
    <>
      <Table striped bordered hover size="sm" className="table-style">
        <thead>
          <tr>
            <th>ধরন</th>
            <th>টাকা</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>মোট দোকান বাকি</td>
            <td>{transactionDetails2.totalDebtsOfShops || 0}</td>
          </tr>
          <tr>
            <td>মোট কৃষক ধার</td>
            <td>{transactionDetails2.totalDebtsOfFarmers || 0}</td>
          </tr>
          <tr>
            <td>মোট ক্যাশ</td>
            <td>{transactionDetails2.netProfit || 0}</td>
          </tr>
          <tr>
            <td>নিজের ধার</td>
            <td>{transactionDetails2.totalMyOwnDebt || 0}</td>
          </tr>
          <tr>
            <td>Unpaid Deals</td>
            <td>{transactionDetails2.totalUnpaidDealsPrice || 0}</td>
          </tr>
          <tr>
            <td>মোট</td>
            <td>
              {(transactionDetails2.totalDebtsOfShops || 0) +
                (transactionDetails2.totalDebtsOfFarmers || 0) +
                (transactionDetails2.netProfit || 0) +
                (transactionDetails2.totalMyOwnDebt || 0) +
                (transactionDetails2.totalUnpaidDealsPrice || 0)}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default RightTable;
