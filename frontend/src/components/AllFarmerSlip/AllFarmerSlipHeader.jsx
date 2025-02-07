import  { useState } from "react";
import "./AllFarmerSlip.css";
import { getCurrentDate } from "../../functions/getCurrentDate"; // Import getCurrentDate function

const AllFarmerSlipHeader = ({ setSelectedDate, setSearchTerm }) => {
  const [selectedDate, setLocalSelectedDate] = useState(getCurrentDate());

  const handleDateChange = (e) => {
    const date = e.target.value;
    setLocalSelectedDate(date);
    setSelectedDate(date); // Update the state in the parent component
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value); // Update the state in the parent component
  };

  return (
    <div className="all-deals-header">
      <h1 className="all-deals-title text-center my-4 py-2 font-weight-bold">
        Market Deals
      </h1>
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
      <div className="all-deals-search text-center mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="কৃষকের নাম দিয়ে সার্চ করুন"
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default AllFarmerSlipHeader;
