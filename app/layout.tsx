import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ben & Meredith's Grocery List · Kukio",
  description: "Ben & Meredith White's standing grocery checklist for Kukio, built to be checked off before every trip.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-manifest-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
