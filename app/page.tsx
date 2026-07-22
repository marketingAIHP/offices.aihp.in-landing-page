"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { siteUrl } from "../lib/site";

const RECAPTCHA_SITE_KEY = "6Lf4ntUrAAAAAC_d1AU2Um-wqr0iZxVOax6rdkDN";

const locations = [
  { name: "Udyog Vihar", detail: "Near Cyber City", seats: "20-300+ seats", price: "From ₹4,500", image: "/assets/location-udyog-vihar.webp" },
  { name: "NH8", detail: "Direct highway access", seats: "50-500+ seats", price: "From ₹6,500", image: "/assets/location-nh8.webp" },
  { name: "Sector 32", detail: "Seamless NH-48 access", seats: "30-200+ seats", price: "From ₹6,500", image: "/assets/location-sector-32.webp" },
  { name: "Golf Course Ext. Road", detail: "Premium commercial corridor", seats: "50-500+ seats", price: "From ₹7,000", image: "/assets/location-golf-course-ext-road.webp" },
  { name: "Golf Course Road", detail: "Prime business district", seats: "20-400+ seats", price: "From ₹7,500", image: "/assets/location-golf-course-road.webp" },
  { name: "Sector 50", detail: "High-demand micro-market", seats: "20-200+ seats", price: "From ₹6,500", image: "/assets/location-sector-50.webp" },
  { name: "MG Road", detail: "Metro-connected offices", seats: "30-300+ seats", price: "From ₹7,000", image: "/assets/location-mg-road.webp" },
  { name: "Sohna Road", detail: "Fast-growing office corridor", seats: "50-500+ seats", price: "From ₹6,000", image: "/assets/location-sohna-road.webp" },
] as const;

const faqs = [
  ["What is the starting rent for an AIHP office in Gurgaon?", "AIHP managed offices start from ₹4,500 per seat per month in Udyog Vihar. Pricing varies by location, specification and team size."],
  ["What does zero CapEx include?", "AIHP funds and manages the office design, fit-out, furniture and operational setup. You move into a finished office without a separate upfront fit-out investment."],
  ["Can the office be designed around our brand?", "Yes. Layouts, finishes, reception areas, signage and collaboration spaces are customised to your brief and brand standards."],
  ["How quickly can our office be ready?", "A typical AIHP office is designed, built and made operational within 60 days after the brief and commercial terms are approved."],
  ["What team sizes can AIHP accommodate?", "Current options cover teams from roughly 20 seats to enterprise floors for 500+ people, with room to expand as your requirements change."],
] as const;

type TrackingValues = Record<string, string>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    grecaptcha?: { getResponse: () => string; reset: () => void };
  }
}

function getCookies() {
  return document.cookie.split(";").reduce<Record<string, string>>((result, item) => {
    const separator = item.indexOf("=");
    if (separator === -1) return result;
    const key = item.slice(0, separator).trim();
    result[key] = decodeURIComponent(item.slice(separator + 1));
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
    const value = queryValue || cookies[name] || "";
    values[name] = value;
    if (queryValue) {
      document.cookie = `${name}=${encodeURIComponent(queryValue)};max-age=7776000;path=/;SameSite=Lax`;
    }
  });

  return values;
}

