import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FarmerSlip.css";

const FarmerSlip = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/get-unpaid-deals`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch deals");
        }
        const data = await response.json();
        setDeals(data);
        setFilteredDeals(data);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = deals.filter((deal) =>
      deal.farmerName.toLowerCase().includes(value)
    );
    setFilteredDeals(filtered);
  };

  const handleShowAllDeals = () => {
    navigate("/slip/farmer/all-deals");
  };


  return (
    <div className="farmer-slip">
      <div className="farmer-slip-header">
        <h1 className="farmer-slip-title">Unpaid Deals</h1>
        <button
          className="farmer-slip-btn-show-every-deals"
          onClick={handleShowAllDeals}
        >
          Show Every Deal
        </button>
      </div>

      <div className="farmer-slip-search">
        <input
          type="text"
          className="form-control"
          placeholder="কৃষকের নাম দিয়ে সার্চ করুন"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="farmer-slip-loader">Loading...</div>
      ) : (
        <div className="farmer-slip-card-container">
          {filteredDeals.length ? (
            filteredDeals.map((deal) => (
              <div className="farmer-slip-card" key={deal._id}>
                <div className="farmer-slip-card-header">
                  <h2 className="farmer-slip-farmer-name">{deal.farmerName}</h2>
                </div>
                <div className="farmer-slip-card-body">

                  <p className="farmer-slip-deal-created-at">
                    তারিখ:
                    <span className="created-at">
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <div className="farmer-slip-card-footer">
                  <Link
                    to={`/slip/farmer/details/${deal._id}`}
                    className="farmer-slip-btn-details"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="farmer-slip-no-deals">
              এই তারিখের জন্য কোনো তথ্য পাওয়া যায়নি।
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerSlip;
