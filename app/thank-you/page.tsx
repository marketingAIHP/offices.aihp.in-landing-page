export default function ThankYouPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px",
        background: "#f9fafb",
        color: "#051622",
      }}
    >
      <section
        style={{
          width: "min(100%, 720px)",
          padding: "48px 32px",
          background: "#ffffff",
          border: "1px solid rgba(5, 22, 34, 0.12)",
          textAlign: "center",
          boxShadow: "0 18px 60px rgba(5, 22, 34, 0.08)",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#128aa0",
            fontWeight: 700,
          }}
        >
          Request received
        </p>
        <h1
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1,
          }}
        >
          Thank you.
        </h1>
        <p
          style={{
            margin: "0 auto",
            maxWidth: "44rem",
            fontSize: "18px",
            lineHeight: 1.7,
            color: "#1a2b47",
          }}
        >
          Our leasing team will review your requirements and get back to you within 24
          hours with a tailored office plan.
        </p>
      </section>
    </main>
  );
}
