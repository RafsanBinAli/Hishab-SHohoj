import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AllFarmerSlip.css"; // Import your custom CSS file
import { getCurrentDate } from "../../functions/getCurrentDate";

const AllFarmerSlip = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const formattedDate = selectedDate;
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-deals-particular-day?date=${formattedDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch deals");
        }
        const data = await response.json();
        setDeals(data);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="all-deals">
      <h1 className="all-deals-title">Market Deals</h1>
      <div className="text-center mb-4">
        <label htmlFor="datePicker" className="font-weight-bold">
          তারিখ:
        </label>
        <input
          type="date"
          id="datePicker"
          value={selectedDate}
          onChange={handleDateChange}
          className="ml-2"
        />
      </div>
      {loading ? (
        <div className="all-deals-loader">Loading...</div>
      ) : (
        <div className="all-deals-container">
          {deals.length ? (
            deals.map((deal) => (
              <div className="all-deals-card" key={deal._id}>
                <div className="all-deals-card-header">
                  <h2 className="all-deals-farmer-name">{deal.farmerName}</h2>
                </div>
                <div className="all-deals-card-body">
                  <p className="all-deals-deal-amount">
                    Deal Amount:{" "}
                    <span className="amount">
                      {deal.totalAmountToBeGiven} টাকা
                    </span>
                  </p>
                  <p className="all-deals-deal-created-at">
                    তারিখ:{" "}
                    <span className="created-at">
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <Link
                  to={`/slip/farmer/details/${deal._id}`}
                  className="all-deals-btn-details"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="all-deals-no-deals">
              No deals available for this date
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllFarmerSlip;
