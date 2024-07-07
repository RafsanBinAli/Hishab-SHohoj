import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, parseISO } from "date-fns";
import "./Home.css";

const Home = () => {
  const [cardData, setCardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDate) {
      fetchDealsForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchDealsForDate = async (date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/get-market-deals?date=${formattedDate}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch market deals");
      }
      const data = await response.json();
      setCardData(data);
    } catch (error) {
      console.error("Error fetching market deals:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCards = cardData.filter((card) =>
    card.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewDealClick = () => {
    navigate("/new-deal");
  };

  const handleCardClick = (id) => {
    navigate(`/card-detail/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="my-4 py-2 text-center">আজকের মার্কেটের হিসাব</h2>
      <div className="row mb-4 align-items-center">
        <div className="col-md-3">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd MMMM, yyyy"
            className="form-control"
            style={{
              width: "100%",
              padding: "0.375rem 0.75rem",
              fontSize: "1rem",
            }}
            placeholderText="Select a date"
            customInput={<input readOnly />}
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
              <div>
                <div>{format(date, "MMMM yyyy")}</div>
                <div>
                  <button onClick={decreaseMonth}>{"<"}</button>
                  <button onClick={increaseMonth}>{">"}</button>
                </div>
              </div>
            )}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, stock, or price..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-3 text-md-right mt-2 mt-md-0">
          <button className="btn btn-primary" onClick={handleNewDealClick}>
            নতুন হিসাব যোগ করুন
          </button>
        </div>
      </div>
      <div className="row">
        {filteredCards.map((card, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card" onClick={() => handleCardClick(card._id)}>
              <div className="card-body">
                <h5 className="card-title">{card.farmerName}</h5>
                {card.stock.map((stockItem, idx) => (
                  <div key={idx}>
                    <p className="card-text">
                      {stockItem.stockName}: <b> {stockItem.quantity} কেজি </b> x{" "}
                      <b>{stockItem.price}</b> tk ={" "}
                      <b>{stockItem.price * stockItem.quantity}</b> tk
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
