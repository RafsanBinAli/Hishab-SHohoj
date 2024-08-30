import { useEffect, useState, useRef } from "react";
import handleDownload from "../../functions/handleDownload";
import MessageModal from "../Modal/MessageModal";

const FarmerAndDokanSlip = ({ individualCardDetails }) => {
  const slipRef = useRef();
  const [commission, setCommission] = useState(0);
  const [khajna, setKhajna] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [isPaid, setIsPaid] = useState(
    individualCardDetails?.doneStatus || false
  );

  // State for controlling the modal
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (individualCardDetails?.purchases) {
      const totalAmount = individualCardDetails.purchases.reduce(
        (total, item) => total + item.total,
        0
      );

      const fetchedCommission = individualCardDetails.commission || 0;
      const fetchedKhajna = individualCardDetails.khajna || 0;

      setCommission(fetchedCommission);
      setKhajna(fetchedKhajna);
      setFinalAmount(totalAmount - fetchedCommission - fetchedKhajna);
    }
  }, [individualCardDetails]);

  useEffect(() => {
    if (individualCardDetails?.purchases) {
      const totalAmount = individualCardDetails.purchases.reduce(
        (total, item) => total + item.total,
        0
      );
      setFinalAmount(totalAmount - commission - khajna);
    }
  }, [commission, khajna, individualCardDetails]);

  const handleKhajnaChange = (event) => {
    const khajnaValue = parseFloat(event.target.value) || 0;
    setKhajna(khajnaValue);
  };

  const handleCommissionChange = (event) => {
    const commissionValue = parseFloat(event.target.value) || 0;
    setCommission(commissionValue);
  };

  const handlePayNow = async () => {
    if (khajna === 0) {
      const isConfirmed = window.confirm(
        "খাজনা ০। আপনি কি নিশ্চিত যে আপনি এগিয়ে যেতে চান?"
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
            name: individualCardDetails.farmerName,
            amount: finalAmount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Daily transaction save failed");
      }

      const updateResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/card-details-update-secondary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: individualCardDetails?._id,
            khajna,
            commission,
            totalAmountToBeGiven: finalAmount,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Error updating card details");
      }

      setIsPaid(true);
      setModalTitle("Success");
      setModalMessage(
        "Commissions and khajnas saved successfully and updated!"
      );

      setModalShow(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("An error occurred while processing the payment.");
      setModalShow(true);
    }
  };

  return (
    <>
      <div className="col-md-7">
        <div className="card-body" id="dokaner-slip" ref={slipRef}>
          <div>
            <h3 className="card-title m-2">
              {individualCardDetails?.farmerName}
            </h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>দোকানের নাম</th>
                  <th>পণ্যের নাম</th>
                  <th>পরিমাণ (কেজি)</th>
                  <th>দাম (টাকা/কেজি)</th>
                  <th>মোট (টাকা)</th>
                </tr>
              </thead>
              <tbody>
                {individualCardDetails?.purchases.map((item, index) => (
                  <tr key={index}>
                    <td>{item.shopName}</td>
                    <td>{item.stockName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    মোট (টাকা):
                  </td>
                  <td className="font-weight-bold">
                    {individualCardDetails?.purchases.reduce(
                      (total, item) => total + item.total,
                      0
                    )}
                  </td>
                </tr>

                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    কমিশন (টাকা):
                  </td>
                  <td className="commission font-weight-bold">
                    {isPaid ? (
                      commission
                    ) : (
                      <input
                        type="number"
                        value={commission}
                        onChange={handleCommissionChange}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    খাজনা (টাকা):
                  </td>
                  <td className="commission font-weight-bold">
                    {isPaid ? (
                      khajna
                    ) : (
                      <input
                        type="number"
                        value={khajna}
                        onChange={handleKhajnaChange}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right font-weight-bold">
                    চূড়ান্ত মোট (টাকা):
                  </td>
                  <td className="font-weight-bold">{finalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {isPaid ? (
          <button
            className="btn btn-primary m-2"
            onClick={() => handleDownload(slipRef)}
          >
            পিডিএফ ডাউনলোড করুন
          </button>
        ) : (
          <button className="btn btn-primary m-4" onClick={handlePayNow}>
            Pay now!
          </button>
        )}
      </div>

      <MessageModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => setModalShow(false)}
      />
    </>
  );
};

export default FarmerAndDokanSlip;
