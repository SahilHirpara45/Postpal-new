import React from "react";
import { Button, Typography, Box, Container } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import img1 from "../../../assets/images/dummyimg1.png";
import img2 from "../../../assets/images/dummyimg1.png";
import img3 from "../../../assets/images/dummyimg1.png";

const IncidentReport = () => {
  const generatePdf = () => {
    try {
      const doc = new jsPDF();
      console.log(doc.previousAutoTable.finalY);
      const pageWidth = doc.internal.pageSize.getWidth(); // Get the page width

      // Set font size for the title
      doc.setFontSize(18);

      // Center the title manually by calculating half the page width and offset for the string
      const title = "Incident Report Example";
      doc.text(title, pageWidth / 2, 22, { align: "center" }); // Centered text using align option

      // Set font size for the rest of the document
      doc.setFontSize(12);

      // doc.setFontSize(18);
      // doc.text("Incident Report Example", 14, 22);
      // doc.setFontSize(12);

      doc.autoTable({
        startY: 30,
        head: [["Audit"]],
        body: [[""]],
        theme: "plain",
        headStyles: {
          halign: "center",
        },
      });

      doc.autoTable({
        margin: 30,
        head: [["Question", "Response", "Details"]],
        body: [
          [{ content: "Incident Details", colSpan: 3 }],
          [
            { content: "Enter job description" },
            { content: "Stacking crates in warehouse", colSpan: 2 },
          ],
          [
            { content: "Date and time of incident" },
            { content: "15/3/18, 6:27 pm", colSpan: 2 },
          ],
          [
            { content: "What was the incident/near miss?" },
            {
              content:
                "Member of staff suffered leg trauma when moving crate packaging after the forklift was damaged. Condition became evident after the person reported leg pain to his supervisor.",
              colSpan: 2,
            },
          ],
          [
            { content: "Were there any injuries?" },
            {
              content: "Yes",
            },
          ],
          [
            { content: "Description of injury" },
            {
              content: "Leg trauma",
              colSpan: 2,
            },
          ],
          [{ content: "Take photo of injury", colSpan: 3 }],
          [{ content: "", colSpan: 3 }],
          [
            { content: "Was there any damage to property or plant?" },
            {
              content: "Yes",
            },
          ],
          [
            { content: "Description of damage" },
            {
              content:
                "Forklift that usually performs tasks was damaged by somebody and not reported",
              colSpan: 2,
            },
          ],
          [{ content: "Take photo of damage", colSpan: 3 }],
          [{ content: "", colSpan: 3 }],
          [
            { content: "What caused the incident?" },
            {
              content:
                "Forklift was not used to stack crates as it was temporarily out of order.",
              colSpan: 2,
            },
          ],
          [
            {
              content:
                "Take photo of surrounding environment including any annotations",
              colSpan: 3,
            },
          ],
          [
            {
              content:
                "What actions will be taken to eliminate future repeats of the incident?",
            },
            {
              content:
                "Proper training scheduled for handling of heavy crates and wearing of PPE",
              colSpan: 2,
            },
          ],
          [
            { content: "Management comments" },
            {
              content:
                "Advised staff member that they should have reported this immediately. Broader staff has been notified",
              colSpan: 2,
            },
          ],
        ],
        theme: "grid",
        styles: {
          lineWidth: 0.3, // line width for the entire table
          lineColor: [0, 0, 0], // RGB color for black
        },
        headStyles: {
          fillColor: [255, 192, 203], // RGB color for red
          textColor: [0, 0, 0], // RGB color for white text
          lineWidth: 0.3, // line width for the header cells
        },
        // headStyles: {
        //   fillColor: [255, 0, 0], // RGB color for red
        //   textColor: [255, 255, 255], // RGB color for white text
        // },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 30 },
          2: { cellWidth: 60 },
        },
        didParseCell: function (data) {
          if (data.row.index === 7 || data.row.index === 11) {
            // Adjust row height if it's the one with images
            data.row.height = 20; // Adjust as needed
          }
          if (
            (data.row.index === 4 && data.column.index === 1) ||
            (data.row.index === 8 && data.column.index === 1)
          ) {
            data.cell.styles.fillColor = [255, 0, 0];
            data.cell.styles.textColor = [0, 0, 0];
          }
        },
        didDrawCell: (data) => {
          if (data.row.index === 7 && data.column.index === 0) {
            const imageSpacing = 5; // Space between images

            // Images array
            const images = [img1, img2, img3];
            const labels = ["Image 1", "Image 2", "Image 3"];

            // Calculate x positions for each image
            images.forEach((image, index) => {
              const xPosition = data.cell.x + 3 + index * (20 + imageSpacing);
              const yPosition = data.cell.y + 2; // Slight offset from top of the cell
              doc.addImage(image, "PNG", xPosition, yPosition, 10, 10);
              doc.text(labels[index], xPosition, yPosition + 10 + 5);
            });
          }
          if (data.row.index === 11 && data.column.index === 0) {
            const imageSpacing = 5; // Space between images

            // Images array
            const images = [img1];
            const labels = ["Image 1"];

            // Calculate x positions for each image
            images.forEach((image, index) => {
              const xPosition = data.cell.x + 3 + index * (20 + imageSpacing);
              const yPosition = data.cell.y + 2; // Slight offset from top of the cell
              doc.addImage(image, "PNG", xPosition, yPosition, 10, 10);
              doc.text(labels[index], xPosition, yPosition + 10 + 5);
            });
          }
        },
      });

      doc.save("incident-report.pdf");
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
  };

  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        onClick={generatePdf}
        sx={{ marginTop: 2 }}
      >
        Generate PDF
      </Button>
    </Container>
  );
};

export default IncidentReport;
