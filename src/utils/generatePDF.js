// utils/generatePDF.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (quoteDetails) => {
  const {
    quoteName,
    packageName,
    packageDescription,
    packageServices,
    windowCost,
    sqftCost,
    bathCost,
    carpetCost,
    packageCost,
  } = quoteDetails;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(`Congratulations ${quoteName}, you lucky person!`, 20, 20);
  doc.setFontSize(14);
  doc.text("We've decided to accept your quote!", 20, 30);

  doc.setFontSize(16);
  doc.text('Mission Statement', 20, 50);
  doc.setFontSize(12);
  doc.text('Our mission is to provide exceptional cleaning services to our valued customers.', 20, 60);

  doc.setFontSize(16);
  doc.text('Package Details', 20, 80);
  doc.setFontSize(12);
  doc.text(`Package: ${packageName}`, 20, 90);

  const descriptionLines = doc.splitTextToSize(`Description: ${packageDescription}`, 180);
  doc.text(descriptionLines, 20, 100);

  let servicesStartY = 100 + (descriptionLines.length * 10);
  doc.text('Services:', 20, servicesStartY);

  packageServices.forEach((service, index) => {
    doc.text(`- ${service}`, 30, servicesStartY + 10 + (index * 10));
  });

  let quoteStartY = servicesStartY + 20 + (packageServices.length * 10);
  doc.setFontSize(16);
  doc.text('Quote Breakdown', 20, quoteStartY);
  doc.autoTable({
    startY: quoteStartY + 10,
    head: [['Description', 'Cost']],
    body: [
      ['Windows', `$${windowCost}`],
      ['Square Feet', `$${sqftCost}`],
      ['Bathrooms', `$${bathCost}`],
      ['Carpets', `$${carpetCost}`],
      ['Total Cost', `$${packageCost}`],
    ],
  });

  doc.save('quote.pdf');
};

export default generatePDF;
