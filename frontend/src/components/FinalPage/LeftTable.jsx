import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "./FinalPage.css";

const LeftTable = ({ startDate1 }) => {
  const [transactionDetails1, setTransactionDetails1] = useState({});

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
          }/transaction/get-daily/${formatDate(startDate1)}`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch data");
        }
        const data = await response.json();
        setTransactionDetails1(data);
        console.log("Transaction data:", data);
      } catch (error) {
        console.log("Error occurred:", error);
      }
    };

    fetchTransactionDetails();
  }, [startDate1]);

  return (
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
          <td>{transactionDetails1.totalDebtsOfShops || 0}</td>
        </tr>
        <tr>
          <td>মোট কৃষক ধার</td>
          <td>{transactionDetails1.totalDebtsOfFarmers || 0}</td>
        </tr>
        <tr>
          <td>মোট ক্যাশ</td>
          <td>{transactionDetails1.netProfit || 0}</td>
        </tr>
        <tr>
          <td>নিজের ধার</td>
          <td>{transactionDetails1.totalDebtToShownInFinal || 0}</td>
        </tr>
        <tr>
          <td>Unpaid Deals</td>
          <td>{transactionDetails1.totalUnpaidDealsPrice || 0}</td>
        </tr>
        <tr>
          <td>মোট</td>
          <td>
            {(transactionDetails1.totalDebtsOfShops || 0) +
              (transactionDetails1.totalDebtsOfFarmers || 0) +
              (transactionDetails1.netProfit || 0) +
              (transactionDetails1.totalMyOwnDebt || 0) +
              (transactionDetails1.totalUnpaidDealsPrice || 0)}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default LeftTable;
