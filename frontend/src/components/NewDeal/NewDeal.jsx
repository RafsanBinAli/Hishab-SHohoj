import React, { useEffect, useState } from "react";
import "./NewDeal.css";
import { useNavigate } from "react-router-dom";

const NewDeal = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserInfo, setNewUserInfo] = useState({
    name: "",
    phoneNumber: "",
    village: "",
    fathersName: "",
  });

  const initialNewDealInfo = {
    name: "",
    stockItems: [{ stockName: "", quantity: 0 }],
  };

  const [newDealInfo, setNewDealInfo] = useState(initialNewDealInfo);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-all-farmers`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    return () => {
      // Optional clean-up logic here
    };
  }, []);

  const handleDealInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedStockItems = [...newDealInfo.stockItems];
    updatedStockItems[index] = {
      ...updatedStockItems[index],
      [name]: value,
    };
    setNewDealInfo({
      ...newDealInfo,
      [name]: value,
      stockItems: updatedStockItems,
    });

    if (name === "name") {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleUserInputChange = (event) => {
    const { name, value } = event.target;
    setNewUserInfo({ ...newUserInfo, [name]: value });
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setNewDealInfo({
      ...newDealInfo,
      name: user.name,
    });
    setFilteredUsers([]);
  };

  const handleAddDeal = async (e) => {
    e.preventDefault();

    const name = selectedUser.name;
    if (
      !name ||
      newDealInfo.stockItems.some((item) => !item.stockName || !item.quantity)
    ) {
      alert("সব ঘর পূরন করুন");
      return;
    }

    const url = `${process.env.REACT_APP_BACKEND_URL}/create-deal`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDealInfo),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || "Failed to add deal");
      }

      alert("নতুন ডিল সম্পূর্ন হয়েছে!");
      setNewDealInfo(initialNewDealInfo);
      setSelectedUser(null);
      navigate("/home");
    } catch (error) {
      console.error("Error adding deal:", error);
      alert(error.message || "Failed to add deal");
    }
  };

  const handleAddUser = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/create-farmer`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserInfo),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || "Network response was not ok");
      }

      alert("নতুন কৃষক সংযুক্ত হয়েছে!");
      setShowAddForm(false);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddRow = () => {
    setNewDealInfo({
      ...newDealInfo,
      stockItems: [...newDealInfo.stockItems, { stockName: "", quantity: 0 }],
    });
  };

  const handleRemoveRow = (index) => {
    const updatedStockItems = [...newDealInfo.stockItems];
    updatedStockItems.splice(index, 1);
    setNewDealInfo({ ...newDealInfo, stockItems: updatedStockItems });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <h2 className="mb-4">নতুন হিসাব</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">কৃষকের নাম</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="কৃষকের নাম সার্চ করুন "
                value={newDealInfo.name}
                onChange={(e) => handleDealInputChange(e)}
              />
              {filteredUsers.length > 0 && (
                <ul className="list-group">
                  {filteredUsers.map((user) => (
                    <li
                      key={user._id}
                      className="list-group-item"
                      onClick={() => handleUserSelect(user)}
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* <div className="form-group">
              <label htmlFor="number">নাম্বার</label>
              <input
                type="text"
                className="form-control"
                id="number"
                name="number"
                value={newDealInfo.number}
                onChange={(e) => handleDealInputChange(e)}
              />
            </div> */}
            {/* <div className="form-group">
              <label htmlFor="seller">Seller</label>
              <input
                type="text"
                className="form-control"
                id="seller"
                name="seller"
                value={newDealInfo.seller}
                onChange={(e) => handleDealInputChange(e)}
              />
              
            </div> */}
            <h3
              className="mb-4 pd-2"
              style={{ borderBottom: "1px solid black" }}
            >
              আজকের নিয়ে আসা পণ্য
            </h3>
            <table className="table">
              <thead>
                <tr>
                  <th>পণ্য নাম</th>
                  <th> পরিমাণ(কেজি)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {newDealInfo.stockItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        name="stockName"
                        placeholder="পণ্য নাম"
                        value={item.stockName}
                        onChange={(e) => handleDealInputChange(e, index)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        placeholder="পরিমাণ"
                        value={item.quantity}
                        onChange={(e) => handleDealInputChange(e, index)}
                      />
                    </td>

                    <td>
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleRemoveRow(index)}
                        >
                          বাতিল করুন
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row">
              <div className="col-md-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddRow}
                >
                  নতুন সারি
                </button>
              </div>
              <button className="btn btn-primary mt-3" onClick={handleAddDeal}>
                সেভ করুন
              </button>
            </div>
          </form>
        </div>
        <div className="border-line"></div>
        <div className="col-md-6">
          <h2 className="mb-4"> সিলেক্টেড কৃষকের তথ্য </h2>
          <div className="selected-user">
            {selectedUser ? (
              <div>
                <p>
                  <strong>কৃষকের নাম:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>নাম্বার:</strong> {selectedUser.phoneNumber}
                </p>

                {selectedUser.stockItems &&
                  selectedUser.stockItems.map((item, index) => (
                    <div key={index}>
                      <p>
                        <strong>Stock Name:</strong> {item.stockName}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Price:</strong> {item.price}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p>কোনো কৃষক সিলেক্ট করা হয়নি</p>
            )}
          </div>
          <button
            className="btn btn-primary mt-3 mb-4"
            onClick={() => setShowAddForm(true)}
          >
            নতুন কৃষক সংযুক্ত করুন
          </button>
          {showAddForm && (
            <div className="add-user-form">
              <h2 className="mb-4">নতুন কৃষকের তথ্য দিন</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="name">কৃষকের নাম</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={newUserInfo.name}
                    onChange={handleUserInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">নাম্বার</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={newUserInfo.phoneNumber}
                    onChange={handleUserInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="village">গ্রাম</label>
                  <input
                    type="text"
                    className="form-control"
                    id="village"
                    name="village"
                    value={newUserInfo.village}
                    onChange={handleUserInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fathersName">বাবার নাম</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fathersName"
                    name="fathersName"
                    value={newUserInfo.fathersName}
                    onChange={handleUserInputChange}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddUser}
                >
                  সেভ করুন
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewDeal;
