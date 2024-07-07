import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DokanerSlip.css"; // Import your CSS file for styling

const DokanerSlip = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-shops`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch shops");
        }
        const data = await response.json();
        setShops(data);
      } catch (error) {
        console.error("Error fetching shops:", error);
        // Handle error state or alert user
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="dokaner-slip container mt-4">
      <h2 className="my-4 py-2 text-center">দোকানদারের স্লিপ</h2>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>দোকানের নাম</th>
                <th>স্লিপ দেখুন</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop._id}>
                  <td>{shop.shopName}</td>
                  <td>
                    <Link
                      to={`/slip-details/${shop.shopName}/${shop._id}`}
                      className="btn btn-primary"
                    >
                      দেখুন
                    </Link>
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

export default DokanerSlip;
