import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import "./Home.css";

const Home = () => {
  const [cardData, setCardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    fetchDealsForDate(selectedDate);
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

  const handleNewDealClick = () => {
    navigate("/new-deal");
  };

  const handleCardClick = (id) => {
    navigate(`/card-detail/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="my-4 py-2 text-center font-weight-bold">
        আজকের মার্কেটের হিসাব
      </h2>
      <div className="row mb-4 align-items-center ml-1">
        <div className="col-md-3">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd MMMM, yyyy"
            className="form-control"
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
            placeholder="সার্চ করুন দোকানের নাম,স্টক,দাম দিয়ে..."
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
      <div className="row row-cols-1 row-cols-md-3 g-4 ml-1">
        {cardData
          .filter((card) =>
            card.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((card, index) => (
            <div key={index} className="col">
              <div
                className="card h-100 item"
                onClick={() => handleCardClick(card._id)}
              >
                <div className="item-in">
                  <h4 className="card-title">{card.farmerName}</h4>
                  <div className="seperator"></div>
                  {card.stock.map((stockItem, idx) => (
                    <div key={idx}>
                      <p className="card-text">
                        <b>{stockItem.stockName}</b>:{" "}
                        <b>{stockItem.quantity}</b> কেজি{" "}
                      </p>
                    </div>
                  ))}
                  <a href="#">
                    কার্ডে ক্লিক করুন <i className="fa fa-long-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
