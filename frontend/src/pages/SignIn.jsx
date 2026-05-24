import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Key, Mail, AlertCircle } from "lucide-react";

export default function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signin(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
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
            background: "rgba(26, 128, 230, 0.15)",
            color: "var(--primary)",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem"
          }}>
            <LogIn size={26} />
          </div>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Welcome Back</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Sign in to start trading within SRM Hostels
          </p>
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
            <label className="form-label" htmlFor="email">
              SRM Student Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }} />
              <input
                type="email"
                id="email"
                className="form-input"
                style={{ paddingLeft: "2.75rem", width: "100%" }}
                placeholder="your_netid@srmist.edu.in"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Key size={16} style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }} />
              <input
                type="password"
                id="password"
                className="form-input"
                style={{ paddingLeft: "2.75rem", width: "100%" }}
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: "1rem", padding: "0.9rem" }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={{
          marginTop: "1.75rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "var(--text-secondary)"
        }}>
          New to KTR-KART?{" "}
          <Link to="/signup" style={{
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 600
          }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
