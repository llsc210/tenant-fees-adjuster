export type Charge = {
  title: string;
  amount: number;
  explanation: string;
  suspicious: boolean;
  reason?: string;
};

/**
 * Converts extracted statement text into a basic charge list.
 * This is intentionally rule-based and beginner-friendly for MVP Step 3.
 */
export function analyzeChargesFromText(extractedText: string): Charge[] {
  const lines = extractedText.split("\n").map((line) => line.trim());
  const charges: Charge[] = [];

  // Pull lines in the format: "- Charge Name: $123.45"
  for (const line of lines) {
    const chargeMatch = line.match(/^-\s*(.+?):\s*\$([0-9,]+(?:\.[0-9]{2})?)$/);
    if (!chargeMatch) continue;

    const title = chargeMatch[1].trim();
    const amount = Number(chargeMatch[2].replaceAll(",", ""));

    charges.push({
      title,
      amount,
      explanation: getSimpleExplanation(title),
      suspicious: false,
    });
  }

  // Apply simple flagging rules after basic parsing.
  return applySuspiciousRules(charges);
}

function getSimpleExplanation(title: string): string {
  const name = title.toLowerCase();

  if (name.includes("rent")) return "Your base monthly housing payment.";
  if (name.includes("water") || name.includes("sewer")) return "Utility billing for water and sewer services.";
  if (name.includes("trash")) return "Waste collection service fee.";
  if (name.includes("late")) return "Penalty charged for paying after the due date.";
  if (name.includes("clean")) return "Fee for cleaning or restoring the unit.";
  if (name.includes("protection")) return "Optional or bundled protection-related service fee.";

  return "General statement charge listed by the property manager.";
}

function applySuspiciousRules(charges: Charge[]): Charge[] {
  const titleCount = new Map<string, number>();

  for (const charge of charges) {
    const key = charge.title.toLowerCase();
    titleCount.set(key, (titleCount.get(key) ?? 0) + 1);
  }

  const utilities = ["water", "sewer", "trash", "electric", "gas", "utility"];
  const utilityCharges = charges.filter((charge) =>
    utilities.some((word) => charge.title.toLowerCase().includes(word)),
  );

  return charges.map((charge) => {
    const title = charge.title.toLowerCase();

    if ((titleCount.get(title) ?? 0) > 1) {
      return {
        ...charge,
        suspicious: true,
        reason: "Possible duplicate fee with the same label appears more than once.",
      };
    }

    if (title.includes("misc") || title.includes("admin") || title.includes("processing")) {
      return {
        ...charge,
        suspicious: true,
        reason: "Label is vague and may need itemized justification.",
      };
    }

    if (title.includes("protection") && charges.filter((c) => c.title.toLowerCase().includes("protection")).length > 1) {
      return {
        ...charge,
        suspicious: true,
        reason: "Multiple protection-related fees found in one statement.",
      };
    }

    if (utilityCharges.length > 0 && utilities.some((word) => title.includes(word)) && charge.amount >= 150) {
      return {
        ...charge,
        suspicious: true,
        reason: "Utility amount looks unusually high and may need verification.",
      };
    }

    if (title.includes("move-out") || title.includes("post move-out")) {
      return {
        ...charge,
        suspicious: true,
        reason: "Charge appears to be assessed after move-out and should be reviewed carefully.",
      };
    }

    return charge;
  });
}
