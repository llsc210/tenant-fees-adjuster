import type { Charge } from "@/lib/analyzeCharges";

/**
 * Builds a professional dispute email from suspicious charges.
 */
export function generateDisputeEmail(suspiciousCharges: Charge[]): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const chargeLines = suspiciousCharges
    .map((charge) => {
      const reason = charge.reason ? ` (${charge.reason})` : "";
      return `- ${charge.title}: $${charge.amount.toFixed(2)}${reason}`;
    })
    .join("\n");

  return [
    today,
    "",
    "Subject: Request for Itemized Review of Statement Charges",
    "",
    "Dear Property Management Team,",
    "",
    "I am writing to formally dispute several charges listed on my recent statement.",
    "Please provide an itemized explanation and supporting documentation for the following entries:",
    "",
    chargeLines,
    "",
    "I respectfully request that these charges be reviewed and corrected if they were applied in error.",
    "Until this review is complete, please confirm that these disputed amounts will not be sent to collections or reported negatively.",
    "",
    "Thank you for your prompt attention to this matter. I look forward to your written response.",
    "",
    "Sincerely,",
    "[Your Full Name]",
    "[Unit Number / Address]",
    "[Phone Number]",
    "[Email Address]",
  ].join("\n");
}
