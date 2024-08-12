import { useEffect, useState } from "react";
import handleDownload from "../../functions/handleDownload";
import NikoshGrameen from "../NikoshGrameen";

const FarmerAndDokanSlip = ({ individualCardDetails }) => {
  console.log("Individual Card Details:", individualCardDetails);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [commission, setCommission] = useState(0);
  const [khajna, setKhajna] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const handleKhajnaChange = (event) => {
    const khajnaValue = event.target.value;
    setKhajna(khajnaValue);
  };

  const handleCommissionChange = (event) => {
    const commissionValue = event.target.value;
    setCommission(commissionValue);
  };

  useEffect(() => {
    const totalAmount = individualCardDetails?.purchases.reduce(
      (total, item) => total + item.total,
      0
    );

    setFinalAmount(totalAmount - commission - khajna);
  }, [commission, khajna, individualCardDetails]);

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
            name: individualCardDetails.farmerName,
            amount: finalAmount,
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
            id: individualCardDetails?._id,
            khajna,
            commission,
            totalAmountToBeGiven: finalAmount,
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

  return (
    <>
      <div className="col-md-7">
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
                <td className="font-weight-bold">
                  {individualCardDetails.totalAmountToBeGiven}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {individualCardDetails?.doneStatus && (
          <button
            className="btn btn-primary m-2"
            onClick={() =>
              handleDownload({
                individualCardDetails,
                selectedDate,
                commission,
                khajna,
                finalAmount,
              })
            }
          >
            পিডিএফ ডাউনলোড করুন
          </button>
        )}
        {!individualCardDetails.doneStatus && (
          <button className="btn btn-primary m-2" onClick={handlePayNow}>
            Pay now!
          </button>
        )}
      </div>
    </>
  );
};
export default FarmerAndDokanSlip;
