// handleDownload.js
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import banglaFont from "../font/TiroBangla-Regular.ttf";

const handleDownload = (individualCardDetails, selectedDate, commission, khajna, finalAmount) => {
  const doc = new jsPDF();

  // Load and add the Bangla font
  doc.addFileToVFS("TiroBangla-Regular.ttf", banglaFont);
  doc.addFont("TiroBangla-Regular.ttf", "normal");
  doc.setFont("TiroBangla-Regular", "normal");

  // Set font size
  doc.setFontSize(12);

  // Document content
  doc.text("হিসাবের বিবরণ", 14, 20);
  doc.text(`কৃষকের নাম: ${individualCardDetails.farmerName}`, 14, 30);
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
  const tableRows = individualCardDetails.purchases.map((purchase) => ({
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
    `মোট টাকা (টাকা): ${individualCardDetails.purchases.reduce(
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

export default handleDownload;
