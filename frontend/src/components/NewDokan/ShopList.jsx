import React, { useState, useEffect, useRef } from "react";
import Loader from "../Loader/Loader";
import handleDownload from "../../functions/handleDownload"; // Import the download function

const ShopList = ({ shops, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const slipRef = useRef(null);

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

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setItemsPerPage(10);
    } else {
      setItemsPerPage(30);
    }
  }, []);

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

  // Function to generate PDF
  const downloadPdf = () => {
    handleDownload(slipRef, "Shop List"); // Pass the heading as the title
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="flex-grow-1 d-flex justify-content-center">
            <h2 className="card-title">দোকানের লিস্ট</h2>
          </div>
          <button onClick={downloadPdf} className="btn btn-primary">
            Download PDF
          </button>
        </div>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="দোকানের নাম দিয়ে সার্চ করুন"
          value={searchTerm}
          onChange={handleSearch}
        />
        {loading ? (
          <Loader />
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
                </tr>
              </thead>
              <tbody>
                {currentShops.map((shop, index) => (
                  <tr key={index}>
                    <td>{startIndex + index + 1}</td>
                    <td className="text-center">{shop.shopName}</td>
                    <td>{shop.address}</td>
                    <td>{shop.phoneNumber}</td>
                    <td>{shop.totalDue}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
  );
};

export default ShopList;
