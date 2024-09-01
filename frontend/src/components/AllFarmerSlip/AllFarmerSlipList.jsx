import React from "react";
import { Link } from "react-router-dom";
import "./AllFarmerSlip.css";

const AllFarmerSlipList = ({ filteredDeals, loading }) => {
  return (
    <div className="all-deals-list">
      {loading ? (
        <div className="all-deals-loader">Loading...</div>
      ) : (
        <div className="all-deals-container">
          {filteredDeals.length ? (
            filteredDeals.map((deal) => (
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

                <div className="all-slip-card-footer">
                  <Link
                    to={`/slip/farmer/details/${deal._id}`}
                    className="all-deals-btn-details"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="all-deals-no-deals">
              এই তারিখের জন্য কোনো তথ্য পাওয়া যায়নি।
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllFarmerSlipList;
