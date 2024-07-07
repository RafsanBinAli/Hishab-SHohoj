import React from "react";
import "./DokanCardDetails.css";

const DokanCardDetails = () => {
  const dummyData = {
    date: "2023-07-04",
    items: [
      { seller: "Seller 1", item: "Item 1", quantity: 10, price: 100 },
      { seller: "Seller 2", item: "Item 2", quantity: 5, price: 50 },
      { seller: "Seller 3", item: "Item 3", quantity: 2, price: 200 },
    ],
    moderator: "Moderator 1",
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <div className="dokan-card-details">
      <div className="slip-container" id="slip-container">
        <h3 className="slip-date">Date: {dummyData.date}</h3>
        <div className="slip-items">
          {dummyData.items.map((item, index) => (
            <div key={index} className="slip-item">
              <p className="slip-seller">Seller: {item.seller}</p>
              <p className="slip-item-name">Item: {item.item}</p>
              <p className="slip-quantity">Quantity: {item.quantity} kg</p>
              <p className="slip-price">Price: {item.price} tk</p>
            </div>
          ))}
        </div>
        <div className="slip-moderator">
          <p>Moderator: {dummyData.moderator}</p>
        </div>
        <hr />
        <div className="slip-total">
          <p>Total Price: {calculateTotalPrice(dummyData.items)} tk</p>
        </div>
        <button>Generate PDF</button>
      </div>
    </div>
  );
};

export default DokanCardDetails;
