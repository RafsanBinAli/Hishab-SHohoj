import  { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Loader from "../Loader/Loader";
import handleDownload from "../../functions/handleDownload"; // Import the download function

const FarmerList = ({ farmers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const slipRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

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

  // Calculate total balance for current page
  const totalDue = currentFarmers.reduce(
    (acc, farmer) => acc + farmer.totalDue,
    0
  );

  // Example call to generate a PDF with a custom title
  const downloadPdf = () => {
    handleDownload(slipRef, "Farmer List"); // Pass the heading as the title
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (id) => {
    navigate(`/farmers/${id}`); // Navigate to the FarmerDetails page
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
                      <th>মোবাইল নাম্বার</th>
                      <th>বাকি</th>
                      <th>ছবি</th>
                      <th>Details</th> {/* New column for Details */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentFarmers.map((farmer, index) => (
                      <tr key={farmer._id}>
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
                        <td>
                          <button
                            className="btn btn-info"
                            onClick={() => handleDetailsClick(farmer._id)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Total Balance Row */}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-end font-weight-bold">মোট বাকি:</td>
                      <td className="font-weight-bold">{totalDue}</td>
                      <td></td>
                      <td></td>
                    </tr>
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
