import type { Metadata } from "next";
import Script from "next/script";
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
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T7QGCWDH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T7QGCWDH');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GT-NFRRMSB6"
          strategy="afterInteractive"
        />
        <Script id="google-tags" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GT-NFRRMSB6');
            gtag('config', 'AW-16699500842');
            gtag('config', 'G-QQ45NZPFJS');
            gtag('config', 'G-KNP1GSP7DT');
          `}
        </Script>
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "7096716";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
            if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);})(window.lintrk);
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1656970768462741');
            fbq('track', 'PageView');
          `}
        </Script>
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
