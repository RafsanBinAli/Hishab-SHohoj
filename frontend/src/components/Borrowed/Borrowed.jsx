import React, { useState } from "react";
import "./Borrowed.css";

const Borrowed = () => {
  const [borrowList, setBorrowList] = useState([
    {
      name: "John Doe",
      date: "2024-07-01",
      totalTaka: 1000,
      due: 0,
      phone: "1234567890",
    },
    {
      name: "Jane Smith",
      date: "2024-07-02",
      totalTaka: 500,
      due: 500,
      phone: "0987654321",
    },
    {
      name: "Alice Johnson",
      date: "2024-07-03",
      totalTaka: 750,
      due: 250,
      phone: "5555555555",
    },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    date: "",
    totalTaka: "",
    due: "",
    phone: "",
  });

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditData(borrowList[index]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    const updatedList = [...borrowList];
    updatedList[editingIndex] = editData;
    setBorrowList(updatedList);
    setEditingIndex(null);
  };

  return (
    <div className="borrowed-container">
      <h2 className="borrowed-heading">Borrowed</h2>
      <table className="borrowed-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Total money</th>
            <th>Due</th>
            <th>Action</th>
            <th>Phone</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {borrowList.map((borrow, index) => (
            <tr key={index}>
              {editingIndex === index ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="totalTaka"
                      value={editData.totalTaka}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="due"
                      value={editData.due}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    {editData.totalTaka - editData.due === 0 ? (
                      <span className="action-paid">Paid</span>
                    ) : (
                      <span className="action-due">Due</span>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <button onClick={handleSaveClick}>Save</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{borrow.name}</td>
                  <td>{borrow.date}</td>
                  <td>{borrow.totalTaka}</td>
                  <td>{borrow.due}</td>
                  <td>
                    {borrow.totalTaka - borrow.due === 0 ? (
                      <span className="action-paid">Paid</span>
                    ) : (
                      <span className="action-due">Due</span>
                    )}
                  </td>
                  <td>{borrow.phone}</td>
                  <td>
                    <button onClick={() => handleEditClick(index)}>Edit</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Borrowed;
