import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") || headerStore.get("host") || "lease.aihp.in";
  const protocol = headerStore.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const requestOrigin = `${protocol}://${host}`;
  const socialImage = `${requestOrigin}/og.png`;

  return {
    title: "Office Space for Rent in Gurgaon | AIHP Managed Offices",
    description: "Custom-built managed office space in Gurgaon from ₹4,500 per seat. Eight prime locations, zero CapEx and a 60-day move-in plan.",
    metadataBase: new URL(requestOrigin),
    alternates: { canonical: "https://lease.aihp.in/" },
    icons: { icon: "/favicon.webp", shortcut: "/favicon.webp" },
    openGraph: {
      title: "Your Gurgaon office. Ready in 60 days.",
      description: "Custom-built, fully managed Grade-A offices across eight prime Gurgaon locations. Zero CapEx.",
      type: "website",
      locale: "en_IN",
      siteName: "AIHP",
      images: [{ url: socialImage, width: 1733, height: 908, alt: "AIHP managed offices in Gurgaon" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Your Gurgaon office. Ready in 60 days.",
      description: "Managed Gurgaon offices from ₹4,500 per seat. Zero CapEx.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className={`${inter.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
