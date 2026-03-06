import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEMM | The Operating System for Creators",
  description:
    "Sell products, host events, and customize your brand with a technology that feels alive.",
  openGraph: {
    title: "GEMM | The Operating System for Creators",
    description:
      "Sell products, host events, and customize your brand with a technology that feels alive.",
    url: "https://gemm.live",
    siteName: "GEMM",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GEMM | The Operating System for Creators",
    description:
      "Sell products, host events, and customize your brand with a technology that feels alive.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
