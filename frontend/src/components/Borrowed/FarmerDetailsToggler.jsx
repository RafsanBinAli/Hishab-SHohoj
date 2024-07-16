import React from "react";
import "./Borrowed.css";

const FarmerDetailsToggler = ({
  toggleNewDebtForm,
  toggleNewPaymentForm,
  showNewDebtForm,
  newFarmerData,
  handleNewFarmerInputChange,
  filteredFarmers,
  handleFarmerSelection,
  handleSavePaymentClick,
  showNewPaymentForm,
  handleSaveDebtClick,
}) => {
  return (
    <div>
      <div className="button-container">
        <button onClick={toggleNewDebtForm}>
          নতুন ধার এর তথ্য সংযুক্ত করুন
        </button>
        <button onClick={toggleNewPaymentForm}>
          নতুন পরিশোধের তথ্য সংযুক্ত করুন
        </button>
      </div>

      {showNewDebtForm && (
        <div className="new-farmer-section">
          <h2 className="farmer-header-demo font-weight-bold">
            নতুন ধার এর তথ্য সংযুক্ত করুন
          </h2>
          <div className="new-farmer-inputs">
            <div>
              <div className="headings">
                <label className="farmerName">কৃষকের নাম</label>
              </div>
              <div>
                <input
                  type="text"
                  name="farmerName"
                  className="farmer-name"
                  value={newFarmerData.farmerName}
                  onChange={handleNewFarmerInputChange}
                  placeholder="কৃষকের নাম"
                />
                {filteredFarmers.length > 0 && (
                  <ul className="list-group-f">
                    {filteredFarmers.map((farmer) => (
                      <li
                        key={farmer._id}
                        className="list-group-item"
                        onClick={() => handleFarmerSelection(farmer)}
                      >
                        {farmer.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <div className="headings">
                <label className="totalDue">পূর্বের ধার</label>
              </div>
              <input
                type="number"
                name="totalDue"
                value={newFarmerData.totalDue}
                placeholder="পূর্বের ধার"
                disabled={!newFarmerData.farmerName}
              />
            </div>

            <div>
              <div className="headings">
                <label className="payGet">ধার দান</label>
              </div>
              <input
                type="number"
                name="newDhar"
                value={newFarmerData.newDhar}
                onChange={handleNewFarmerInputChange}
                placeholder="ধার দান"
                disabled={!newFarmerData.farmerName}
              />
            </div>

            <div>
              <div className="headings">
                <label className="remainingDue">মোট ধার</label>
              </div>

              <input
                type="number"
                name="remainingDue"
                value={newFarmerData.totalDue - newFarmerData.totalPaid}
                onChange={handleNewFarmerInputChange}
                placeholder="মোট ধার"
                disabled={!newFarmerData.farmerName}
              />
            </div>

            <div className="saveBtn">
              <div className="headingBtn"></div>
              <button
                onClick={handleSaveDebtClick}
                disabled={!newFarmerData.farmerName}
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewPaymentForm && (
        <div className="new-farmer-section">
          <h2 className="farmer-header-demo font-weight-bold">
            নতুন পরিশোধের তথ্য সংযুক্ত করুন
          </h2>

          <div className="new-farmer-inputs">
            <div>
              <div className="headings">
                <label className="farmerName">কৃষকের নাম</label>
              </div>
              <div>
                <input
                  type="text"
                  name="farmerName"
                  className="farmer-name"
                  value={newFarmerData.farmerName}
                  onChange={handleNewFarmerInputChange}
                  placeholder="কৃষকের নাম"
                />
                {filteredFarmers.length > 0 && (
                  <ul className="list-group-f">
                    {filteredFarmers.map((farmer) => (
                      <li
                        key={farmer._id}
                        className="list-group-item"
                        onClick={() => handleFarmerSelection(farmer)}
                      >
                        {farmer.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <div className="headings">
                <label className="totalDue">পূর্বের ধার</label>
              </div>
              <input
                type="number"
                name="totalDue"
                value={newFarmerData.totalDue}
                placeholder="পূর্বের ধার"
                disabled={!newFarmerData.farmerName}
              />
            </div>

            <div>
              <div className="headings">
                <label className="payNow">টাকা গ্রহণ</label>
              </div>
              <input
                type="number"
                name="payGet"
                value={newFarmerData.payGet}
                onChange={handleNewFarmerInputChange}
                placeholder="টাকা গ্রহণ"
                disabled={!newFarmerData.farmerName}
              />
            </div>

            <div>
              <div className="headings">
                <label className="remainingDue">বাকী টাকা</label>
              </div>

              <input
                type="number"
                name="remainingDue"
                value={newFarmerData.reaminngDue}
                onChange={handleNewFarmerInputChange}
                placeholder="বাকী টাকা"
                disabled={!newFarmerData.farmerName}
              />
            </div>

            <div className="saveBtn">
              <div className="headingBtn"></div>
              <button
                onClick={handleSavePaymentClick}
                disabled={!newFarmerData.farmerName}
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDetailsToggler;
