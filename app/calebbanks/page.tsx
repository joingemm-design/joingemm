import type { Metadata } from "next";
import CalebBanksPage from "@/components/CalebBanksPage";

export const metadata: Metadata = {
  title: "Caleb Banks | NFL Draft 2026 | Florida DT",
  description: "6ft6. 327 lbs. 5.04 forty. Florida Gators DT and 2026 NFL Draft prospect.",
  openGraph: {
    title: "Caleb Banks | NFL Draft 2026",
    description: "6ft6. 327 lbs. 5.04 forty. The most physically rare DT in this draft class.",
    url: "https://joingemm.com/calebbanks",
    images: [{ url: "https://joingemm.com/caleb.jpg", width: 1200, height: 630 }],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caleb Banks | NFL Draft 2026",
    description: "6ft6. 327 lbs. 5.04 forty. Florida Gators DT.",
    images: ["https://joingemm.com/caleb.jpg"],
  },
};

export default function Page() {
  return <CalebBanksPage />;
}