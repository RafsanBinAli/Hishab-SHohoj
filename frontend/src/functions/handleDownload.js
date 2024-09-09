import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const handleDownload = (slipRef, title) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.setFontSize(18);
  pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 20, {
    align: "center",
  });

  const element = slipRef.current;

  // Temporarily adjust the table to fit its full content
  const originalStyles = element.style.cssText;
  element.style.width = "auto"; // Adjust width to fit content
  element.style.overflowX = "visible"; // Ensure no horizontal scroll

  html2canvas(element, { useCORS: true })
    .then((canvas) => {
      // Restore original styles
      element.style.cssText = originalStyles;

      const imgData = canvas.toDataURL("image/png");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20; // 10mm margin on both sides
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPosition = 30;
      let heightLeft = imgHeight;
      let position = yPosition;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - position;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + yPosition;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${title}.pdf`;
      pdf.save(fileName);
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
    });
};

export default handleDownload;
