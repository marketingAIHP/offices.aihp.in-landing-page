"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";

const RECAPTCHA_SITE_KEY = "6Lf4ntUrAAAAAC_d1AU2Um-wqr0iZxVOax6rdkDN";

type Location = { name: string; detail: string; seats: string; price: string; image: string };
type TrackingValues = Record<string, string>;
type CustomerData = Partial<{ email: string; phone_number: string; first_name: string; last_name: string }>;
type MetaCustomerData = Partial<{ em: string; ph: string; fn: string; ln: string }>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    oaiq?: (...args: unknown[]) => void;
    trackOpenAILead?: () => void;
    grecaptcha?: { getResponse: () => string; reset: () => void };
  }
}

function getCookies() {
  return document.cookie.split(";").reduce<Record<string, string>>((result, item) => {
    const separator = item.indexOf("=");
    if (separator === -1) return result;
    result[item.slice(0, separator).trim()] = decodeURIComponent(item.slice(separator + 1));
    return result;
  }, {});
}

function readTrackingValues() {
  const names = ["gclid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const params = new URLSearchParams(window.location.search);
  const cookies = getCookies();
  const values: TrackingValues = {};
  names.forEach((name) => {
    const queryValue = params.get(name);
    values[name] = queryValue || cookies[name] || "";
    if (queryValue) document.cookie = `${name}=${encodeURIComponent(queryValue)};max-age=7776000;path=/;SameSite=Lax`;
  });
  return values;
}

function buildCustomerData(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phoneNumber = String(formData.get("phone") || "").replace(/[\s()-]/g, "").replace(/\D/g, "");
  const [firstName = "", ...lastName] = String(formData.get("full_name") || "").trim().split(/\s+/).filter(Boolean);
  const googleCustomerData: CustomerData = {};
  const metaCustomerData: MetaCustomerData = {};
  if (email) { googleCustomerData.email = email; metaCustomerData.em = email; }
  if (phoneNumber) { googleCustomerData.phone_number = phoneNumber; metaCustomerData.ph = phoneNumber; }
  if (firstName) { googleCustomerData.first_name = firstName; metaCustomerData.fn = firstName; }
  if (lastName.length) { googleCustomerData.last_name = lastName.join(" "); metaCustomerData.ln = lastName.join(" "); }
  return { googleCustomerData, metaCustomerData };
}

export default function LeadForm({ locations }: { locations: readonly Location[] }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");
  const trackingRef = useRef<TrackingValues>({});

  useEffect(() => { trackingRef.current = readTrackingValues(); }, []);
  useEffect(() => {
    if (step !== 2 || document.getElementById("recaptcha-script")) return;
    const script = document.createElement("script");
    script.id = "recaptcha-script"; script.src = "https://www.google.com/recaptcha/api.js"; script.async = true; script.defer = true;
    document.head.appendChild(script);
  }, [step]);

  function advanceForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!String(formData.get("no_of_workstations_required") || "").trim() || !String(formData.get("preferred_location") || "").trim()) {
      setStatus("error"); setError("Please select your team size and preferred location to continue."); return;
    }
    setStatus("idle"); setError(""); setStep(2);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "form_step_complete", form_name: "lease_lead_form", step: 1 });
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const formData = new FormData(event.currentTarget);
    const captchaResponse = window.grecaptcha?.getResponse() || "";
    if (!captchaResponse) { setError("Please complete the CAPTCHA before submitting."); return; }
    const fieldNames = ["full_name", "email", "phone", "company", "no_of_workstations_required", "preferred_location", "message", "gclid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const cookies = getCookies();
    const payload = { fields: fieldNames.map((name) => ({ name, value: String(formData.get(name) || trackingRef.current[name] || "") })).filter((field) => field.value), context: { hutk: cookies.hubspotutk, pageUri: window.location.href, pageName: document.title } };
    try {
      setStatus("submitting");
      const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, captchaResponse }) });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "We couldn't send your request. Please call us instead.");
      const { googleCustomerData, metaCustomerData } = buildCustomerData(formData);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "form_submit", form_name: "lease_lead_form", preferred_location: formData.get("preferred_location") || "" });
      window.dataLayer.push({ event: "generate_lead", form_name: "lease_lead_form", preferred_location: formData.get("preferred_location") || "", ...googleCustomerData });
      if (Object.keys(metaCustomerData).length) window.fbq?.("set", "userData", metaCustomerData);
      window.fbq?.("track", "Lead"); window.grecaptcha?.reset();
      window.trackOpenAILead?.();
      await new Promise<void>((resolve) => window.setTimeout(resolve, 200));
      window.location.assign("https://aihp.in/thankyou");
    } catch (submissionError) {
      setStatus("error"); window.grecaptcha?.reset();
      setError(submissionError instanceof Error ? submissionError.message : "Please try again or call +91 73030 60067.");
    }
  }

  return <aside className="lead-panel" id="quote-form" aria-label="Request an AIHP office plan">
    <p className="panel-kicker">Your 60-day move-in plan</p><h2>Tell us what you need.</h2><p>Our team will contact you within 24 hours with a tailored office solution.</p>
    <form noValidate onSubmit={step === 1 ? advanceForm : submitForm}>
      <div className="form-step" hidden={step !== 1}><p className="step-label">Step 1 of 2 - tell us your office brief</p><div className="form-grid brief-form-grid">
        <label className="form-field">Seats needed<span className="select-wrap"><select name="no_of_workstations_required" defaultValue=""><option value="" disabled>Select team size</option><option value="20 to 30">20 to 30</option><option value="31 to 50">31 to 50</option><option value="51 to 75">51 to 75</option><option value="76 to 100">76 to 100</option><option value="101+">101+</option></select></span></label>
        <label className="form-field">Preferred location<span className="select-wrap"><select name="preferred_location" defaultValue=""><option value="" disabled>Select a corridor</option>{locations.map((location) => <option key={location.name} value={location.name}>{location.name}</option>)}</select></span></label>
      </div>{step === 1 && error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="primary-button">Next</button></div>
      <div className="form-step" hidden={step !== 2}><p className="step-label">Last step - where should we send it?</p><div className="form-grid contact-grid"><label>Full name<input name="full_name" required autoComplete="name" placeholder="Your name" /></label><label>Work email<input type="email" name="email" required autoComplete="email" placeholder="you@company.com" /></label><label>Phone number<input type="tel" name="phone" required autoComplete="tel" placeholder="+91 98765 43210" /></label><label>Company<input name="company" required autoComplete="organization" placeholder="Company name" /></label></div><label className="notes-label">Anything else?<input name="message" placeholder="Move-in date, specification or other needs" /></label><div className="captcha-wrap"><div className="g-recaptcha" data-sitekey={RECAPTCHA_SITE_KEY} /></div>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="primary-button" disabled={status === "submitting"}>{status === "submitting" ? "Sending..." : "Send my requirements"}</button><button type="button" className="back-button" onClick={() => { setError(""); setStatus("idle"); setStep(1); }}>Back</button></div>
    </form><p className="panel-locations">Udyog Vihar · NH8 · Sector 32 · Golf Course Extension Road</p>
  </aside>;
}
