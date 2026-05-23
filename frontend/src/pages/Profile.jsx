import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, API_BASE } from "../context/AuthContext";
import { Camera, User, Mail, Home, Bed, Save, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

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

export default function Profile() {
  const { user, token, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [hostel, setHostel] = useState(user?.hostel || "");
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || "");
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");
  
  const [hostelsList, setHostelsList] = useState(FALLBACK_HOSTELS);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  // Fetch allowed hostels from backend dynamically
  useEffect(() => {
    fetch(`${API_BASE}/api/meta/hostels`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hostels) {
          setHostelsList(data.hostels);
        }
      })
      .catch((err) => console.log("Failed to fetch hostels, using fallback list.", err));
  }, []);

  // Update form if user data loads after initial render
  useEffect(() => {
    if (user) {
      setName(user.name);
      setHostel(user.hostel);
      setRoomNumber(user.roomNumber);
      setProfilePhoto(user.profilePhoto || "");
    }
  }, [user]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Limit to 2MB to keep Base64 strings reasonable in MongoDB
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePhoto(event.target.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateUserProfile({
        name,
        hostel,
        roomNumber,
        profilePhoto
      });
      setSuccess("Profile updated successfully!");
      // Clear success banner after 4 seconds
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "var(--text-secondary)" }}>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "600px",
      margin: "2rem auto",
      padding: "0 1rem"
    }} className="animate-fade-in">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="btn-secondary"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          marginBottom: "1.5rem",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer"
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="glass-panel" style={{
        padding: "2.5rem",
        borderRadius: "var(--radius-lg)",
        position: "relative",
        border: "1px solid var(--border-glass)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Edit Profile</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Keep your campus coordinates and contact details up-to-date
          </p>
        </div>

        {/* Profile photo section */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2.5rem",
          position: "relative"
        }}>
          <div 
            onClick={handlePhotoClick}
            style={{
              position: "relative",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              cursor: "pointer",
              border: "3px solid var(--primary)",
              boxShadow: "0 0 20px rgba(26, 128, 230, 0.25)",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}
            className="profile-photo-container"
          >
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt="Profile Avatar" 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }} 
              />
            ) : (
              <User size={50} style={{ color: "var(--text-muted)" }} />
            )}
            
            {/* Camera Overlay */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(9, 13, 22, 0.8)",
              height: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              transition: "var(--transition-smooth)"
            }}>
              <Camera size={16} />
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*"
            style={{ display: "none" }} 
          />
          
          <span style={{ 
            fontSize: "0.8rem", 
            color: "var(--text-muted)", 
            marginTop: "0.75rem" 
          }}>
            Click to upload custom profile photo (Max 2MB)
          </span>
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

        {success && (
          <div style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            color: "var(--success)",
            padding: "0.85rem 1rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem"
          }}>
            <CheckCircle size={16} />
            <span>{success}</span>
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
                placeholder="Your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Official SRM Email
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
                style={{ 
                  paddingLeft: "2.75rem", 
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.01)",
                  color: "var(--text-muted)",
                  cursor: "not-allowed"
                }}
                disabled
                value={user.email}
              />
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
              Email address cannot be changed as it is linked to your campus verification.
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "1rem",
            marginBottom: "1.5rem"
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="hostel">
                Campus Hostel
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
                  placeholder="e.g. 302"
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
            style={{ 
              width: "100%", 
              justifyContent: "center", 
              marginTop: "2rem", 
              padding: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <Save size={18} />
            {loading ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
