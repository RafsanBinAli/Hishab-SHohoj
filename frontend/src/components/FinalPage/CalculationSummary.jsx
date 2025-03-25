import  { useState } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import "./FinalPage.css";

const CalculationSummary = ({ startDate1, startDate2 }) => {
  const [showSummary, setShowSummary] = useState(false);
  const [summaryDetails, setSummaryDetails] = useState(null);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleCalculateClick = async () => {
    try {
      const formattedDate1 = formatDate(startDate1);
      const formattedDate2 = formatDate(startDate2);

      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/transaction/calculate?date1=${formattedDate1}&date2=${formattedDate2}`
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
    <>
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
    </>
  );
};

export default CalculationSummary;
