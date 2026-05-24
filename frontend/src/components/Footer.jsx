export const Footer = () => {
  return (
    <footer className="site-footer" style={{
      maxWidth: "1200px",
      margin: "4rem auto 2rem auto",
      padding: "2rem 1rem",
      borderTop: "1px solid var(--border-glass)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.75rem",
      color: "var(--text-muted)",
      fontSize: "0.85rem",
      textAlign: "center"
    }}>
      <div style={{
        fontFamily: "var(--font-title)",
        fontWeight: 700,
        fontSize: "1rem",
        color: "var(--text-secondary)"
      }}>
        KTR<span style={{ color: "var(--accent)" }}>-KART</span>
      </div>
      <p>© {new Date().getFullYear()} KTR-KART. Developed exclusively for SRM IST students.</p>
      <p style={{
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        maxWidth: "600px",
        lineHeight: "1.4"
      }}>
        Disclaimer: This is an internal campus student-to-student marketplace. All trades must be conducted safely inside authorized hostel lobbies or public campus dining venues. Keep it clean, KTR!
      </p>
    </footer>
  );
};
