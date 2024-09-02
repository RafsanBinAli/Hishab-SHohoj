import React, { useState, useRef } from "react";
import Loader from "../Loader/Loader";
import handleDownload from "../../functions/handleDownload"; // Import the download function

const ShopList = ({ shops, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const slipRef = useRef(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredShops = shops.filter((shop) =>
    shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to generate PDF
  const downloadPdf = () => {
    handleDownload(slipRef, "Farmer List"); // Pass the heading as the title
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
                {filteredShops.map((shop, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
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
    </div>
  );
};

export default ShopList;
