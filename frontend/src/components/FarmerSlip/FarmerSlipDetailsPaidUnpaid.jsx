import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import handleDownload from "../../functions/handleDownload";

const FarmerSlipDetailsPaidUnpaid = () => {
  const cardRef = useRef();
  const { id } = useParams();
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [slipDetails, setSlipDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commission, setCommission] = useState(0);
  const [khajna, setKhajna] = useState(0);
  const [extraCommission, setExtraCommission] = useState(0);
  const [extraKhajna, setExtraKhajna] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-card-details/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch deal");
        const data = await response.json();
        setSlipDetails(data);
        setCommission(data.commission || 0);
        setKhajna(data.khajna || 0);
      } catch (error) {
        console.error("Error fetching deal:", error);
        alert("Failed to fetch slip details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  useEffect(() => {
    if (slipDetails) {
      const newTotalAmount = slipDetails.purchases.reduce(
        (acc, { quantity, price }) => acc + quantity * price,
        0
      );
      setTotalAmount(newTotalAmount);
      setFinalAmount(newTotalAmount - commission - khajna);
    }
  }, [slipDetails, commission, khajna, extraCommission, extraKhajna]);

  const handlePayNow = async () => {
    if (khajna < 0 || commission < 0) {
      alert("Commission and Khajna must be non-negative.");
      return;
    }

    if (
      khajna === 0 &&
      !window.confirm("Khajna is 0. Are you sure you want to proceed?")
    ) {
      return;
    }

    const finalCommission = commission + extraCommission;
    const finalKhajna = khajna + extraKhajna;

    try {
      // Save daily transaction
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/save-daily`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: slipDetails?.createdAt,
            commission:
              extraCommission === 0 ? finalCommission : extraCommission,
            khajna: extraKhajna === 0 ? finalKhajna : extraKhajna,
            name: slipDetails?.farmerName,
            amount: finalAmount,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save daily transaction");

      // Update card details
      const updateResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/card-details-update-secondary`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: slipDetails?._id,
            khajna: finalKhajna,
            commission: finalCommission,
            totalAmountToBeGiven: finalAmount,
          }),
        }
      );

      if (!updateResponse.ok) throw new Error("Error updating card details");

      const data = await updateResponse.json();
      alert("Commissions and khajnas saved successfully and updated!");

      // Update slip details and recalculate totals
      setSlipDetails(data.cardDetails);
      setCommission(finalCommission);
      setKhajna(finalKhajna);

      // Recalculate finalAmount after saving
      setFinalAmount(totalAmount - finalCommission - finalKhajna);
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred while saving transaction or updating details");
    }
  };

  const handleEditSave = () => {
    // Update commission and khajna with extra values
    setCommission((prev) => prev + extraCommission);
    setKhajna((prev) => prev + extraKhajna);

    
    setEditing(false);

    // Recalculate finalAmount
    setFinalAmount(
      totalAmount - (commission + extraCommission) - (khajna + extraKhajna)
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="dokaner-slip-container">
      <h2 className="dokaner-slip-title font-weight-bold">
        {slipDetails?.farmerName} স্লিপ Date:{" "}
        {new Date(slipDetails?.createdAt).toISOString().split("T")[0]}
      </h2>
      <div className="slip-card">
        <div className="card" ref={cardRef}>
          <div className="card-body">
            <h3 className="card-title">{slipDetails?.farmerName}</h3>
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
                {slipDetails?.purchases?.map(
                  ({ shopName, stockName, quantity, price }, index) => (
                    <tr key={index} className="slip-row">
                      <td>{shopName}</td>
                      <td>{stockName}</td>
                      <td>{quantity}</td>
                      <td>{price}</td>
                      <td>{quantity * price}</td>
                    </tr>
                  )
                )}
                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    Total Amount
                  </td>
                  <td>{totalAmount} টাকা</td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    {slipDetails?.doneStatus && !editing ? (
                      "Commission:"
                    ) : (
                      <label htmlFor="commission">Commission:</label>
                    )}
                  </td>
                  <td>
                    {slipDetails?.doneStatus && !editing ? (
                      <span>{commission} টাকা</span>
                    ) : (
                      <input
                        type="number"
                        className="form-control"
                        id="commission"
                        value={commission}
                        min="0"
                        onChange={(e) =>
                          setCommission(Math.max(0, Number(e.target.value)))
                        }
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    {slipDetails?.doneStatus && !editing ? (
                      "Khajna:"
                    ) : (
                      <label htmlFor="khajna">Khajna:</label>
                    )}
                  </td>
                  <td>
                    {slipDetails?.doneStatus && !editing ? (
                      <span>{khajna} টাকা</span>
                    ) : (
                      <input
                        type="number"
                        className="form-control"
                        id="khajna"
                        value={khajna}
                        min="0"
                        onChange={(e) =>
                          setKhajna(Math.max(0, Number(e.target.value)))
                        }
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    Subtotal
                  </td>
                  <td>{finalAmount} টাকা</td>
                </tr>
              </tbody>
            </table>

            {editing && (
              <>
                <div className="form-group">
                  <label htmlFor="extraCommission">Add Extra Commission:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="extraCommission"
                    value={extraCommission}
                    onChange={(e) =>
                      setExtraCommission(Math.max(0, Number(e.target.value)))
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="extraKhajna">Add Extra Khajna:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="extraKhajna"
                    value={extraKhajna}
                    onChange={(e) =>
                      setExtraKhajna(Math.max(0, Number(e.target.value)))
                    }
                  />
                </div>
                <button
                  className="btn btn-success m-2"
                  onClick={handleEditSave}
                >
                  Save
                </button>
              </>
            )}

            <div className="btn-group">
              <button
                className="btn btn-primary m-2"
                onClick={() => handleDownload(cardRef.current)}
              >
                Download PDF
              </button>
              <button
                className="btn btn-warning m-2"
                onClick={() => setEditing((prev) => !prev)}
              >
                {editing ? "Cancel Edit" : "Edit Commissions"}
              </button>
              <button
                className="btn btn-danger m-2"
                onClick={handlePayNow}
                disabled={editing}
                style={{ visibility: editing ? "hidden" : "visible" }}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerSlipDetailsPaidUnpaid;
