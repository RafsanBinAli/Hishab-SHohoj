import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const handleDownload = (slipRef) => {
  // Convert the element referenced by slipRef to a canvas using html2canvas
  html2canvas(slipRef.current).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();

    // A4 size dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;

    // Set margins in mm
    const margin = 15;
    const imgWidth = pageWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    // Add the image content to the PDF with margins
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 2 * margin;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 2 * margin;
    }

    pdf.save("slip-details.pdf");
  });
};

export default handleDownload;
