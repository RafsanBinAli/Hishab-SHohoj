import { useState, useEffect, useCallback, useMemo } from "react";
import AllFarmerSlipHeader from "./AllFarmerSlipHeader";
import AllFarmerSlipList from "./AllFarmerSlipList";
import { getCurrentDate } from "../../functions/getCurrentDate";

const AllFarmerSlip = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch deals only when date changes
  useEffect(() => {
    let isMounted = true;
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const formattedDate = selectedDate;
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/get-deals-particular-day?date=${formattedDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch deals");
        }
        const data = await response.json();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setDeals(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchDeals();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [selectedDate]);
  
  // Use useMemo to filter deals instead of creating another state
  const filteredDeals = useMemo(() => {
    if (!searchTerm) return deals;
    return deals.filter((deal) =>
      deal.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, deals]);
  
  // Memoize handlers to prevent unnecessary re-renders
  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  }, []);
  
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  return (
    <div className="all-deals">
      <AllFarmerSlipHeader
        setSelectedDate={handleDateChange}
        setSearchTerm={handleSearch}
      />
      <AllFarmerSlipList filteredDeals={filteredDeals} loading={loading} />
    </div>
  );
};

export default AllFarmerSlip;