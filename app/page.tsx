"use client";

import { useMemo, useState } from "react";
import ChargeBreakdown from "@/components/ChargeBreakdown";
import DisputeEmailSection from "@/components/DisputeEmailSection";
import FileUploadCard from "@/components/FileUploadCard";
import { analyzeChargesFromText } from "@/lib/analyzeCharges";

/**
 * Homepage for RentShield MVP.
 * Step 4 adds a dispute email generator based on suspicious charges.
 */
export default function Home() {
  const [extractedText, setExtractedText] = useState<string>("");

  // Recompute only when extracted text changes.
  const charges = useMemo(() => analyzeChargesFromText(extractedText), [extractedText]);
  const suspiciousCharges = useMemo(() => charges.filter((charge) => charge.suspicious), [charges]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">RentShield</h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Upload your rent statement or move-out statement. RentShield will extract the text, explain charges
          in plain English, and help you draft a professional dispute email.
        </p>
      </div>

      <FileUploadCard onExtracted={setExtractedText} />

      {extractedText && (
        <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Extracted Text</h2>
          <p className="mt-2 text-sm text-slate-500">Review this text before moving to charge analysis.</p>

          {/* pre-wrap keeps newlines from extraction readable for beginners */}
          <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-800 whitespace-pre-wrap">
            {extractedText}
          </pre>
        </section>
      )}

      <ChargeBreakdown charges={charges} />
      {charges.length > 0 && <DisputeEmailSection suspiciousCharges={suspiciousCharges} />}
    </main>
  );
}
