import { useState, useEffect } from "react";
import AllFarmerSlipHeader from "./AllFarmerSlipHeader";
import AllFarmerSlipList from "./AllFarmerSlipList";
import { getCurrentDate } from "../../functions/getCurrentDate";

const AllFarmerSlip = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [searchTerm, setSearchTerm] = useState("");

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
        setFilteredDeals(data);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [selectedDate]);

  useEffect(() => {
    const filtered = deals.filter((deal) =>
      deal.farmerName.toLowerCase().includes(searchTerm)
    );
    setFilteredDeals(filtered);
  }, [searchTerm, deals]);

  return (
    <div className="all-deals">
      <AllFarmerSlipHeader
        setSelectedDate={setSelectedDate}
        setSearchTerm={setSearchTerm}
      />
      <AllFarmerSlipList filteredDeals={filteredDeals} loading={loading} />
    </div>
  );
};

export default AllFarmerSlip;
