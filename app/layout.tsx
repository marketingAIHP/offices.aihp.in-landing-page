import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import MarketingPixels from "./marketing-pixels";
import { siteUrl } from "../lib/site";

export const metadata: Metadata = {
  title: "Office Space for Rent in Gurgaon | AIHP Managed Offices",
  description:
    "Custom-built managed office space in Gurgaon from ₹6,500 per seat. Eight prime locations, zero CapEx and a 60-day move-in plan.",
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
    description: "Managed Gurgaon offices from ₹6,500 per seat. Zero CapEx.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'granted'
            });
          `}
        </Script>
        <Script id="openai-ads-pixel" strategy="beforeInteractive">
          {`
            !function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
            oaiq("init",{pixelId:"ShUfMHYzccxAA6JhYSfaUR",debug:true});
            window.trackOpenAILead=function(){oaiq("measure","lead_created",{type:"customer_action"});};
          `}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T7QGCWDH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <MarketingPixels />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=7096716&fmt=gif"
          />
        </noscript>
        <noscript>
          <img
            alt=""
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1656970768462741&ev=PageView&noscript=1"
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
