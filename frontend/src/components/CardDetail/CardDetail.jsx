import React, { useState, useEffect } from "react";
import "./CardDetail.css";
import FarmerSlipDetails from "./FarmerSlipDetails";
import MessageModal from "../Modal/MessageModal"; // Import the MessageModal component
import {
  fetchShops,
  fetchFarmers,
  fetchCardDetails,
} from "../../utils/dataService";

const CardDetail = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [loadedData, setLoadedData] = useState(null);
  const [shops, setShops] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [allCardDetails, setAllCardDetails] = useState([]);
  const [individualCardDetails, setIndividualCardDetails] = useState(null);
  const [individualFarmerData, setIndividualFarmerData] = useState(null);
  const [formRows, setFormRows] = useState([
    { farmerName: "", shopName: "", stockName: "", quantity: "", price: "" },
  ]);

  // State for managing the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const initializeData = async () => {
      const shopsData = await fetchShops();
      const farmersData = await fetchFarmers();
      const cardDetailsData = await fetchCardDetails();

      setShops(shopsData);
      setFarmers(farmersData);
      setAllCardDetails(cardDetailsData);
    };

    initializeData();
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newFormRows = [...formRows];
    newFormRows[index][name] = value;
    setFormRows(newFormRows);
  };

  const handleAddRow = () => {
    setFormRows((prevRows) => {
      const lastRow = prevRows[prevRows.length - 1];
      const newRow = {
        farmerName: lastRow ? lastRow.farmerName : "",
        shopName: "",
        stockName: "",
        quantity: "",
        price: "",
      };
      return [...prevRows, newRow];
    });
  };

  const handleRemoveRow = (index) => {
    setFormRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (
      formRows.some(
        (row) =>
          !row.farmerName ||
          !row.shopName ||
          !row.stockName ||
          !row.quantity ||
          !row.price
      )
    ) {
      setModalTitle("Incomplete Fields");
      setModalMessage("Please fill out all fields before saving.");
      setModalVisible(true);
      return;
    }

    setIsSaving(true); // Set saving state to true

    try {
      const newPurchases = formRows.map((row) => ({
        farmerName: row.farmerName,
        shopName: row.shopName,
        stockName: row.stockName,
        quantity: row.quantity,
        price: row.price,
        total: row.quantity * row.price,
      }));

      let id = individualCardDetails?._id;
      if (id === undefined) {
        console.log("farmer Name: ", individualFarmerData.name);
        const createCardDetailsResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/create-deal`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: individualFarmerData?.name }),
          }
        );
        if (!createCardDetailsResponse.ok) {
          throw new Error("Failed to create new Card!");
        }
        const data = await createCardDetailsResponse.json();
        setIndividualCardDetails(data);
        console.log("response", createCardDetailsResponse);
        id = data._id;
      }

      const updateCardResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/update-card-details/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ purchases: newPurchases }),
        }
      );
      if (!updateCardResponse.ok) {
        throw new Error("Failed to update card details");
      }
      console.log("Card details updated successfully");

      const slipsMap = new Map();
      const findOrCreateSlipResponses = await Promise.all(
        newPurchases.map(async (purchase) => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/slip/findOrCreate`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ shopName: purchase.shopName }),
              }
            );
            if (!response.ok) {
              throw new Error(
                `Failed to find or create slip for ${purchase.shopName}`
              );
            }
            const slip = await response.json();
            slipsMap.set(slip._id, slip.shopName);
            console.log("Slip added to map:", slip._id, slip.shopName);
          } catch (error) {
            console.error(
              `Error finding or creating slip for ${purchase.shopName}:`,
              error
            );
            throw error;
          }
        })
      );

      const updateSlipResponses = await Promise.all(
        Array.from(slipsMap.keys()).map(async (_id) => {
          try {
            const shopName = slipsMap.get(_id);
            const purchasesToUpdate = newPurchases.filter(
              (p) => p.shopName === shopName
            );
            const totalAmountToUpdate = purchasesToUpdate.reduce(
              (total, p) => total + p.total,
              0
            );

            const updateSlipResponse = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/slip/update/${_id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  shopName,
                  purchases: purchasesToUpdate,
                  totalAmount: totalAmountToUpdate,
                }),
              }
            );
            if (!updateSlipResponse.ok) {
              throw new Error(`Failed to update slip ${_id}`);
            }
            console.log(
              `Slip ${_id} updated successfully with purchases:`,
              purchasesToUpdate
            );
          } catch (error) {
            console.error(`Error updating slip ${_id}:`, error);
            throw error;
          }
        })
      );

      // Refresh card details after successful save
      const refreshedCardDetails = await fetchCardDetails();
      const updatedCardDetails = refreshedCardDetails.find(
        (card) => card.farmerName === individualFarmerData.name
      );
      setAllCardDetails(refreshedCardDetails);
      setIndividualCardDetails(updatedCardDetails);

      setModalTitle("Success");
      setModalMessage("সকল স্লিপ আপডেট সম্পূর্ন হয়েছে !!");
      setModalVisible(true);
    } catch (error) {
      console.error("Error in handleSave:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred during save operation.");
      setModalVisible(true);
    } finally {
      setIsSaving(false); // Reset saving state
    }
  };

  const handleShopChange = (index, event) => {
    const { name, value } = event.target;
    const newFormRows = [...formRows];
    newFormRows[index][name] = value;
    setFormRows(newFormRows);
  };

  const handleFarmerChange = (index, event) => {
    const { name, value } = event.target;
    const newFormRows = [...formRows];
    newFormRows[index][name] = value;
    setFormRows(newFormRows);
    const selectedFarmer = farmers.find((farmer) => farmer.name === value);
    setIndividualFarmerData(selectedFarmer);
    const selectedCard = allCardDetails.find(
      (card) => card.farmerName === value
    );
    setIndividualCardDetails(selectedCard);
  };

  return (
    <div className="container-card-details mt-4">
      <div className="mt-4">
        <h3 className="my-4 py-2 text-center font-weight-bold">
          নতুন দোকানের হিসাব যোগ করুন
        </h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>কৃষকের নাম</th>
              <th>দোকানের নাম</th>
              <th>দ্রব্যের নাম</th>
              <th>পরিমাণ (কেজি)</th>
              <th>দাম ( টাকা/কেজি )</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {formRows.map((row, index) => (
              <tr key={index}>
                <td>
                  <select
                    className="form-control"
                    name="farmerName"
                    value={row.farmerName || ""}
                    onChange={(e) => handleFarmerChange(index, e)}
                  >
                    <option value="">সিলেক্ট Farmer</option>

                    {farmers.map((farmer, idx) => (
                      <option key={idx} value={farmer.name}>
                        {farmer.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="form-control"
                    name="shopName"
                    value={row.shopName || ""}
                    onChange={(e) => handleShopChange(index, e)}
                  >
                    <option value="">সিলেক্ট দোকান</option>

                    {shops.map((shop, idx) => (
                      <option key={idx} value={shop.shopName}>
                        {shop.shopName}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="stockName"
                    value={row.stockName}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={row.price}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>

                <td>
                  {index === formRows.length - 1 && (
                    <button
                      className="btn btn-primary mr-2"
                      onClick={handleAddRow}
                    >
                      নতুন সারি
                    </button>
                  )}
                  {index > 0 && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveRow(index)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="btn1 btn-success mt-3"
          onClick={handleSave}
          disabled={isSaving} // Disable button while saving
        >
          {isSaving ? "Wait..." : "সেভ করুন"}{" "}
          {/* Show "Wait..." text while saving */}
        </button>
      </div>

      <FarmerSlipDetails
        loadedData={loadedData}
        individualFarmerData={individualFarmerData}
        individualCardDetails={individualCardDetails}
      />

      {/* Render the MessageModal component */}
      <MessageModal
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => setModalVisible(false)}
      />
    </div>
  );
};

export default CardDetail;
