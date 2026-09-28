import Image from "next/image";
import LeadForm from "./lead-form";
import { siteUrl } from "../lib/site";


const locations = [
  { name: "Udyog Vihar", detail: "Near Cyber City", seats: "20-300+ seats", price: "From ₹6,500", image: "/assets/location-udyog-vihar.webp", available: true },
  { name: "NH8", detail: "Direct highway access", seats: "50-500+ seats", price: "From ₹6,500", image: "/assets/location-nh8.webp", available: true },
  { name: "Sector 32", detail: "Seamless NH-48 access", seats: "30-200+ seats", price: "From ₹6,500", image: "/assets/location-sector-32.webp", available: true },
  { name: "Golf Course Ext. Road", detail: "Premium commercial corridor", seats: "50-500+ seats", price: "From ₹6,500", image: "/assets/location-golf-course-ext-road.webp", available: true },
  { name: "Golf Course Road", detail: "Prime business district", seats: "20-400+ seats", price: "Pricing on inquiry", image: "/assets/location-golf-course-road.webp", available: true },
  { name: "Sector 50", detail: "High-demand micro-market", seats: "Currently fully leased", price: "Pricing on inquiry", image: "/assets/location-sector-50.webp", available: false },
  { name: "MG Road", detail: "Metro-connected offices", seats: "30-300+ seats", price: "From ₹9,500", image: "/assets/location-mg-road.webp", available: true },
  { name: "Sohna Road", detail: "Fast-growing office corridor", seats: "50-500+ seats", price: "Pricing on inquiry", image: "/assets/location-sohna-road.webp", available: true },
] as const;

const faqs = [
  ["What is the starting rent for an AIHP office in Gurgaon?", "AIHP managed offices start from ₹6,500 per seat per month. Pricing varies by location, specification and team size."],
  ["What does zero CapEx include?", "AIHP funds and manages the office design, fit-out, furniture and operational setup. You move into a finished office without a separate upfront fit-out investment."],
  ["Can the office be designed around our brand?", "Yes. Layouts, finishes, reception areas, signage and collaboration spaces are customised to your brief and brand standards."],
  ["How quickly can our office be ready?", "A typical AIHP office is designed, built and made operational within 60 days after the brief and commercial terms are approved."],
  ["What team sizes can AIHP accommodate?", "Current options cover teams from roughly 20 seats to enterprise floors for 500+ people, with room to expand as your requirements change."],
] as const;

export default function Home() {
  const realEstateSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "AIHP - Managed Office Space in Gurgaon",
    url: `${siteUrl}/`,
    telephone: "+91-7303060067",
    email: "leasing@aihp.in",
    priceRange: "₹6,500–15,000 per seat per month",
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
            <p className="hero-price"><span>Starting from</span> ₹6,500 <small>/ seat / month *</small></p>
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
                  loading="lazy"
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
                  loading="lazy"
                  sizes="(max-width: 760px) 50vw, 30vw"
                />
                <figcaption>Managed end-to-end</figcaption>
              </figure>
            </div>

            <LeadForm locations={locations} />
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
                    {location.available ? (
                      <div>
                        <span>{location.seats}</span>
                        <strong>{location.price} ✓ Available Now</strong>
                      </div>
                    ) : (
                      <div className="fully-leased-status">
                        <strong>{location.seats}</strong>
                        <strong>{location.price}</strong>
                      </div>
                    )}
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
                ["Cost per Seat (Gurgaon)", "₹6,500–15,000/mo", "Varies by location", "Varies by provider"],
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
        <div className="footer-bottom"><span>© 2026 AIHP. All rights reserved.</span><span><a href="https://aihp.in/privacy">Privacy</a> · <a href="https://aihp.in/terms">Terms</a></span></div>
      </footer>

      <a className="mobile-sticky" href="#quote-form">Get my office plan</a>
    </>
  );
}