export default function Home() {
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");
  const trackingRef = useRef<TrackingValues>({});

  useEffect(() => {
    trackingRef.current = readTrackingValues();
  }, []);

  useEffect(() => {
    if (step !== 2 || document.getElementById("recaptcha-script")) return;
    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [step]);

  function advanceForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const seatsNeeded = String(formData.get("no_of_workstations_required") || "").trim();
    const preferredLocation = String(formData.get("preferred_location") || "").trim();

    if (!seatsNeeded || !preferredLocation) {
      setStatus("error");
      setError("Please select your team size and preferred location to continue.");
      return;
    }

    setStatus("idle");
    setError("");
    setStep(2);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "form_step_complete", form_name: "lease_lead_form", step: 1 });
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const captchaResponse = window.grecaptcha?.getResponse() || "";
    if (!captchaResponse) {
      setError("Please complete the CAPTCHA before submitting.");
      return;
    }

    const fieldNames = [
      "full_name", "email", "phone", "company", "no_of_workstations_required",
      "preferred_location", "message", "gclid", "utm_source", "utm_medium",
      "utm_campaign", "utm_content", "utm_term",
    ];
    const cookies = getCookies();
    const payload = {
      fields: fieldNames
        .map((name) => ({
          name,
          value: String(formData.get(name) || trackingRef.current[name] || ""),
        }))
        .filter((field) => field.value),
      context: {
        hutk: cookies.hubspotutk,
        pageUri: window.location.href,
        pageName: document.title,
      },
    };

    try {
      setStatus("submitting");
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          captchaResponse,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "We couldn't send your request. Please call us instead.");
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "form_submit",
        form_name: "lease_lead_form",
        preferred_location: formData.get("preferred_location") || "",
      });
      window.fbq?.("track", "Lead");
      window.grecaptcha?.reset();
      window.location.assign("https://aihp.in/thankyou");
    } catch (submissionError) {
      setStatus("error");
      window.grecaptcha?.reset();
      setError(submissionError instanceof Error ? submissionError.message : "Please try again or call +91 73030 60067.");
    }
  }

  const realEstateSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "AIHP - Managed Office Space in Gurgaon",
    url: `${siteUrl}/`,
    telephone: "+91-7303060067",
    email: "leasing@aihp.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: "AIHP Tower, 249 G, Udyog Vihar, Phase 4",
      addressLocality: "Gurgaon",
      addressRegion: "Haryana",
      postalCode: "122015",
      addressCountry: "IN",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="AIHP home">
          <Image
            src="/assets/AIHP LOGO Black.webp"
            alt="AIHP - Adding Value"
            width={597}
            height={494}
            sizes="84px"
          />
          <span>Managed workspaces</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#locations">8 Gurgaon locations</a>
          <a href="tel:+917303060067" className="phone-link">+91 73030 60067</a>
          <a href="#quote-form" className="header-cta">Book a viewing</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-intro">
            <p className="eyebrow">Built around your business</p>
            <h1 id="hero-title">
              <span className="hero-title-desktop">
                Your Gurgaon office.
                <br />
                Ready in 60 days.
              </span>
              <span className="hero-title-mobile" aria-hidden="true">
                <span>Your Gurgaon</span>
                <span>office. Ready in</span>
                <span>60 days.</span>
              </span>
            </h1>
            <p className="hero-copy">Custom-built, fully managed Grade-A offices across eight prime Gurgaon locations. Zero CapEx.</p>
            <p className="hero-price"><span>From</span> ₹4,500 <small>/ seat / month</small></p>
          </div>

          <div className="proof-ledger" aria-label="AIHP at a glance">
            <div><strong>10M+</strong><span>sq ft managed</span></div>
            <div><strong>500+</strong><span>clients</span></div>
            <div><strong>15+</strong><span>years in Gurgaon</span></div>
            <div><strong>08</strong><span>prime locations</span></div>
          </div>

          <div className="office-stage">
            <div className="office-gallery" aria-label="AIHP managed office spaces">
              <figure className="gallery-main">
                <Image
                  src="/assets/gallery-1.webp"
                  alt="AIHP branded reception in a managed Gurgaon office"
                  width={800}
                  height={450}
                  fetchPriority="high"
                  sizes="(max-width: 760px) 100vw, 48vw"
                />
                <figcaption>Built around your team</figcaption>
              </figure>
              <figure>
                <Image
                  src="/assets/gallery-3.webp"
                  alt="Premium collaboration lounge in an AIHP office"
                  width={623}
                  height={415}
                  fetchPriority="high"
                  sizes="(max-width: 760px) 50vw, 30vw"
                />
                <figcaption>Grade-A spaces</figcaption>
              </figure>
              <figure>
                <Image
                  src="/assets/gallery-7.webp"
                  alt="Enterprise boardroom managed by AIHP"
                  width={623}
                  height={415}
                  sizes="(max-width: 760px) 50vw, 30vw"
                />
                <figcaption>Managed end-to-end</figcaption>
              </figure>
            </div>

            <aside className="lead-panel" id="quote-form" aria-label="Request an AIHP office plan">
              <p className="panel-kicker">Your 60-day move-in plan</p>
              <h2>Tell us what you need.</h2>
              <p>Our team will contact you within 24 hours with a tailored office solution.</p>

              <form noValidate onSubmit={step === 1 ? advanceForm : submitForm}>
                <div className="form-step" hidden={step !== 1}>
                  <p className="step-label">Step 1 of 2 - tell us your office brief</p>
                  <div className="form-grid">
                    <label className="form-field">
                      Seats needed
                      <span className="select-wrap">
                        <select name="no_of_workstations_required" defaultValue="">
                          <option value="" disabled>Select team size</option>
                          <option value="20 to 30">20 to 30</option>
                          <option value="31 to 50">31 to 50</option>
                          <option value="51 to 75">51 to 75</option>
                          <option value="76 to 100">76 to 100</option>
                          <option value="101+">101+</option>
                        </select>
                      </span>
                    </label>
                    <label className="form-field">
                      Preferred location
                      <span className="select-wrap">
                        <select name="preferred_location" defaultValue="">
                          <option value="" disabled>Select a corridor</option>
                          {locations.map((location) => <option key={location.name} value={location.name}>{location.name}</option>)}
                        </select>
                      </span>
                    </label>
                  </div>
                  {step === 1 && error && <p className="form-error" role="alert">{error}</p>}
                  <button type="submit" className="primary-button">Next</button>
                </div>

                <div className="form-step" hidden={step !== 2}>
                  <p className="step-label">Last step - where should we send it?</p>
                  <div className="form-grid contact-grid">
                    <label>Full name<input name="full_name" required autoComplete="name" placeholder="Your name" /></label>
                    <label>Work email<input type="email" name="email" required autoComplete="email" placeholder="you@company.com" /></label>
                    <label>Phone number<input type="tel" name="phone" required autoComplete="tel" placeholder="+91 98765 43210" /></label>
                    <label>Company<input name="company" required autoComplete="organization" placeholder="Company name" /></label>
                  </div>
                  <label className="notes-label">Anything else?<input name="message" placeholder="Move-in date, specification or other needs" /></label>
                  <div className="captcha-wrap"><div className="g-recaptcha" data-sitekey={RECAPTCHA_SITE_KEY} /></div>
                  {error && <p className="form-error" role="alert">{error}</p>}
                  <button type="submit" className="primary-button" disabled={status === "submitting"}>
                    {status === "submitting" ? "Sending..." : "Send my requirements"}
                  </button>
                  <button type="button" className="back-button" onClick={() => { setError(""); setStatus("idle"); setStep(1); }}>Back</button>
                </div>
              </form>
              <p className="panel-locations">Udyog Vihar · NH8 · Sector 32 · Golf Course Extension Road</p>
            </aside>
          </div>
        </section>

        <section className="client-strip" aria-label="Selected AIHP clients">
          <p>Trusted by 500+ companies</p>
          <div>
            <div className="client-logo-frame">
              <Image src="/assets/client-anandrathi.webp" alt="Anand Rathi" width={300} height={182} loading="lazy" sizes="190px" />
            </div>
            <div className="client-logo-frame">
              <Image src="/assets/client-olx.webp" alt="OLX" width={300} height={182} loading="lazy" sizes="190px" />
            </div>
            <div className="client-logo-frame">
              <Image src="/assets/client-arcelormittal.webp" alt="ArcelorMittal" width={300} height={182} loading="lazy" sizes="190px" />
            </div>
            <div className="client-logo-frame">
              <Image src="/assets/client-dentsu.webp" alt="Dentsu" width={300} height={182} loading="lazy" sizes="190px" />
            </div>
          </div>
        </section>

        <section className="value-section section-shell" id="why-aihp">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">Why AIHP</p><h2>A workplace partner.<br />Not a generic landlord.</h2></div>
            <p>Every AIHP office is purpose-built to your brief, delivered furnished and run by a dedicated facilities team.</p>
          </div>
          <div className="value-grid">
            <article><span>01</span><h3>Zero upfront fit-out</h3><p>Protect working capital. AIHP funds the design, construction and furniture.</p></article>
            <article><span>02</span><h3>Built to your brief</h3><p>Your layout, brand, meeting mix and employee experience - not a shared template.</p></article>
            <article><span>03</span><h3>Operational from day one</h3><p>Technology-ready space with housekeeping, security, maintenance and front desk support.</p></article>
            <article><span>04</span><h3>Room to grow</h3><p>Expand from a 20-seat office to an enterprise floor without rebuilding your workplace model.</p></article>
          </div>
        </section>

        <section className="locations-section" id="locations">
          <div className="section-shell">
            <div className="section-heading">
              <p className="eyebrow">Eight Gurgaon corridors</p>
              <h2>Where your teams want to be.</h2>
              <p>Managed offices close to the city&apos;s most important commercial and transport hubs.</p>
            </div>
            <div className="locations-grid">
              {locations.map((location) => (
                <article className="location-card" key={location.name}>
                  <Image
                    src={location.image}
                    alt={`AIHP office space in ${location.name}, Gurgaon`}
                    width={800}
                    height={450}
                    loading="lazy"
                    sizes="(max-width: 760px) 84vw, (max-width: 1100px) 50vw, 25vw"
                  />
                  <div className="location-body">
                    <p>{location.detail}</p>
                    <h3>{location.name}</h3>
                    <div><span>{location.seats}</span><strong>{location.price}</strong></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="process-section section-shell" id="process">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">One accountable partner</p><h2>From brief to move-in.<br />Sixty days.</h2></div>
            <p>Design, approvals, build and operations move through one team and one delivery plan.</p>
          </div>
          <ol className="process-list">
            <li><span>Day 01</span><div><h3>Design kick-off</h3><p>We translate your headcount, workstyle and brand into an office brief.</p></div></li>
            <li><span>Days 02-59</span><div><h3>Approve and build</h3><p>AIHP manages drawings, procurement, construction, furniture and technology readiness.</p></div></li>
            <li><span>Day 60</span><div><h3>Move in</h3><p>Your team enters a finished, branded and fully managed workplace.</p></div></li>
          </ol>
        </section>

        <section className="comparison-section">
          <div className="section-shell">
            <div className="section-heading"><p className="eyebrow">A clearer commercial model</p><h2>Managed office, without the compromises.</h2></div>
            <div className="comparison-table" role="table" aria-label="Office model comparison">
              <div className="comparison-row comparison-head" role="row"><span role="columnheader">What matters</span><strong role="columnheader">AIHP managed</strong><span role="columnheader">Traditional lease</span><span role="columnheader">Coworking</span></div>
              {[
                ["Upfront fit-out", "Zero CapEx", "₹50L-2Cr+", "Usually none"],
                ["Brand experience", "Fully customised", "Customisable", "Shared identity"],
                ["Move-in timeline", "60 days", "4-8 months", "Immediate"],
                ["Privacy", "Dedicated office", "Dedicated office", "Shared amenities"],
                ["Facility management", "Included", "Self-managed", "Included"],
                ["Ability to scale", "Built in", "Fixed capacity", "Limited options"],
              ].map((row) => (
                <div className="comparison-row" role="row" key={row[0]}>
                  {row.map((cell, index) =>
                    index === 1 ? (
                      <strong role="cell" key={`${row[0]}-${index}-${cell}`}>
                        {cell}
                      </strong>
                    ) : (
                      <span role="cell" key={`${row[0]}-${index}-${cell}`}>
                        {cell}
                      </span>
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="testimonial-section section-shell">
          <div className="section-heading"><p className="eyebrow">What clients say</p><h2>Trusted by Teams that Value Excellence.</h2></div>
          <div className="testimonial-grid">
            <blockquote>
              <p>“AIHP transformed our office into a brand-aligned, client-ready space. Their design expertise and professional execution make them a trusted partner.”</p>
              <footer><Image src="/assets/mukesh-kumawat.webp" alt="Mukesh Kumawat" width={200} height={201} loading="lazy" sizes="48px" /><span><strong>Mukesh Kumawat</strong>Executive Director & Unit Head, Anand Rathi Wealth</span></footer>
            </blockquote>
            <blockquote>
              <p>“From top-tier offices to tailored designs, every aspect exceeds expectations. Choosing AIHP for our Gurgaon office was simple.”</p>
              <footer><Image src="/assets/sudhir-sharma.webp" alt="Sudhir Sharma" width={200} height={200} loading="lazy" sizes="48px" /><span><strong>Sudhir Sharma</strong>Regional Head, ArcelorMittal Nippon Steel</span></footer>
            </blockquote>
            <blockquote>
              <p>“Their team created diverse collaboration spaces with excellent amenities and natural light. The design team truly understood our needs.”</p>
              <footer><Image src="/assets/harpreet-singh.webp" alt="Harpreet Singh" width={200} height={200} loading="lazy" sizes="48px" /><span><strong>Harpreet Singh</strong>Co-founder, ProcDNA</span></footer>
            </blockquote>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="section-shell faq-shell">
            <div className="section-heading"><p className="eyebrow">Common questions</p><h2>Before you book a viewing.</h2></div>
            <div className="faq-list">
              {faqs.map(([question, answer], index) => (
                <details key={question} open={index === 0}>
                  <summary>{question}<span aria-hidden="true">+</span></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta-section">
          <div>
            <p className="eyebrow">Your next Gurgaon office</p>
            <h2>See the spaces that fit your team.</h2>
            <p>Tell us your headcount and preferred corridor. We’ll prepare a relevant shortlist and commercial estimate.</p>
            <div><a href="#quote-form" className="light-button">Get my office plan</a><a href="tel:+917303060067" className="text-link">Call +91 73030 60067</a></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><Image src="/assets/logo-white.webp" alt="AIHP" width={200} height={120} sizes="112px" /><p>Premium managed offices in Gurgaon. Designed, built and operated around your business.</p></div>
        <div><p className="footer-label">Contact</p><a href="tel:+917303060067">+91 73030 60067</a><a href="mailto:leasing@aihp.in">leasing@aihp.in</a><p>AIHP Tower, 249 G, Udyog Vihar, Phase 4, Gurgaon 122015</p></div>
        <div><p className="footer-label">Explore</p><a href="#locations">Locations</a><a href="#why-aihp">Why AIHP</a><a href="#process">How it works</a><a href="#faq">FAQ</a></div>
        <div className="footer-bottom"><span>© 2026 AIHP. All rights reserved.</span><span><a href="https://aihp.in/privacy-policy/">Privacy</a> · <a href="https://aihp.in/terms-of-service/">Terms</a></span></div>
      </footer>

      <a className="mobile-sticky" href="#quote-form">Get my office plan</a>
    </>
  );
}
