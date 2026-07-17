import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "../lib/site";

export const metadata: Metadata = {
  title: "Office Space for Rent in Gurgaon | AIHP Managed Offices",
  description:
    "Custom-built managed office space in Gurgaon from ₹4,500 per seat. Eight prime locations, zero CapEx and a 60-day move-in plan.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.webp", shortcut: "/favicon.webp" },
  openGraph: {
    title: "Your Gurgaon office. Ready in 60 days.",
    description:
      "Custom-built, fully managed Grade-A offices across eight prime Gurgaon locations. Zero CapEx.",
    type: "website",
    locale: "en_IN",
    siteName: "AIHP",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1733,
        height: 908,
        alt: "AIHP managed offices in Gurgaon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Gurgaon office. Ready in 60 days.",
    description: "Managed Gurgaon offices from ₹4,500 per seat. Zero CapEx.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
