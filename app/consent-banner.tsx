"use client";

import { useEffect, useState } from "react";

type Consent = { necessary: true; analytics: boolean; marketing: boolean };
const MAX_AGE_SECONDS = 15_552_000;

function readConsent(): Consent | null {
  const value = document.cookie.match(/(?:^|; )aihp-consent=([^;]+)/)?.[1];
  if (!value) return null;
  try {
    const consent = JSON.parse(decodeURIComponent(value)) as Consent;
    return consent?.necessary === true && typeof consent.analytics === "boolean" && typeof consent.marketing === "boolean" ? consent : null;
  } catch { return null; }
}

function updateGoogleConsent(consent: Consent) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  }]);
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<Consent>({ necessary: true, analytics: true, marketing: true });

  useEffect(() => {
    const savedConsent = readConsent();
    if (savedConsent) { updateGoogleConsent(savedConsent); return; }
    let active = true;
    fetch("/api/geo").then((response) => response.ok ? response.json() as Promise<{ optIn?: boolean }> : { optIn: true })
      .then(({ optIn }) => {
        if (!active) return;
        if (optIn) setConsent({ necessary: true, analytics: false, marketing: false });
        setVisible(true);
      })
      .catch(() => { if (active) setVisible(true); });
    return () => { active = false; };
  }, []);

  function save(nextConsent: Consent) {
    document.cookie = `aihp-consent=${encodeURIComponent(JSON.stringify(nextConsent))}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax; Secure`;
    updateGoogleConsent(nextConsent);
    setVisible(false);
  }

  if (!visible) return null;
  return <section className="consent-banner" aria-label="Cookie consent">
    <p>We use cookies to run this site, and for analytics and marketing based on the choices you make here.</p>
    <div className="consent-actions">
      <button type="button" onClick={() => save({ necessary: true, analytics: true, marketing: true })}>Accept all</button>
      <button type="button" onClick={() => save({ necessary: true, analytics: false, marketing: false })}>Reject all</button>
      <label><input type="checkbox" checked={consent.analytics} onChange={(event) => setConsent({ ...consent, analytics: event.target.checked })} /> Analytics</label>
      <label><input type="checkbox" checked={consent.marketing} onChange={(event) => setConsent({ ...consent, marketing: event.target.checked })} /> Marketing</label>
      <button type="button" onClick={() => save(consent)}>Save preferences</button>
    </div>
  </section>;
}
