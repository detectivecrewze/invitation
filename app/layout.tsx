import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Date Invitation",
  description: "Buat undangan kencan yang manis dan interaktif",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import ErrorSuppressor from "@/components/ErrorSuppressor";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${caveat.variable} ${inter.variable} h-full`}>
      <body className="min-h-full font-sans">
        <ErrorSuppressor />
        {children}
      </body>
    </html>
  );
}
