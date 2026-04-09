"use client";

import { useMemo, useState } from "react";
import { extractStatementTextMock } from "@/lib/mockExtractor";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

type FileUploadCardProps = {
  onExtracted: (text: string) => void;
};

/**
 * FileUploadCard handles file selection + mock extraction for Step 2.
 * A parent component receives extracted text so it can render results below.
 */
export default function FileUploadCard({ onExtracted }: FileUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileSummary = useMemo(() => {
    if (!file) return "No file selected yet.";

    const kb = Math.max(1, Math.round(file.size / 1024));
    return `${file.name} (${kb} KB)`;
  }, [file]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      setFile(null);
      setError("");
      return;
    }

    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      setError("Please upload a PDF, JPG, PNG, or WEBP file.");
      setFile(null);
      return;
    }

    setFile(nextFile);
    setError("");
  };

  const analyzeFile = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const extractedText = await extractStatementTextMock(file);
      onExtracted(extractedText);
    } catch {
      setError("We could not extract text from this file. Please try another statement.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <label htmlFor="statement-upload" className="mb-2 block text-sm font-semibold text-slate-700">
        Upload rent or move-out statement
      </label>

      <input
        id="statement-upload"
        name="statement-upload"
        type="file"
        accept=".pdf,image/jpeg,image/png,image/webp"
        onChange={onFileChange}
        className="block w-full rounded-lg border border-slate-300 p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700"
      />

      <p className="mt-3 text-sm text-slate-600">{fileSummary}</p>

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}

      {file && (
        <button
          type="button"
          onClick={analyzeFile}
          disabled={isAnalyzing}
          className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Statement"}
        </button>
      )}
    </section>
  );
}
