import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DokanerSlip.css";
import Loader from "../Loader/Loader";

const DokanerSlip = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="dokaner-slip-container">
      <div className="mt-4 mb-4 text-center farmer-slip-btn">
        <Link to="/slip/farmer" className="btn btn-success">
          কৃষকের স্লিপ
        </Link>
      </div>
      <h2 className="dokaner-slip-title font-weight-bold">দোকানদারের স্লিপ</h2>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="dokaner-slip-table">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-header">
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
      )}
    </div>
  );
};

export default DokanerSlip;
