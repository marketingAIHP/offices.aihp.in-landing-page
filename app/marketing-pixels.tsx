"use client";

import { useEffect } from "react";

function addScript(code: string) {
  const script = document.createElement("script");
  script.text = code;
  document.head.appendChild(script);
}

function addExternalScript(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export default function MarketingPixels() {
  useEffect(() => {
    let loaded = false;
    const loadPixels = () => {
      if (loaded) return;
      loaded = true;
      window.removeEventListener("pointerdown", loadPixels);
      window.removeEventListener("keydown", loadPixels);
      window.removeEventListener("scroll", loadPixels);
      addScript(`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','GTM-T7QGCWDH');`);
      addExternalScript("https://www.googletagmanager.com/gtag/js?id=GT-NFRRMSB6");
      addScript(`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','GT-NFRRMSB6');gtag('config','AW-16699500842');gtag('config','G-QQ45NZPFJS');gtag('config','G-KNP1GSP7DT');`);
      addScript(`_linkedin_partner_id='7096716';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName('script')[0],b=document.createElement('script');b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s)})(window.lintrk);`);
      addScript(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1656970768462741');fbq('track','PageView');`);
    };
    const timeout = window.setTimeout(loadPixels, 8_000);
    window.addEventListener("pointerdown", loadPixels, { once: true, passive: true });
    window.addEventListener("keydown", loadPixels, { once: true });
    window.addEventListener("scroll", loadPixels, { once: true, passive: true });
    return () => { window.clearTimeout(timeout); window.removeEventListener("pointerdown", loadPixels); window.removeEventListener("keydown", loadPixels); window.removeEventListener("scroll", loadPixels); };
  }, []);
  return null;
}
