import React, { useState,  } from "react";

const ShopList = ({ shops }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredShops = shops.filter((shop) =>
    shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Shops List</h2>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by Shop Name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Shop Name</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {filteredShops.map((shop, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{shop.shopName}</td>
                    <td>{shop.address}</td>
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
    
  );
};

export default ShopList;
