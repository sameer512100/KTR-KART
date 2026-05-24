import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, API_BASE } from "../context/AuthContext";
import { UserPlus, User, Mail, Key, Home, Bed, AlertCircle } from "lucide-react";

const FALLBACK_HOSTELS = [
  "paari",
  "kaari",
  "oori",
  "adhiyaman",
  "nelson mandela",
  "manoranjitham",
  "mullai",
  "sannasi a",
  "agasthiyar",
  "began"
];

export default function SignUp() {
  const { initiateSignup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hostel, setHostel] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const [hostelsList, setHostelsList] = useState(FALLBACK_HOSTELS);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch allowed hostels list from backend dynamically
  useEffect(() => {
    fetch(`${API_BASE}/api/meta/hostels`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hostels) {
          setHostelsList(data.hostels);
          // Set initial selection
          if (data.hostels.length > 0) setHostel(data.hostels[0]);
        }
      })
      .catch((err) => console.log("Failed to fetch hostels, using fallback list.", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Strict email check
    if (!email.toLowerCase().trim().endsWith("@srmist.edu.in")) {
      setError("Only official SRM student emails (@srmist.edu.in) are allowed.");
      return;
    }

    setLoading(true);

    try {
      await initiateSignup({ name, email, password, hostel, roomNumber });
      // Redirect to verification view
      navigate(`/verify-otp?email=${encodeURIComponent(email.toLowerCase().trim())}`);
    } catch (err) {
      setError(err.message || "Failed to initiate signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      padding: "2rem 1rem",
    }}>
      <div className="glass-panel auth-card" style={{
        maxWidth: "500px",
        width: "100%",
        padding: "2.5rem",
        borderRadius: "var(--radius-lg)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="form-split-grid" style={{
            background: "rgba(255, 179, 0, 0.15)",
            color: "var(--accent)",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem"
          }}>
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Student Signup</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Create an account to start peer-trading inside SRM KTR campus
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
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }} />
              <input
                type="text"
                id="name"
                className="form-input"
                style={{ paddingLeft: "2.75rem", width: "100%" }}
                placeholder="Enter full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              SRM Official Email
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
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "1rem",
            marginBottom: "1rem"
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="hostel">
                Select Hostel
              </label>
              <div style={{ position: "relative" }}>
                <Home size={16} style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  zIndex: 2
                }} />
                <select
                  id="hostel"
                  className="form-select"
                  style={{ paddingLeft: "2.75rem", width: "100%" }}
                  required
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                >
                  <option value="" disabled>Select...</option>
                  {hostelsList.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="roomNumber">
                Room No
              </label>
              <div style={{ position: "relative" }}>
                <Bed size={16} style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)"
                }} />
                <input
                  type="text"
                  id="roomNumber"
                  className="form-input"
                  style={{ paddingLeft: "2.75rem", width: "100%" }}
                  placeholder="302"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem", padding: "0.9rem" }}
          >
            {loading ? "Registering..." : "Send Verification OTP"}
          </button>
        </form>

        <div style={{
          marginTop: "1.75rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "var(--text-secondary)"
        }}>
          Already have an account?{" "}
          <Link to="/signin" style={{
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 600
          }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
