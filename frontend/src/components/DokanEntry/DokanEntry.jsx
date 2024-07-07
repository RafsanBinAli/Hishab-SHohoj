import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DokanEntry.css";

const Dokans = () => {
  const dummyData = [
    {
      name: "Dokan 1",
      items: [
        { itemName: "Item 1", quantity: 10, price: 100 },
        { itemName: "Item 2", quantity: 5, price: 50 },
      ],
    },
    {
      name: "Dokan 2",
      items: [
        { itemName: "Item 3", quantity: 20, price: 200 },
        { itemName: "Item 4", quantity: 10, price: 100 },
      ],
    },
    {
      name: "Dokan 3",
      items: [
        { itemName: "Item 5", quantity: 30, price: 300 },
        { itemName: "Item 6", quantity: 15, price: 150 },
      ],
    },
    {
      name: "Dokan 4",
      items: [
        { itemName: "Item 7", quantity: 40, price: 400 },
        { itemName: "Item 8", quantity: 20, price: 200 },
      ],
    },
    {
      name: "Dokan 5",
      items: [
        { itemName: "Item 9", quantity: 50, price: 500 },
        { itemName: "Item 10", quantity: 25, price: 250 },
      ],
    },
    {
      name: "Dokan 6",
      items: [
        { itemName: "Item 11", quantity: 50, price: 500 },
        { itemName: "Item 12", quantity: 25, price: 250 },
        { itemName: "Item 9", quantity: 50, price: 500 },
        { itemName: "Item 10", quantity: 25, price: 250 },
      ],
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddNew = () => {
    navigate("/new-dokan");
  };

  const handleCardClick = (dokan) => {
    navigate("/dokan-details", { state: { dokan } });
  };

  const filteredDokans = dummyData.filter(
    (dokan) =>
      dokan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dokan.items.some((item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="dokans-container">
      <h2 className="dokans-heading">Dokans</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or item..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="add-new-button" onClick={handleAddNew}>
          Add New
        </button>
      </div>
      <div className="dokans-list row">
        {filteredDokans.map((dokan, index) => (
          <div
            key={index}
            className="dokan-card col-md-4"
            onClick={() => handleCardClick(dokan)}
          >
            <h5 className="dokan-title">{dokan.name}</h5>
            {dokan.items.map((item, itemIndex) => (
              <div key={itemIndex} className="dokan-item">
                <p className="item-name">{item.itemName}</p>
                <p className="item-quantity">Quantity: {item.quantity} kg</p>
                <p className="item-price">Price: {item.price} tk</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dokans;
