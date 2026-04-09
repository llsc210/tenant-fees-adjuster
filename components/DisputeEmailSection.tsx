"use client";

import { useMemo, useState } from "react";
import type { Charge } from "@/lib/analyzeCharges";
import { generateDisputeEmail } from "@/lib/generateDisputeEmail";

type DisputeEmailSectionProps = {
  suspiciousCharges: Charge[];
};

/**
 * Generates and displays a copyable dispute email.
 * The content is based only on currently flagged suspicious charges.
 */
export default function DisputeEmailSection({ suspiciousCharges }: DisputeEmailSectionProps) {
  const [emailText, setEmailText] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const hasSuspiciousCharges = suspiciousCharges.length > 0;

  const helperText = useMemo(() => {
    if (hasSuspiciousCharges) return "Generate a draft email using flagged charges below.";
    return "No suspicious charges are currently flagged. Run analysis first or adjust rules in a later step.";
  }, [hasSuspiciousCharges]);

  const onGenerateEmail = () => {
    if (!hasSuspiciousCharges) return;
    setEmailText(generateDisputeEmail(suspiciousCharges));
    setCopied(false);
  };

  const onCopyEmail = async () => {
    if (!emailText) return;

    await navigator.clipboard.writeText(emailText);
    setCopied(true);
  };

  return (
    <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Dispute Email</h2>
      <p className="mt-2 text-sm text-slate-500">{helperText}</p>

      <button
        type="button"
        onClick={onGenerateEmail}
        disabled={!hasSuspiciousCharges}
        className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Generate Dispute Email
      </button>

      {emailText && (
        <div className="mt-4 space-y-3">
          <textarea
            readOnly
            value={emailText}
            className="h-72 w-full rounded-lg border border-slate-300 p-3 text-sm leading-6 text-slate-800"
          />

          <button
            type="button"
            onClick={onCopyEmail}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {copied ? "Copied!" : "Copy Email"}
          </button>
        </div>
      )}
    </section>
  );
}
