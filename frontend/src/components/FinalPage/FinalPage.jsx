import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LeftTable from "./LeftTable";
import RightTable from "./RightTable";
import CalculationSummary from "./CalculationSummary";
import "./FinalPage.css";

const FinalPage = () => {
  const [startDate1, setStartDate1] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <Container className="final-page-container">
      <Row className="justify-content-center">
        <Col lg={5} md={6}>
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

          <LeftTable startDate1={startDate1} />
        </Col>

        <Col lg={5} md={6}>
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

          <RightTable startDate2={startDate2} />
        </Col>
      </Row>
      <CalculationSummary startDate1={startDate1} startDate2={startDate2} />
    </Container>
  );
};

export default FinalPage;
