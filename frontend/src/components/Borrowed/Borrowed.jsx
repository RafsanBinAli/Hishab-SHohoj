import React, { useState } from "react";
import "./Borrowed.css";

const Borrowed = () => {
  const [borrowList, setBorrowList] = useState([
    {
      krishokerNaam: "কৃষক ১",
      dhar: 1000,
      baki: 0,
      oboshishto: 1000,
    },
    {
      krishokerNaam: "কৃষক ২",
      dhar: 500,
      baki: 250,
      oboshishto: 750,
    },
    {
      krishokerNaam: "কৃষক ৩",
      dhar: 750,
      baki: 500,
      oboshishto: 1250,
    },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({
    krishokerNaam: "",
    dhar: "",
    baki: "",
    oboshishto: "",
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
      <h2 className="borrowed-heading font-weight-bold">ধারসমূহ </h2>
      <div className="table-responsive">
        <table className="borrowed-table">
          <thead>
            <tr>
              <th>কৃষকের নাম</th>
              <th>ধার</th>
              <th>বাকি </th>
              <th>অবশিষ্ট</th>
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
                        name="krishokerNaam"
                        value={editData.krishokerNaam}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="dhar"
                        value={editData.dhar}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="baki"
                        value={editData.baki}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="oboshishto"
                        value={editData.oboshishto}
                        onChange={handleInputChange}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{borrow.krishokerNaam}</td>
                    <td>{borrow.dhar}</td>
                    <td>{borrow.baki}</td>
                    <td>{borrow.oboshishto}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Borrowed;
