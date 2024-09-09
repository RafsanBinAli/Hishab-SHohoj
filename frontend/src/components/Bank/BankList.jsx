import React, { useState, useEffect, useRef } from "react";
import Loader from "../Loader/Loader";

const BankList = ({ banks, showDebtHistory = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const slipRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(banks) && banks.length > 0) {
      setLoading(false);
    }
  }, [banks]);

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

  const handleHide = async (bankId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/bank/${bankId}/hide`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        window.location.reload(); // Reload to update the list
      } else {
        console.error("Failed to update bank status");
      }
    } catch (error) {
      console.error("Error updating bank status:", error);
    }
  };

  const filteredBanks = Array.isArray(banks)
    ? banks.filter((bank) =>
        bank.bankName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredDebtHistory = showDebtHistory
    ? filteredBanks.filter((bank) => bank.status === true)
    : filteredBanks;

  // Pagination calculations
  const totalPages = Math.ceil(filteredDebtHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBanks = filteredDebtHistory.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">Bank লিস্ট</h2>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Bank নাম দিয়ে সার্চ করুন"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="table-responsive" ref={slipRef}>
          {loading ? (
            <Loader />
          ) : (
            <>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bank নাম</th>
                    <th>ঠিকানা</th>
                    <th>মোবাইল নম্বর</th>
                    <th>Payment Due</th>
                    <th>ছবি</th>
                    {showDebtHistory && <th>অ্যাকশন</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentBanks.map((bank, index) => (
                    <tr key={index}>
                      <td>{startIndex + index + 1}</td>
                      <td>{bank.bankName}</td>
                      <td>{bank.village}</td>
                      <td>{bank.phoneNumber}</td>
                      <td>{bank.paymentDue}</td>
                      <td>
                        {bank.imageUrl && (
                          <img
                            src={bank.imageUrl}
                            alt="bank"
                            className="img-thumbnail"
                            style={{ maxHeight: "50px", maxWidth: "50px" }}
                          />
                        )}
                      </td>
                      {showDebtHistory && (
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleHide(bank._id)}
                          >
                            Hide
                          </button>
                        </td>
                      )}
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
  );
};

export default BankList;
