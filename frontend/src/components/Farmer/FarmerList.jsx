import React, { useState } from "react";

const FarmerList = ({ farmers }) => {
//   console.log(farmers);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredfarmers = farmers.filter((shop) =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>কৃষকের নাম </th>
                  <th>ঠিকানা </th>
                  <th>মোবাইল নম্বর </th>
                  <th>ছবি</th>
                </tr>
              </thead>
              <tbody>
                {filteredfarmers.map((shop, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{shop.name}</td>
                    <td>{shop.village}</td>
                    <td>{shop.phoneNumber}</td>
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
        </div>
      </div>
    </>
  );
};
export default FarmerList;
