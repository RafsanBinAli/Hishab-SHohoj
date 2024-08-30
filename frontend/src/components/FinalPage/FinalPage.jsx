import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./FinalPage.css";

const FinalPage = () => {
  const [startDate1, setStartDate1] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [transactionDetails1, setTransactionDetails1] = useState({});
  const [transactionDetails2, setTransactionDetails2] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [summaryDetails, setSummaryDetails] = useState(null);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchTransactionDetails = async (
      selectedDate,
      setTransactionDetails
    ) => {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_BACKEND_URL
          }/transaction/get-daily/${formatDate(selectedDate)}`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch data");
        }
        const data = await response.json();
        setTransactionDetails(data);
        console.log("Transaction data:", data);
      } catch (error) {
        console.log("Error occurred:", error);
      }
    };

    fetchTransactionDetails(startDate1, setTransactionDetails1);
    fetchTransactionDetails(startDate2, setTransactionDetails2);
    setShowSummary(false);
  }, [startDate1, startDate2]);

  const handleCalculateClick = async () => {
    try {
      const formattedDate1 = formatDate(startDate1);
      const formattedDate2 = formatDate(startDate2);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/calculate?date1=${formattedDate1}&date2=${formattedDate2}`
      );
      if (!response.ok) {
        throw new Error("Unable to fetch data");
      }
      const data = await response.json();

      setSummaryDetails(data);

      setShowSummary(true);
    } catch (error) {
      console.log("Error occurred:", error);
    }
  };

  return (
    <Container fluid className="final-page-container">
      <Row className="mt-3">
        <Col xs={12} md={6}>
          <div className="date-picker-wrapper">
            <label htmlFor="startDate1" className="date-label">
              তারিখ ১:
            </label>
            <input
              type="date"
              id="startDate1"
              value={formatDate(startDate1)}
              onChange={(e) => setStartDate1(new Date(e.target.value))}
              className="date-input ml-2"
            />
          </div>
          <Table striped bordered hover size="sm" className="table-style">
            <thead>
              <tr>
                <th>ধরন</th>
                <th>টাকা</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>মোট Dokan বাকি</td>
                <td>{transactionDetails1.totalDebtsOfShops || 0}</td>
              </tr>
              <tr>
                <td>মোট Farmer ধার</td>
                <td>{transactionDetails1.totalDebtsOfFarmers || 0}</td>
              </tr>
              <tr>
                <td>মোট ক্যাশ</td>
                <td>{transactionDetails1.netProfit || 0}</td>
              </tr>
              <tr>
                <td>নিজের ধার</td>
                <td>{transactionDetails1.totalMyOwnDebt || 0}</td>
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
        </Col>

        <Col xs={12} md={6}>
          <div className="date-picker-wrapper">
            <label htmlFor="startDate2" className="date-label">
              তারিখ ২:
            </label>
            <input
              type="date"
              id="startDate2"
              value={formatDate(startDate2)}
              onChange={(e) => setStartDate2(new Date(e.target.value))}
              className="date-input ml-2"
            />
          </div>
          <Table striped bordered hover size="sm" className="table-style">
            <thead>
              <tr>
                <th>ধরন</th>
                <th>টাকা</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>মোট Dokan বাকি</td>
                <td>{transactionDetails2.totalDebtsOfShops || 0}</td>
              </tr>
              <tr>
                <td>মোট Farmer ধার</td>
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
        </Col>
      </Row>

      <Row className="mt-3 justify-content-center">
        <Button
          variant="primary"
          onClick={handleCalculateClick}
          className="mb-3"
        >
          Calculate
        </Button>
      </Row>

      {showSummary && (
        <Row className="mt-3 justify-content-center">
          <Col lg={8} className="text-center">
            <h5 className="summary-title font-weight-bold">
              সারসংক্ষেপ ({formatDate(startDate1)} থেকে {formatDate(startDate2)}
              )
            </h5>
            <Table
              striped
              bordered
              hover
              size="sm"
              className="table-style mx-auto"
            >
              <thead>
                <tr>
                  <th>ধরন</th>
                  <th>টাকা</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>কমিশন ও খাজনা</td>
                  <td>
                    {(summaryDetails.totalCommission || 0) +
                      (summaryDetails.totalKhajna || 0)}
                  </td>
                </tr>
                <tr>
                  <td>নিজের খরচ</td>
                  <td>{summaryDetails.totalOtherCost || 0}</td>
                </tr>
                <tr>
                  <td>Minus Result</td>
                  <td className="font-weight-bold">
                    {(summaryDetails.totalCommission || 0) +
                      (summaryDetails.totalKhajna || 0) -
                      (summaryDetails.totalOtherCost || 0)}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FinalPage;
