import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bamboo Nation - Jaipur",
  description: "Reserve your table at The Bamboo Nation, Jaipur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
