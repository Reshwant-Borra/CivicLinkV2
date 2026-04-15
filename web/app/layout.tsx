import type { Metadata } from "next";
import { Fira_Code, Fira_Sans } from "next/font/google";
import "./globals.css";

const firaSans = Fira_Sans({
  /** Distinct from Tailwind’s `--font-sans` token to avoid a self-referential cycle in `@theme`. */
  variable: "--font-civic-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-civic-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CivicLink",
  description:
    "Neutral civic dashboard — legislation, voting, and local participation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${firaSans.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-screen m-0 p-0" style={{ background: "#F6F3ED" }}>{children}</body>
    </html>
  );
}
