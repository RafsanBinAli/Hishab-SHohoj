import React, { useState, useEffect, useRef } from "react";
import Loader from "../Loader/Loader";
import handleDownload from "../../functions/handleDownload"; // Import the download function

const FarmerList = ({ farmers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const slipRef = useRef(null);

  useEffect(() => {
    if (farmers.length > 0) {
      setLoading(false); // Stop loading once data is available
    }
  }, [farmers]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(10);
      } else {
        setItemsPerPage(30);
      }
    };

    handleResize(); // Set initial items per page
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFarmers = filteredFarmers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Example call to generate a PDF with a custom title
  const downloadPdf = () => {
    handleDownload(slipRef, "Farmer List"); // Pass the heading as the title
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
              <>
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
                    {currentFarmers.map((farmer, index) => (
                      <tr key={index}>
                        <td>{startIndex + index + 1}</td>
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
              </>
            )}
          </div>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerList;
