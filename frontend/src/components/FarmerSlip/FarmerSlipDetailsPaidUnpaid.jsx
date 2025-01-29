import React, { useState, useEffect, useRef } from "react";
import "./FarmerSlipDetailsPaidUnpaid.css";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import handleDownload from "../../functions/handleDownload";
import MessageModal from "../Modal/MessageModal";

const FarmerSlipDetailsPaidUnpaid = () => {
  const slipRef = useRef();
  const { id } = useParams();
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [slipDetails, setSlipDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commission, setCommission] = useState(0);
  const [khajna, setKhajna] = useState(0);
  const [editing, setEditing] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [fixedCommission, setFixedCommission] = useState(0);
  const [fixedKhajna, setFixedKhajna] = useState(0);

  useEffect(() => {
    const fetchDeal = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/get-card-details/${id}`,
        );
        if (!response.ok) throw new Error("Failed to fetch deal");
        const data = await response.json();
        setSlipDetails(data);
        setCommission(data.commission || 0);
        setKhajna(data.khajna || 0);
        setFixedCommission(data.commission || 0);
        setFixedKhajna(data.khajna || 0);
      } catch (error) {
        console.error("Error fetching deal:", error);
        setModalTitle("Error");
        setModalMessage(
          "স্লিপের বিস্তারিত আনতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
        );
        setModalShow(true);
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
        0,
      );
      const newTotalQuantity = slipDetails.purchases.reduce(
        (acc, { quantity }) => acc + quantity,
        0,
      );
      setTotalAmount(newTotalAmount);
      setTotalQuantity(newTotalQuantity); // Set total quantity
      setFinalAmount(newTotalAmount - commission - khajna);
    }
  }, [slipDetails, commission, khajna]);

  const handlePayNow = async () => {
    if (khajna < 0 || commission < 0) {
      setModalTitle("Error");
      setModalMessage("কমিশন এবং খাজনা নেতিবাচক হতে পারে না।");
      setModalShow(true);
      return;
    }

    if (
      khajna === 0 &&
      !window.confirm("খাজনা ০। আপনি কি নিশ্চিত যে আপনি চালিয়ে যেতে চান?")
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/save-daily`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: slipDetails?.createdAt,
            commission: slipDetails?.doneStatus
              ? Math.abs(commission - fixedCommission)
              : commission,
            khajna: slipDetails?.doneStatus
              ? Math.abs(khajna - fixedKhajna)
              : khajna,
            name: slipDetails?.farmerName,
            amount: finalAmount,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to save daily transaction");

      // if (!slipDetails?.doneStatus) {
      //   const transactionUnpaidResponse = await fetch(
      //     `${process.env.REACT_APP_BACKEND_URL}/transaction/unpaid-deal-subtraction`,
      //     {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         date: slipDetails?.createdAt,
      //         totalUnpaidDealsPrice: finalAmount + commission + khajna,
      //       }),
      //     }
      //   );

      //   if (!transactionUnpaidResponse.ok)
      //     throw new Error("Failed to save daily transaction");
      // }

      const updateResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/card-details-update-secondary`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: slipDetails?._id,
            khajna: khajna,
            commission: commission,
            totalAmountToBeGiven: finalAmount,
          }),
        },
      );

      if (!updateResponse.ok) throw new Error("Error updating card details");

      const data = await updateResponse.json();
      setModalTitle("Success");
      setModalMessage("কমিশন এবং খাজনা সফলভাবে সংরক্ষিত এবং আপডেট হয়েছে!");
      setSlipDetails(data.cardDetails);
      setCommission(commission);
      setKhajna(khajna);
      setFinalAmount(totalAmount - commission - khajna);
    } catch (error) {
      console.error("Error occurred:", error);
      setModalTitle("Error");
      setModalMessage(
        "লেনদেন সংরক্ষণ অথবা আপডেট করতে ত্রুটি ঘটেছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setModalShow(true);
    }
  };

  const handleEditSave = () => {
    setEditing(false);
    setFinalAmount(totalAmount - commission - khajna);
  };
  // Example call to generate a PDF with a custom title
  const downloadPdf = () => {
    handleDownload(slipRef, "Farmer Slip");
  };

  if (loading) return <Loader />;

  return (
    <div className="dokaner-slip-container">
      <h2 className="dokaner-slip-title font-weight-bold">
        {slipDetails?.farmerName} স্লিপ
        <p>
          তারিখ: {new Date(slipDetails?.createdAt).toISOString().split("T")[0]}{" "}
        </p>
      </h2>
      <div className="slip-card">
        <div className="card">
          <div className="card-body">
            <div ref={slipRef}>
              <h3 className="card-title">{slipDetails?.farmerName}</h3>
              <table className="table table-striped slip-table">
                <thead>
                  <tr>
                    <th>দোকানের নাম</th>
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
                    ),
                  )}
                  <tr>
                    <td colSpan="4" className="text-right font-weight-bold">
                      মোট টাকা
                    </td>
                    <td>{totalAmount} টাকা</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-right font-weight-bold">
                      মোট পরিমাণ
                    </td>
                    <td>{totalQuantity} কেজি</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-right font-weight-bold">
                      {slipDetails?.doneStatus && !editing ? (
                        "কমিশন:"
                      ) : (
                        <label htmlFor="commission">কমিশন:</label>
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
                        "খাজনা:"
                      ) : (
                        <label htmlFor="khajna">খাজনা:</label>
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
                      সাবটোটাল
                    </td>
                    <td>{finalAmount} টাকা</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {editing && (
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={handleEditSave}>
                  সংরক্ষণ করুন
                </button>
              </div>
            )}
            <div className="btn-group">
              <button className="btn btn-primary m-2" onClick={downloadPdf}>
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
      <MessageModal
        show={modalShow}
        title={modalTitle}
        message={modalMessage}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default FarmerSlipDetailsPaidUnpaid;
