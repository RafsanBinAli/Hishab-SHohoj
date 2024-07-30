import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Borrowed.css";

const BorrowedTable = ({}) => {
  const [editingFarmerName, setEditingFarmerName] = useState(null);
  const [editedFarmerData, setEditedFarmerData] = useState({
    totalDue: "",
    totalPaid: "",
  });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [farmerList, setFarmerList] = useState([]);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-farmers`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch farmer data");
        }
        const data = await response.json();
        setFarmerList(data);
      } catch (error) {
        console.error("Error fetching farmer data:", error);
      }
    };
    fetchFarmerData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredFarmersList = farmerList.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = async (farmerName, updatedData) => {
    console.log(farmerName);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/update-farmers/${farmerName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update farmer's details");
      }
      const updatedFarmer = await response.json();
      const updatedFarmerList = farmerList.map((farmer) =>
        farmer.name === farmerName ? updatedFarmer : farmer
      );
      setFarmerList(updatedFarmerList);
      alert("Farmer data updated successfully!");
    } catch (error) {
      console.error("Error updating farmer data:", error);
      alert("Failed to update farmer data");
    }
  };

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
                <td
                  style={{
                    backgroundColor:
                      farmer.totalDue - farmer.totalPaid === 0 ? "green" : "",
                    color:
                      farmer.totalDue - farmer.totalPaid === 0 ? "white" : "",
                  }}
                >
                  {farmer.totalDue - farmer.totalPaid === 0
                    ? "Paid"
                    : farmer.totalDue - farmer.totalPaid}
                </td>
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