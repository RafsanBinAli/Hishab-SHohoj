import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";

const BankList = ({ banks }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(banks) && banks.length > 0) {
      setLoading(false);
    }
  }, [banks]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBanks = Array.isArray(banks)
    ? banks.filter((bank) =>
        bank.bankName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Bank লিস্ট</h2>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="কৃষকের নাম দিয়ে সার্চ করুন"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="table-responsive">
            {loading ? (
              <Loader />
            ) : (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bank নাম</th>
                    <th>ঠিকানা</th>
                    <th>মোবাইল নম্বর</th>
                    <th> Payment Due</th>
                    <th>ছবি</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBanks.map((bank, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{bank.bankName}</td>
                      <td>{bank.village}</td>
                      <td>{bank.phoneNumber}</td>
                      <td> {bank.paymentDue}</td>
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

export default BankList;
