import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import VisualEditing from "@/components/VisualEditing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebInt - Payments Web Intelligence Charts",
  description:
    "Stock performance of listed Payments companies, AI integrations and more. All you need to know about Payments, Remittance, FX - key metrics, trends and insights.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <Footer />
        <Toaster />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
