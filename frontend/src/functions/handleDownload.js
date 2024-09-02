import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const handleDownload = (slipRef, title) => {
  const pdf = new jsPDF({
    orientation: "portrait", // Choose portrait or landscape orientation
    unit: "mm",
    format: "a4", // You can use "a4" or customize the size
  });

  // Custom heading added to the PDF using the passed title parameter
  pdf.setFontSize(18);
  pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 20, {
    align: "center",
  });

  // Calculate the starting Y position after the heading
  let yPosition = 30;

  html2canvas(slipRef.current).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    // Calculate dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // 10mm margin on both sides
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = yPosition;
    let heightLeft = imgHeight;

    // Add the first page
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - position;

    // Add more pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + yPosition;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF with a dynamic filename
    const fileName = `${title}.pdf`;
    pdf.save(fileName);
  });
};

export default handleDownload;
