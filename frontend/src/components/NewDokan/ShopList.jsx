import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import handleDownload from "../../functions/handleDownload"; // Import the download function

const ShopList = ({ shops, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const slipRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(10);
      } else {
        setItemsPerPage(30);
      }
      setCurrentPage(1); // Reset to first page when itemsPerPage changes
    };

    handleResize(); // Set initial items per page
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Reset to first page when shops list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [shops]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const filteredShops = shops.filter((shop) =>
    shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentShops = filteredShops.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate total balance for current page
  const totalDue = currentShops.reduce((acc, shop) => acc + (shop.totalDue || 0), 0);

  // Function to generate PDF
  const downloadPdf = () => {
    handleDownload(slipRef, "Shop List"); // Pass the heading as the title
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (id) => {
    navigate(`/shops/${id}`); // Navigate to the FarmerDetails page
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="flex-grow-1 d-flex justify-content-center">
            <h2 className="card-title">দোকানের লিস্ট</h2>
          </div>
          <button 
            onClick={downloadPdf} 
            className="btn btn-primary"
            disabled={loading || filteredShops.length === 0}
          >
            Download PDF
          </button>
        </div>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="দোকানের নাম দিয়ে সার্চ করুন"
          value={searchTerm}
          onChange={handleSearch}
        />
        {loading ? (
          <Loader />
        ) : filteredShops.length === 0 ? (
          <div className="alert alert-info text-center">
            <p>কোন দোকান পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="table-responsive" ref={slipRef}>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="text-center">দোকানের নাম</th>
                  <th>ঠিকানা</th>
                  <th>মোবাইল নম্বর</th>
                  <th>বাকি</th>
                  <th>ছবি</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {currentShops.map((shop, index) => (
                  <tr key={shop._id || index}>
                    <td>{startIndex + index + 1}</td>
                    <td className="text-center">{shop.shopName}</td>
                    <td>{shop.address}</td>
                    <td>{shop.phoneNumber}</td>
                    <td>{shop.totalDue || 0}</td>
                    <td>
                      {shop.imageUrl && (
                        <img
                          src={shop.imageUrl}
                          alt="Shop"
                          className="img-thumbnail"
                          style={{ maxHeight: "50px", maxWidth: "50px" }}
                        />
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => handleDetailsClick(shop._id)}
                        disabled={!shop._id}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Total Balance Row */}
                <tr>
                  <td colSpan="3"></td>
                  <td className="text-end font-weight-bold">মোট বাকি:</td>
                  <td className="font-weight-bold">{totalDue}</td>
                  <td colSpan="2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default ShopList;