import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import handleDownload from "../../functions/handleDownload";

const FarmerSlipDetailsPaidUnpaid = () => {
  const { id } = useParams();
  const [slipDetails, setSlipDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commission, setCommission] = useState(0);
  const [khajna, setKhajna] = useState(0);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const totalAmount = slipDetails?.purchases.reduce(
    (acc, purchase) => acc + purchase.quantity * purchase.price,
    0
  );
  var finalAmount = totalAmount - commission - khajna;

  useEffect(() => {
    const fetchDeal = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-card-details/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch deal");
        }
        const data = await response.json();
        setSlipDetails(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching deal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  const handlePayNow = async () => {
    if (khajna === 0) {
      const isConfirmed = window.confirm(
        "Khajna is 0. Are you sure you want to proceed?"
      );
      if (!isConfirmed) {
        return;
      }
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/save-daily`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commission,
            khajna,
            name: slipDetails?.farmerName,
            amount: totalAmount - khajna - commission,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save daily transaction");
      }
    } catch (error) {
      console.error("Error saving daily transaction:", error);
      alert("An error occurred while saving daily transaction");
    }

    try {
      const updateResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/card-details-update-secondary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: slipDetails?._id,
            khajna,
            commission,
            totalAmountToBeGiven: totalAmount - khajna - commission,
          }),
        }
      );
      if (!updateResponse.ok) {
        throw new Error("Error updating card details!");
      }
      const data = await updateResponse.json();

      alert("Commissions and khajnas saved successfully and updated!");
    } catch (error) {
      console.error("Error occurred updating card details!");
      alert("Error occurred updating card details");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dokaner-slip-container">
      <h2 className="dokaner-slip-title font-weight-bold">
        {slipDetails?.farmerName} স্লিপ
      </h2>
      <div className="slip-card">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{slipDetails?.shopName}</h5>

            <table className="table table-striped slip-table">
              <thead>
                <tr>
                  <th>কৃষকের নাম</th>
                  <th>পণ্যের নাম</th>
                  <th>পরিমাণ (কেজি)</th>
                  <th>দাম (টাকা/কেজি)</th>
                  <th>মোট টাকা</th>
                </tr>
              </thead>
              <tbody>
                {slipDetails?.purchases.map((purchase, index) => (
                  <tr key={index} className="slip-row">
                    <td>{purchase.shopName}</td>
                    <td>{purchase.stockName}</td>
                    <td>{purchase.quantity}</td>
                    <td>{purchase.price}</td>
                    <td>{purchase.quantity * purchase.price}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    Total Amount
                  </td>
                  <td>{totalAmount} টাকা</td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    {slipDetails.doneStatus ? (
                      <span>Commission:</span>
                    ) : (
                      <label htmlFor="commission">Commission:</label>
                    )}
                  </td>
                  <td>
                    {slipDetails.doneStatus ? (
                      <span>{slipDetails?.commission} টাকা</span>
                    ) : (
                      <input
                        type="number"
                        className="form-control"
                        id="commission"
                        value={commission}
                        onChange={(e) => setCommission(Number(e.target.value))}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    {slipDetails.doneStatus ? (
                      <span>Khajna:</span>
                    ) : (
                      <label htmlFor="khajna">Khajna:</label>
                    )}
                  </td>
                  <td>
                    {slipDetails.doneStatus ? (
                      <span>{slipDetails?.khajna} টাকা</span>
                    ) : (
                      <input
                        type="number"
                        className="form-control"
                        id="khajna"
                        value={khajna}
                        onChange={(e) => setKhajna(Number(e.target.value))}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    Subtotal
                  </td>
                  <td>
                    {slipDetails?.totalAmountToBeGiven !== 0
                      ? slipDetails.totalAmountToBeGiven
                      : finalAmount}
                    টাকা
                  </td>
                </tr>
              </tbody>
            </table>
            {slipDetails.doneStatus && (
              <button
                className="btn btn-primary m-2"
                onClick={() =>
                  handleDownload({
                    individualCardDetails: slipDetails,
                    selectedDate: formatDate(slipDetails.createdAt),
                    commission: slipDetails.commission,
                    khajna: slipDetails.khajna,
                    finalAmount: slipDetails.totalAmountToBeGiven,
                  })
                }
              >
                পিডিএফ ডাউনলোড করুন
              </button>
            )}

            {!slipDetails.doneStatus && (
              <button className="btn btn-primary mt-3" onClick={handlePayNow}>
                Pay Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerSlipDetailsPaidUnpaid;
