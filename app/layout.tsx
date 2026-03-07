import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

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
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-M5JPD7S00S"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M5JPD7S00S');
        `}</Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
