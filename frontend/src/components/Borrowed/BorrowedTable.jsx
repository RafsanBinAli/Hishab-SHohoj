import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Borrowed.css";

const BorrowedTable = ({
  filteredFarmersList,
  searchTerm,
  handleSearch,
  handleEditClick,
}) => {
  const [editingFarmerName, setEditingFarmerName] = useState(null);
  const [editedFarmerData, setEditedFarmerData] = useState({
    totalDue: "",
    totalPaid: "",
  });
  const navigate= useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFarmerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveClick = (farmerName) => {
    console.log(farmerName);
    handleEditClick(farmerName, editedFarmerData);
    setEditingFarmerName(null);
  };
  const handleDetailsClick = (farmer) => {
    navigate(`/dhar-details/${farmer._id}`, { state: { farmer } });
  };

  return (
    <div>
      <h2 className="card-title mb-4">দোকানের লিস্ট</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="কৃষকের নাম দিয়ে সার্চ করুন"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="table-responsive">
        <table className="borrowed-table">
          <thead>
            <tr>
              <th>কৃষকের নাম</th>
              <th>মোট ধার</th>
              <th>টাকা প্রদান</th>
              <th>বাকী টাকা</th>
              <th>Updated By</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmersList.map((farmer) => (
              <tr key={farmer.id}>
                <td>{farmer.name}</td>
                <td>
                  {editingFarmerName === farmer.name ? (
                    <input
                      type="number"
                      name="totalDue"
                      value={editedFarmerData.totalDue}
                      onChange={handleInputChange}
                    />
                  ) : (
                    farmer.totalDue
                  )}
                </td>
                <td>
                  {editingFarmerName === farmer.name ? (
                    <input
                      type="number"
                      name="totalPaid"
                      value={editedFarmerData.totalPaid}
                      onChange={handleInputChange}
                    />
                  ) : (
                    farmer.totalPaid
                  )}
                </td>
                <td>{farmer.totalDue - farmer.totalPaid}</td>
                <td>abc</td>
                <td>
                  {editingFarmerName === farmer.name ? (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleSaveClick(farmer.name)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setEditingFarmerName(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                        className="btn btn-info"
                        onClick={() => handleDetailsClick(farmer)}
                      >
                        Details
                      </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowedTable;
