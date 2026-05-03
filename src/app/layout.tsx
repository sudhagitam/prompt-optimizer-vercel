import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt Optimization Engine",
  description:
    "Transform raw user intent into production-ready, low-token LLM prompts.",
  openGraph: {
    title: "Prompt Optimization Engine",
    description: "Raw intent → Production-ready prompt",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
