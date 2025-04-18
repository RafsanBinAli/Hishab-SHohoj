import { useState, useEffect, useRef } from "react";
import Loader from "../Loader/Loader";
import handleDownload from "../../functions/handleDownload"; // Import the download function
import { useNavigate } from "react-router-dom";

const BankList = ({ banks, showDebtHistory = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const slipRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (Array.isArray(banks)) {
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
        `${import.meta.env.VITE_APP_BACKEND_URL}/bank/${bankId}/hide`,
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

  // Calculate total payment due for current page
  const totalPaymentDue = currentBanks.reduce(
    (acc, bank) => acc + bank.paymentDue,
    0
  );

  // Function to handle PDF download
  const downloadPdf = () => {
    handleDownload(slipRef, "Bank List"); // Pass the heading as the title
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (id) => {
    navigate(`/banks/${id}`); // Navigate to the FarmerDetails page
  };

  // Check if there are no banks after filtering
  const noBanks = !loading && filteredDebtHistory.length === 0;

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="flex-grow-1 d-flex justify-content-center">
            <h2 className="card-title">ব্যাংক লিস্ট</h2>
          </div>
          <button 
            onClick={downloadPdf} 
            className="btn btn-primary"
            disabled={loading || noBanks}
          >
            Download PDF
          </button>
        </div>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="ব্যাংক নাম দিয়ে সার্চ করুন"
          value={searchTerm}
          onChange={handleSearch}
          disabled={loading || filteredBanks.length === 0}
        />
        
        {loading ? (
          <Loader />
        ) : noBanks ? (
          <div className="alert alert-info text-center my-4">
            <h5>কোন ব্যাংক পাওয়া যায়নি</h5>
            {searchTerm && (
              <p className="mt-2">
                "{searchTerm}" নামের সাথে মিলে এমন কোন ব্যাংক নেই। অনুগ্রহ করে অন্য নাম দিয়ে সার্চ করুন।
              </p>
            )}
          </div>
        ) : (
          <div className="table-responsive" ref={slipRef}>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ব্যাংক নাম</th>
                  <th>ঠিকানা</th>
                  <th>মোবাইল নম্বর</th>
                  <th>বাকি</th>
                  <th>ছবি</th>
                  <th>Details</th>
                  {showDebtHistory && <th>অ্যাকশন</th>}
                </tr>
              </thead>
              <tbody>
                {currentBanks.map((bank, index) => (
                  <tr key={bank._id || index}>
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
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => handleDetailsClick(bank._id)}
                      >
                        Details
                      </button>
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
                {/* Total Balance Row */}
                <tr>
                  <td colSpan={showDebtHistory ? 4 : 4}></td>
                  <td className="text-end font-weight-bold">মোট বাকি:</td>
                  <td className="font-weight-bold">{totalPaymentDue}</td>
                  <td colSpan={showDebtHistory ? 2 : 1}></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && !noBanks && totalPages > 1 && (
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
    </div>
  );
};

export default BankList;