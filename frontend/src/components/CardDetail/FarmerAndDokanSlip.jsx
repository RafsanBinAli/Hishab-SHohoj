import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import banglaFont from "../../font/TiroBangla-Regular.ttf";
import NikoshGrameen from "../NikoshGrameen";
import { useEffect, useState } from "react";
const FarmerAndDokanSlip = ({ individualCardDetails, loadedData }) => {
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
    const totalAmount = loadedData?.purchases.reduce(
      (total, item) => total + item.total,
      0
    );

    setFinalAmount(totalAmount - commission - khajna);
  }, [commission, khajna, loadedData]);

  const handleDownload = () => {
    const doc = new jsPDF();
    // Load and add the Bangla font
    doc.addFileToVFS("TiroBangla-Regular.ttf", banglaFont);
    doc.addFont("TiroBangla-Regular.ttf", "normal");
    doc.setFont("TiroBangla-Regular", "normal");
    // Set font size
    doc.setFontSize(12);
    // Document content
    doc.text("হিসাবের বিবরণ", 14, 20);
    doc.text(`কৃষকের নাম: ${loadedData.farmerName}`, 14, 30);
    doc.text(`তারিখ: ${format(selectedDate, "dd MMMM, yyyy")}`, 14, 40);
    // Table headers
    const tableColumn = [
      { header: "দোকানের নাম", dataKey: "shopName" },
      { header: "পণ্যের নাম", dataKey: "stockName" },
      { header: "পরিমাণ (কেজি)", dataKey: "quantity" },
      { header: "দাম (টাকা/কেজি)", dataKey: "price" },
      { header: "মোট টাকা", dataKey: "total" },
    ];
    // Table rows
    const tableRows = loadedData.purchases.map((purchase) => ({
      shopName: purchase.shopName,
      stockName: purchase.stockName,
      quantity: purchase.quantity.toString(),
      price: purchase.price.toString(),
      total: (purchase.quantity * purchase.price).toString(),
    }));
    // Set table headers font
    doc.autoTable(tableColumn, tableRows, {
      startY: 50,
      margin: { top: 50 },
      styles: { font: "NikoshGrameen", fontStyle: "normal" },
      columnStyles: {
        0: { fontStyle: "normal" },
        1: { fontStyle: "normal" },
        2: { fontStyle: "normal" },
        3: { fontStyle: "normal" },
        4: { fontStyle: "normal" },
      },
    });
    // Additional texts
    doc.text(
      `মোট টাকা (টাকা): ${loadedData.purchases.reduce(
        (total, item) => total + item.total,
        0
      )}`,
      14,
      doc.autoTable.previous.finalY + 10
    );
    doc.text(
      `কমিশন (টাকা): ${commission}`,
      14,
      doc.autoTable.previous.finalY + 20
    );
    doc.text(`খাজনা (টাকা): ${khajna}`, 14, doc.autoTable.previous.finalY + 30);
    doc.text(
      `ফাইনাল এমাউন্ট (টাকা): ${finalAmount}`,
      14,
      doc.autoTable.previous.finalY + 40
    );
    doc.save("farmer-slip.pdf");
  };
  console.log("individual Card Details", individualCardDetails);
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
                  <input
                    type="number"
                    value={commission}
                    onChange={handleCommissionChange}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="4" className="text-right font-weight-bold">
                  Khajna(টাকা):
                </td>

                <td className="commission font-weight-bold">
                  <input
                    type="number"
                    value={khajna}
                    onChange={handleKhajnaChange}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="4" className="text-right font-weight-bold">
                  চূড়ান্ত মোট (টাকা):
                </td>
                <td className="font-weight-bold">{finalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="btn btn-primary mt-2 mb-2" onClick={handleDownload}>
          পিডিএফ ডাউনলোড করুন
        </button>
      </div>
    </>
  );
};
export default FarmerAndDokanSlip;
