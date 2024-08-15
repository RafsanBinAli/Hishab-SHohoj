import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const handleDownload = (slipRef) => {
  // Convert the element referenced by slipRef to a canvas using html2canvas
  html2canvas(slipRef.current).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();

    // Adjust the PDF size to fit the content
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add the image content to the PDF
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("slip-details.pdf");
  });
};

export default handleDownload;
