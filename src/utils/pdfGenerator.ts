import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Patient, LabReport, MedicationItem, ClinicalReviewSummary } from '../types/clinical.ts';

export const generateClinicalPdf = (
  patient: Patient,
  labReport: LabReport,
  medications: MedicationItem[],
  summary: ClinicalReviewSummary,
  attendingDoctor: string = 'Dr. Rajesh K. Varma, MD, DM'
) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(33, 75, 76); // #214b4c
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(253, 251, 247); // warm ivory
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AAROGYA MULTISPECIALITY HOSPITAL', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Haute-Clinical Multimodal Diagnostic Intelligence & Decision Support Summary', 14, 18);
  doc.text('Indiranagar, Bengaluru, Karnataka - 560038 | Tel: +91 80 4921 8800 | NABL / NABH Accredited', 14, 23);

  // Patient Demographic Strip
  doc.setFillColor(244, 240, 232);
  doc.rect(14, 33, 182, 22, 'F');

  doc.setTextColor(24, 26, 46);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient: ${patient.name}`, 18, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Age/Gender: ${patient.age} Y / ${patient.gender}`, 18, 46);
  doc.text(`Blood Group: ${patient.bloodGroup}`, 18, 51);

  doc.text(`UHID: ${patient.uhid}`, 90, 40);
  doc.text(`ABHA: ${patient.abhaAddress || '82-4912-3019-4821'}`, 90, 46);
  doc.text(`City: ${patient.city}, ${patient.state}`, 90, 51);

  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')} IST`, 150, 40);
  doc.text(`BP: ${patient.vitals.bloodPressure}`, 150, 46);
  doc.text(`Attending: ${attendingDoctor}`, 150, 51);

  let currentY = 62;

  // Synthesis Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(33, 75, 76);
  doc.text('1. CLINICAL SYNTHESIS & RISK STRATIFICATION', 14, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  const splitSynthesis = doc.splitTextToSize(summary.synthesis, 182);
  doc.text(splitSynthesis, 14, currentY);
  currentY += splitSynthesis.length * 4.2 + 4;

  // Key Findings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(33, 75, 76);
  doc.text('Key Diagnostic Findings:', 14, currentY);
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  summary.key_findings.forEach((finding) => {
    doc.text(`• ${finding}`, 18, currentY);
    currentY += 4.2;
  });
  currentY += 3;

  // Lab Results Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(33, 75, 76);
  doc.text('2. LABORATORY INVESTIGATIONS (SUNRISE DIAGNOSTIC LABS)', 14, currentY);
  currentY += 4;

  const labRows = labReport.tests.map((t) => [
    t.name,
    t.category,
    `${t.value} ${t.unit}`,
    t.referenceRange,
    t.status.toUpperCase(),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Investigation', 'Panel', 'Observed Value', 'Reference Range', 'Status']],
    body: labRows,
    theme: 'striped',
    headStyles: { fillColor: [33, 75, 76], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 30, 30] },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      currentY = data.cursor?.y || currentY;
    },
  });

  currentY += 8;

  // Medications Table with Indian Notation
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(33, 75, 76);
  doc.text('3. CURRENT PHARMACOTHERAPY & SAFETY ALERTS', 14, currentY);
  currentY += 4;

  const medRows = medications.map((m) => [
    m.name,
    m.dosage,
    m.frequency,
    m.timing,
    `INR ${m.inrPrice.toFixed(2)}`,
    m.safetyWarning ? 'ALERT' : 'Normal',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Medication / Formulation', 'Dose', 'Freq', 'Timing', 'MRP', 'Safety Status']],
    body: medRows,
    theme: 'grid',
    headStyles: { fillColor: [83, 98, 81], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 30, 30] },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      currentY = data.cursor?.y || currentY;
    },
  });

  currentY += 8;

  // Indian Guidelines Alignment
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(33, 75, 76);
  doc.text('RSSDI 2024 & CDSCO Guidance Alignment:', 14, currentY);
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  const splitRssdi = doc.splitTextToSize(summary.rssdi_guideline_alignment, 182);
  doc.text(splitRssdi, 14, currentY);
  currentY += splitRssdi.length * 3.8 + 8;

  // Signature Block
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setDrawColor(180, 180, 180);
  doc.line(14, currentY, 196, currentY);
  currentY += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Disclaimer: Certified under National Medical Commission (NMC) Digital Healthcare Guidelines. AI CDSS operates in assistive advisory capacity. Final therapeutic responsibility rests with attending licensed clinician.',
    14,
    currentY,
    { maxWidth: 140 }
  );

  doc.setFont('helvetica', 'bold');
  doc.text('Attending Physician Signature:', 150, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(attendingDoctor, 150, currentY + 5);
  doc.text('Reg #: KMC-54289-2004', 150, currentY + 9);

  doc.save(`MEDIGEN_${patient.uhid}_Clinical_Summary.pdf`);
};
