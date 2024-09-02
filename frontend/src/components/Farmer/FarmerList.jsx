import React, { useState, useEffect, useRef } from "react";
import Loader from "../Loader/Loader";
import handleDownload from "../../functions/handleDownload"; // Import the download function

const FarmerList = ({ farmers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const slipRef = useRef(null);

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

  // Example call to generate a PDF with a custom title
  const downloadPdf = () => {
    handleDownload(slipRef, "Farmer List"); // Pass the heading as the title
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="flex-grow-1 d-flex justify-content-center">
              <h2 className="card-title">কৃষকের লিস্ট </h2>
            </div>
            <button onClick={downloadPdf} className="btn btn-primary">
              Download PDF
            </button>
          </div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="কৃষকের নাম দিয়ে সার্চ করুন"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="table-responsive" ref={slipRef}>
            {loading ? (
              <Loader /> // Show loader while data is being fetched
            ) : (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="text-center">কৃষকের নাম</th>
                    <th>ঠিকানা</th>
                    <th>মোবাইল নম্বর</th>
                    <th>বাকি</th>
                    <th>ছবি</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFarmers.map((farmer, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="text-center">{farmer.name}</td>
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
