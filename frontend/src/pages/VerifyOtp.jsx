import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function VerifyOtp() {
  const { verifySignup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifySignup({ email, otp });
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid OTP code or pending expired. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "70vh",
      padding: "2rem 1rem",
    }}>
      <div className="glass-panel auth-card" style={{
        maxWidth: "450px",
        width: "100%",
        padding: "2.5rem",
        borderRadius: "var(--radius-lg)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            background: "rgba(16, 185, 129, 0.15)",
            color: "var(--success)",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem"
          }}>
            <ShieldCheck size={26} />
          </div>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Verify Email</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            We've sent a 6-digit OTP code to your official inbox:
          </p>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border-glass)",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-sm)",
            marginTop: "0.75rem",
            fontWeight: 500,
            fontSize: "0.9rem",
            color: "#ffffff"
          }}>
            <Mail size={14} style={{ color: "var(--accent)" }} />
            <span>{email || "student@srmist.edu.in"}</span>
          </div>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 110, 0.1)",
            border: "1px solid rgba(239, 68, 110, 0.25)",
            color: "var(--error)",
            padding: "0.85rem 1rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="otp" style={{ textAlign: "center" }}>
              Enter 6-Digit OTP
            </label>
            <input
              type="text"
              id="otp"
              className="form-input"
              style={{
                textAlign: "center",
                fontSize: "1.5rem",
                letterSpacing: "8px",
                fontWeight: 700,
                padding: "0.75rem 1rem",
                width: "100%"
              }}
              placeholder="000000"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem", padding: "0.9rem" }}
          >
            {loading ? "Verifying..." : "Verify & Log In"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{
          marginTop: "1.75rem",
          textAlign: "center",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          lineHeight: "1.4"
        }}>
          If you do not see the email in your primary inbox, please make sure to check your **Spam/Junk** folder.
        </div>
      </div>
    </div>
  );
}
