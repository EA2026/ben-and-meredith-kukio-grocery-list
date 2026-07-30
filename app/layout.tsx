import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kukio Provisioning Manifest",
  description: "Ben & Meredith White's standing grocery checklist for Kukio, built to be checked off before every trip.",
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
