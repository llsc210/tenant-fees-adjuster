import type { Charge } from "@/lib/analyzeCharges";

type ChargeBreakdownProps = {
  charges: Charge[];
};

/**
 * Displays parsed charge results in a simple table-like card list.
 */
export default function ChargeBreakdown({ charges }: ChargeBreakdownProps) {
  if (charges.length === 0) return null;

  return (
    <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Charge Breakdown</h2>
      <p className="mt-2 text-sm text-slate-500">Rule-based review of charges extracted from your statement.</p>

      <div className="mt-4 space-y-3">
        {charges.map((charge, index) => (
          <article key={`${charge.title}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900">{charge.title}</h3>
              <p className="text-sm font-semibold text-slate-700">${charge.amount.toFixed(2)}</p>
            </div>

            <p className="mt-2 text-sm text-slate-600">{charge.explanation}</p>

            <p
              className={`mt-3 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                charge.suspicious ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {charge.suspicious ? "Suspicious: Yes" : "Suspicious: No"}
            </p>

            {charge.suspicious && charge.reason && (
              <p className="mt-2 text-sm font-medium text-red-700">Reason: {charge.reason}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
