import { useEffect, useState, useRef } from "react";
import handleDownload from "../../functions/handleDownload";

const FarmerAndDokanSlip = ({ individualCardDetails }) => {
  const slipRef = useRef(); // Create a ref to capture the slip content
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [commission, setCommission] = useState(0);
  const [khajna, setKhajna] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

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
    } catch (error) {
      console.error("Error saving daily transaction:", error);
      alert("Daily transaction save failed");
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
      const data = await updateResponse.json();
      alert("Commissions and khajnas saved successfully and updated!");
    } catch (error) {
      console.error("Error updating card details:", error);
      alert("Error updating card details");
    }
  };

  return (
    <>
      <div className="col-md-7" ref={slipRef}>
        <div className="card-body" id="dokaner-slip">
          <h5 className="header-title">কৃষকের Slip</h5>
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
                  {individualCardDetails.doneStatus ? (
                    individualCardDetails.commission
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
                  {individualCardDetails.doneStatus ? (
                    individualCardDetails.khajna
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

        {individualCardDetails?.doneStatus && (
          <button
            className="btn btn-primary m-2"
            onClick={() => handleDownload(slipRef)}
          >
            পিডিএফ ডাউনলোড করুন
          </button>
        )}
        {!individualCardDetails.doneStatus && (
          <button className="btn btn-primary m-4" onClick={handlePayNow}>
            Pay now!
          </button>
        )}
      </div>
    </>
  );
};

export default FarmerAndDokanSlip;
