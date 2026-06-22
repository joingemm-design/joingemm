import type { Metadata } from "next";
import K3Page from "@/components/K3Page";

export const metadata: Metadata = {
  title: "Kevin Coleman Jr. | NFL Draft 2026 | Mizzou WR",
  description: "4.48 forty. 38.5 vertical. Mizzou Tigers WR and 2026 NFL Draft prospect.",
  openGraph: {
    title: "Kevin Coleman Jr. | NFL Draft 2026",
    description: "4.48 forty. 38.5 vertical. Mizzou WR and 2026 NFL Draft prospect.",
    url: "https://joingemm.com/k3",
    images: [{ url: "https://joingemm.com/k3.png", width: 1200, height: 630 }],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Coleman Jr. | NFL Draft 2026",
    description: "4.48 forty. 38.5 vertical. Mizzou WR.",
    images: ["https://joingemm.com/k3.png"],
  },
};

export default function Page() {
  return <K3Page />;
}