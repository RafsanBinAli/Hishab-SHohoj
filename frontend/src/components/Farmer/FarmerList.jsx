// FarmerList.js
import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader"; // Import the Loader component

const FarmerList = ({ farmers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmers.length > 0) {
      setLoading(false); // Stop loading once data is available
    }
  }, [farmers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">কৃষকের লিস্ট </h2>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="কৃষকের নাম দিয়ে সার্চ করুন"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="table-responsive">
            {loading ? (
              <Loader /> // Show loader while data is being fetched
            ) : (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>কৃষকের নাম </th>
                    <th>ঠিকানা </th>
                    <th>মোবাইল নম্বর </th>
                    <th>বাকি</th>
                    <th>ছবি</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFarmers.map((farmer, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{farmer.name}</td>
                      <td>{farmer.village}</td>
                      <td>{farmer.phoneNumber}</td>
                      <td>{farmer.totalDue}</td>
                      <td>
                        {farmer.imageUrl && (
                          <img
                            src={farmer.imageUrl}
                            alt="Farmer"
                            className="img-thumbnail"
                            style={{ maxHeight: "50px", maxWidth: "50px" }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerList;
