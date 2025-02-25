import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecomflow Inventory Threshold Calculator",
  description: "developed by Ahmed Osama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgb(209 213 219), rgb(209 213 219) 2px, transparent 2px, transparent 10px)",
          backgroundSize: "400% 100%",
          backgroundPosition: "0 0",
        }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>

      <Toaster position="top-right" richColors expand closeButton />
    </html>
  );
}
