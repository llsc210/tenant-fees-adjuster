import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentShield",
  description: "Upload rent statements and review charges in plain English.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
