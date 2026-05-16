import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aythiya | AI Legal Assistant for Sri Lanka",
  description: "Know Your Rights. Aythiya is Sri Lanka's first AI-powered legal assistant — get instant answers to your legal questions in Sinhala, Tamil, and English.",
  keywords: "Sri Lanka law, legal AI, know your rights, Sinhala legal help, Aythiya",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="si">
      <body>{children}</body>
    </html>
  );
}
