import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./FinalPage.css";

// Extended dummy data for different date ranges
const dummyData = {
  "2024-08-01": {
    motBaki: 1000,
    motDhar: 2000,
    motCash: 3000,
    nijerDhar: 4000,
    commission: 500,
    nijerKhoroch: 600,
  },
  "2024-08-02": {
    motBaki: 1500,
    motDhar: 2500,
    motCash: 3500,
    nijerDhar: 4500,
    commission: 550,
    nijerKhoroch: 650,
  },
  "2024-08-03": {
    motBaki: 2000,
    motDhar: 3000,
    motCash: 4000,
    nijerDhar: 5000,
    commission: 600,
    nijerKhoroch: 700,
  },
  "2024-08-04": {
    motBaki: 2500,
    motDhar: 3500,
    motCash: 4500,
    nijerDhar: 5500,
    commission: 650,
    nijerKhoroch: 750,
  },
  "2024-08-05": {
    motBaki: 3000,
    motDhar: 4000,
    motCash: 5000,
    nijerDhar: 6000,
    commission: 700,
    nijerKhoroch: 800,
  },
};

const FinalPage = () => {
  const [startDate1, setStartDate1] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());

  // Function to get dummy data based on selected date
  const getDataForDate = (date) => {
    const dateString = formatDate(date);
    return dummyData[dateString] || {};
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Get data for selected dates
  const data1 = getDataForDate(startDate1);
  const data2 = getDataForDate(startDate2);

  // Aggregate data for date range
  const getRangeData = () => {
    let aggregatedData = {
      motBaki: 0,
      motDhar: 0,
      motCash: 0,
      nijerDhar: 0,
      commission: 0,
      nijerKhoroch: 0,
    };

    Object.keys(dummyData).forEach((date) => {
      const currentDate = new Date(date);
      if (currentDate >= startDate1 && currentDate <= startDate2) {
        aggregatedData = {
          motBaki: aggregatedData.motBaki + dummyData[date].motBaki,
          motDhar: aggregatedData.motDhar + dummyData[date].motDhar,
          motCash: aggregatedData.motCash + dummyData[date].motCash,
          nijerDhar: aggregatedData.nijerDhar + dummyData[date].nijerDhar,
          commission: aggregatedData.commission + dummyData[date].commission,
          nijerKhoroch:
            aggregatedData.nijerKhoroch + dummyData[date].nijerKhoroch,
        };
      }
    });

    return aggregatedData;
  };

  const rangeData = getRangeData();

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
                <td>মোট বাকি</td>
                <td>{data1.motBaki}</td>
              </tr>
              <tr>
                <td>মোট ধার</td>
                <td>{data1.motDhar}</td>
              </tr>
              <tr>
                <td>মোট ক্যাশ</td>
                <td>{data1.motCash}</td>
              </tr>
              <tr>
                <td>নিজের ধার</td>
                <td>{data1.nijerDhar}</td>
              </tr>
              <tr>
                <td>মোট</td>
                <td>
                  {data1.motBaki +
                    data1.motDhar +
                    data1.motCash +
                    data1.nijerDhar}
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
                <td>মোট বাকি</td>
                <td>{data2.motBaki}</td>
              </tr>
              <tr>
                <td>মোট ধার</td>
                <td>{data2.motDhar}</td>
              </tr>
              <tr>
                <td>মোট ক্যাশ</td>
                <td>{data2.motCash}</td>
              </tr>
              <tr>
                <td>নিজের ধার</td>
                <td>{data2.nijerDhar}</td>
              </tr>
              <tr>
                <td>মোট</td>
                <td>
                  {data2.motBaki +
                    data2.motDhar +
                    data2.motCash +
                    data2.nijerDhar}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mt-3 justify-content-center">
        <Col lg={8} className="text-center">
          <h5 className="summary-title font-weight-bold">
            সারসংক্ষেপ ({formatDate(startDate1)} থেকে {formatDate(startDate2)})
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
                <td>{rangeData.commission}</td>
              </tr>
              <tr>
                <td>নিজের খরচ</td>
                <td>{rangeData.nijerKhoroch}</td>
              </tr>
              <tr>
                <td>মোট</td>
                <td className="font-weight-bold">
                  {rangeData.commission + rangeData.nijerKhoroch}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default FinalPage;
