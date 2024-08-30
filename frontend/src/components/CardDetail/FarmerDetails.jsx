import React from "react";
import "./CardDetail.css";

const FarmerDetails = ({ individualFarmerData }) => {
  return (
    <>
      <div className="col-md-4 ml-10">
        <div className="card-body farmer-card">
          <h5 className="header-title">কৃষকের পরিচয়</h5>
          <div className="farmer-details">
            <div className="farmer-image-container">
              {individualFarmerData?.imageUrl ? (
                <img
                  src={individualFarmerData.imageUrl}
                  alt={individualFarmerData?.name}
                  className="farmer-image"
                />
              ) : (
                <p>No Image Available</p>
              )}
            </div>
            <div className="detail-items">
              <div className="detail-item">
                <span className="label">নাম:</span>
                <span className="value">{individualFarmerData?.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">গ্রাম:</span>
                <span className="value">{individualFarmerData?.village}</span>
              </div>
              <div className="detail-item">
                <span className="label">মোবাইল:</span>
                <span className="value">
                  {individualFarmerData?.phoneNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-1 d-flex align-items-center justify-content-center">
        <div className="vr"></div>
      </div>
    </>
  );
};

export default FarmerDetails;
