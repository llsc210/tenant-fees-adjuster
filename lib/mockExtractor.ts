/**
 * Mock text extraction helper for Step 2.
 *
 * Why mock?
 * Real OCR/PDF parsing can add heavy dependencies and backend setup.
 * This keeps the MVP moving while preserving the same UI/data flow.
 */
export async function extractStatementTextMock(file: File): Promise<string> {
  // Simulate async processing time so the UI behaves like real extraction.
  await new Promise((resolve) => setTimeout(resolve, 900));

  const fileTypeLabel = file.type.includes("pdf") ? "PDF" : "image";

  return [
    `Source file: ${file.name} (${fileTypeLabel})`,
    "Property: Greenview Apartments",
    "Tenant: Jordan Smith",
    "Statement Date: March 15, 2026",
    "",
    "Charges:",
    "- Monthly Rent: $1850.00",
    "- Water / Sewer: $168.50",
    "- Trash Service: $22.00",
    "- Late Fee: $175.00",
    "- Late Fee: $175.00",
    "- Protection Plan: $14.99",
    "- Utility Protection Plan: $12.50",
    "- Admin Fee: $35.00",
    "- Post Move-Out Processing: $90.00",
    "",
    "Notes:",
    "Late fee and utility/protection lines should be reviewed for fairness.",
  ].join("\n");
}
