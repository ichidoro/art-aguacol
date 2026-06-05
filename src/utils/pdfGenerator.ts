import { jsPDF } from "jspdf";
import { ComparisonReport } from "../types";

const convertToPngBase64 = (dataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl) {
      resolve("");
      return;
    }
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#1e293b"; // Primary slate backdrop
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } else {
          resolve(dataUrl);
        }
      } catch (e) {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.crossOrigin = "anonymous";
    img.src = dataUrl;
  });
};

export async function downloadReportPDF(report: ComparisonReport, customFilename?: string): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin; // 180mm

  let y = 15;

  const checkPageOverflow = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // --- HEADER BAND ---
  doc.setFillColor(15, 23, 42); // slate-900 (#0f172a)
  doc.rect(margin, y, contentWidth, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text("ETIQUETAS AGUACOL - REPORTE DE AUDITORÍA GRÁFICA", margin + 5, y + 9);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(110, 231, 183); // emerald-300
  doc.text("SISTEMA DE CONTROL DE CALIDAD Y COMPARACIÓN CON INTELIGENCIA ARTIFICIAL", margin + 5, y + 15);

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`REGISTRO COMPLETO`, margin + 130, y + 9);
  doc.text(`ID: ${report.id}`, margin + 130, y + 15);

  y += 30;

  // --- GENERAL NOTIFICATION STENCIL ---
  checkPageOverflow(40);
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, y, contentWidth, 28, "F");
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.rect(margin, y, contentWidth, 28, "S");

  const shortOldName = report.oldFileName ? (report.oldFileName.length > 50 ? report.oldFileName.substring(0, 47) + "..." : report.oldFileName) : "Referencia";
  const shortNewName = report.newFileName ? (report.newFileName.length > 50 ? report.newFileName.substring(0, 47) + "..." : report.newFileName) : "Lote Nuevo";

  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("INFORMACIÓN GENERAL DEL LOTE:", margin + 5, y + 6);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Fecha de escaneo: ${report.timestamp}`, margin + 5, y + 12);
  doc.text(`Patrón de Referencia: ${shortOldName}`, margin + 5, y + 17);
  doc.text(`Muestra del Proveedor: ${shortNewName}`, margin + 5, y + 22);

  // Verdict block
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.text("MÉTRICA DE SIMILITUD:", margin + 115, y + 6);
  doc.setFontSize(14);
  
  const score = report.results.similarityScore;
  if (score >= 90) {
    doc.setTextColor(16, 185, 129); // emerald-500
  } else if (score >= 80) {
    doc.setTextColor(245, 158, 11); // amber-500
  } else {
    doc.setTextColor(239, 68, 68); // rose-500
  }
  doc.text(`${score}% COINCIDENCIA`, margin + 115, y + 12);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("VERDICTO QA:", margin + 115, y + 18);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  if (report.results.isApproved) {
    doc.setTextColor(16, 185, 129);
    doc.text("APROBADO PARA PRODUCCIÓN", margin + 115, y + 23);
  } else {
    doc.setTextColor(239, 68, 68);
    doc.text("RECHAZADO PARA CORRECCIÓN", margin + 115, y + 23);
  }

  y += 34;

  // --- SPECIAL LIMIT VERIFICATION INSTRUCTIONS (MAIN LABEL FOCUS) ---
  checkPageOverflow(26);
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.rect(margin, y, contentWidth, 18, "F");
  doc.setDrawColor(16, 185, 129); // emerald-500 bounds
  doc.rect(margin, y, contentWidth, 18, "S");
  
  doc.setTextColor(15, 116, 60); // emerald-800
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("REGLA CLAVE DE ENFOQUE EXCLUSIVO:", margin + 5, y + 5);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("Este reporte evalúa exclusivamente la Coherencia de la ETIQUETA PRINCIPAL, ignorando", margin + 5, y + 10);
  doc.text("cualquier panel desglosado posterior ausente para evitar falsas anomalías externas de formato.", margin + 5, y + 14);

  y += 24;



  // --- DISCREPANCIES GRID HEADER ---
  checkPageOverflow(20);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("DETALLES DE DISCREPANCIAS E INCOHERENCIAS ENCONTRADAS:", margin, y + 4);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 6, margin + contentWidth, y + 6);
  
  y += 10;

  if (report.results.discrepancyAlerts.length === 0) {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Inspección limpia. No se identificaron desviaciones tipográficas, cromáticas ni geométricas.", margin + 5, y + 3);
    y += 10;
  } else {
    for (const alert of report.results.discrepancyAlerts) {
      const isHigh = alert.severity === "Alta";
      const isMed = alert.severity === "Media";
      
      const splittedDesc = doc.splitTextToSize(alert.description, contentWidth - 8);
      const descHeight = splittedDesc.length * 3.4;

      const oldLabelText = `Original: ${alert.oldValue || "N/A"}`;
      const newLabelText = `Lote Nuevo: ${alert.newValue || "N/A"}`;
      
      const splittedOld = doc.splitTextToSize(oldLabelText, 82 - 6);
      const splittedNew = doc.splitTextToSize(newLabelText, 86 - 6);
      const valuesHeight = Math.max(splittedOld.length, splittedNew.length) * 3.4 + 4;

      // 10 padding/headers, descHeight, 2 padding, valuesHeight, 4 padding
      const alertBoxHeight = 10 + descHeight + 2 + valuesHeight + 4;
      
      checkPageOverflow(alertBoxHeight + 5);
      
      doc.setFillColor(isHigh ? 254 : isMed ? 255 : 248, isHigh ? 242 : isMed ? 251 : 250, isHigh ? 242 : isMed ? 240 : 252);
      doc.rect(margin, y, contentWidth, alertBoxHeight, "F");
      doc.setDrawColor(isHigh ? 252 : isMed ? 253 : 226, isHigh ? 165 : isMed ? 224 : 232, isHigh ? 165 : isMed ? 71 : 240);
      doc.rect(margin, y, contentWidth, alertBoxHeight, "S");

      // Draw Header Text
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(isHigh ? 185 : isMed ? 180 : 71, isHigh ? 28 : isMed ? 83 : 85, isHigh ? 28 : isMed ? 9 : 105);
      doc.text(`[RIESGO ${alert.severity.toUpperCase()}] ${alert.title}`, margin + 4, y + 5);
      
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(7.5);
      doc.setFont("Helvetica", "normal");
      doc.text(`Ref: ${alert.id} | Categoría: ${alert.category}`, margin + 120, y + 5);

      // Draw Description Text
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      // Draw line-by-line to prevent overlap
      splittedDesc.forEach((line: string, index: number) => {
        doc.text(line, margin + 4, y + 9 + index * 3.4);
      });

      const valueY = y + 9 + descHeight + 2;

      // Value Contrast Panel Left
      doc.setFillColor(255, 255, 255);
      doc.rect(margin + 4, valueY, 82, valuesHeight, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin + 4, valueY, 82, valuesHeight, "S");
      
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(7.2);
       // Draw line-by-line to prevent overlap
      splittedOld.forEach((line: string, index: number) => {
        doc.text(line, margin + 6, valueY + 3.2 + index * 3.4);
      });

      // Value Contrast Panel Right
      doc.setFillColor(255, 255, 255);
      doc.rect(margin + 90, valueY, 86, valuesHeight, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin + 90, valueY, 86, valuesHeight, "S");
      
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(isHigh ? 220 : 15, isHigh ? 38 : 23, isHigh ? 38 : 42);
      doc.setFontSize(7.2);
      // Draw line-by-line to prevent overlap
      splittedNew.forEach((line: string, index: number) => {
        doc.text(line, margin + 92, valueY + 3.2 + index * 3.4);
      });

      y += alertBoxHeight + 5;
    }
  }

  // --- SECOND PAGE: PHOTO-METRIC ATTACHMENTS AND METRICS ---
  doc.addPage();
  y = 20;

  // DETAILED BLOCKS
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("INFORME COMPACTO DE ANÁLISIS POR SUBSISTEMA:", margin, y + 4);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 6, margin + contentWidth, y + 6);

  y += 11;

  const analysisCards = [
    { title: "🎨 COLOR / TONALIDADES & BRILLOS DE FONDO:", text: report.results.detailedAnalysis.color },
    { title: "📝 TIPOGRAFÍA & SIMILITUD DE LETRAS:", text: report.results.detailedAnalysis.typography },
    { title: "📏 DIMENSIÓN, PROPORCIONES & ALINEADOS:", text: report.results.detailedAnalysis.proportions },
    { title: "📦 INTEGRIDAD DE MARCA, LOGOS E ISOTIPOS:", text: report.results.detailedAnalysis.images },
  ];

  for (const card of analysisCards) {
    const splittedCardText = doc.splitTextToSize(card.text || "No registrado.", contentWidth - 8);
    const cardTextHeight = splittedCardText.length * 3.4;
    const cardBoxHeight = 8 + cardTextHeight + 4;

    checkPageOverflow(cardBoxHeight + 5);
    
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, cardBoxHeight, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, cardBoxHeight, "S");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(card.title, margin + 4, y + 5);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    // Draw line-by-line to prevent detailed analysis overlap
    splittedCardText.forEach((line: string, index: number) => {
      doc.text(line, margin + 4, y + 9 + index * 3.4);
    });

    y += cardBoxHeight + 4;
  }

  // EVIDENCIA FOTOGRÁFICA INTERACTIVA
  checkPageOverflow(85);
  y += 2;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("COMPROBACIÓN VISUAL ASOCIADA (EVIDENCIA DE ENFOQUE):", margin, y + 4);
  doc.line(margin, y + 6, margin + contentWidth, y + 6);

  doc.setFont("Helvetica", "oblique");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Los recuadros numerados detallan de manera georreferenciada cada inconsistencia descrita en la sección anterior.", margin, y + 10);

  y += 12;

  try {
    const oldBase64 = await convertToPngBase64(report.oldImage);
    const newBase64 = await convertToPngBase64(report.newImage);

    // Box left
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, y, 84, 52, "F");
    if (oldBase64) {
      doc.addImage(oldBase64, "JPEG", margin + 1, y + 1, 82, 50);
      
      // Draw OLD boundaries (Reference markers) in Green
      if (report.results.discrepancyAlerts) {
        report.results.discrepancyAlerts.forEach((alert) => {
          if (alert.boxOld) {
            const bx = margin + 1 + (alert.boxOld.x / 100) * 82;
            const by = y + 1 + (alert.boxOld.y / 100) * 50;
            const bw = (alert.boxOld.w / 100) * 82;
            const bh = (alert.boxOld.h / 100) * 50;

            doc.setDrawColor(16, 185, 129); // emerald-500
            doc.setLineWidth(0.4);
            doc.rect(bx, by, Math.max(bw, 3), Math.max(bh, 3), "S");

            // label badge
            doc.setFillColor(16, 185, 129);
            doc.rect(bx, by - 3.2, 9, 3.2, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(5);
            doc.text(alert.id, bx + 1, by - 0.8);
          }
        });
      }
    }
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("ARTE DE APÓSITO ANTIGUO (PATRÓN)", margin, y + 56);
    
    const safeOldF = report.oldFileName ? (report.oldFileName.length > 50 ? report.oldFileName.substring(0, 47) + "..." : report.oldFileName) : "Referencia";
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(safeOldF, margin, y + 59);

    // Box right
    doc.setFillColor(15, 23, 42);
    doc.rect(margin + 94, y, 84, 52, "F");
    if (newBase64) {
      doc.addImage(newBase64, "JPEG", margin + 95, y + 1, 82, 50);

      // Draw NEW boundaries (Candidate/Error markers) in Red/Rose
      if (report.results.discrepancyAlerts) {
        report.results.discrepancyAlerts.forEach((alert) => {
          if (alert.boxNew) {
            const bx = margin + 95 + (alert.boxNew.x / 100) * 82;
            const by = y + 1 + (alert.boxNew.y / 100) * 50;
            const bw = (alert.boxNew.w / 100) * 82;
            const bh = (alert.boxNew.h / 100) * 50;

            doc.setDrawColor(239, 68, 68); // rose-500
            doc.setLineWidth(0.4);
            doc.rect(bx, by, Math.max(bw, 3), Math.max(bh, 3), "S");

            // label badge
            doc.setFillColor(239, 68, 68);
            doc.rect(bx, by - 3.2, 9, 3.2, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(5);
            doc.text(alert.id, bx + 1, by - 0.8);
          }
        });
      }
    }
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("CANDIDATO DE PROVEEDOR ACTUAL", margin + 94, y + 56);

    const safeNewF = report.newFileName ? (report.newFileName.length > 50 ? report.newFileName.substring(0, 47) + "..." : report.newFileName) : "Lote nuevo";
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(safeNewF, margin + 94, y + 59);

    y += 66;
  } catch (err) {
    y += 15;
  }

  // SIGNATURE COCKPIT
  checkPageOverflow(30);
  y += 5;
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.3);
  doc.line(margin + 10, y + 10, margin + 65, y + 10);
  doc.line(margin + 110, y + 10, margin + 165, y + 10);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Ingeniero de Calidad de Arte", margin + 20, y + 14);
  doc.text("Inspector Principal de Embalajes", margin + 112, y + 14);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(103, 116, 139);
  doc.text("Sello Operativo ETIQUETAS AGUACOL", margin + 21, y + 17);
  doc.text("División de Despacho Técnico / Tintas", margin + 111, y + 17);

  const sanitizedId = report.id.replace(/[^a-z0-9_-]/gi, "_");
  const finalFilename = customFilename && customFilename.trim() !== ""
    ? (customFilename.trim().endsWith(".pdf") ? customFilename.trim() : `${customFilename.trim()}.pdf`)
    : `Reporte_QA_Empaques_${sanitizedId}.pdf`;
  doc.save(finalFilename);
}
