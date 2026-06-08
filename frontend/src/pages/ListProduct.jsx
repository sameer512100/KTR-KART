import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, useAuth } from "../context/AuthContext";
import { PlusCircle, ShoppingBag, DollarSign, List, Home, AlertCircle, FileImage } from "lucide-react";

const CATEGORIES = ["Snacks", "Electronics", "Hostel Essentials", "Cycles", "Others"];

const HOSTELS = [
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

export default function ListProduct() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Snacks");
  const [price, setPrice] = useState("");
  const [hostel, setHostel] = useState(user?.hostel || "paari");
  
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are permitted.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setImagePreview(dataUrl);
          setError("");
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!imagePreview) {
      setError("Please select a product listing image.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          price: Number(price),
          hostel,
          image: imagePreview,
          quantity: 1
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create product listing");

      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to submit listing. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container list-product-page animate-fade-in" style={{
      maxWidth: "750px",
      margin: "0 auto",
      padding: "1rem"
    }}>
      <div className="glass-panel" style={{
        padding: "2.5rem",
        borderRadius: "var(--radius-lg)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          <div className="upload-split" style={{
            background: "rgba(26, 128, 230, 0.15)",
            color: "var(--primary)",
            padding: "0.5rem",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center"
          }}>
            <PlusCircle size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.6rem" }}>List a Product</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Reach out to thousands of SRM students across hostels
            </p>
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div className="upload-split">
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span className="form-label">Product Image</span>
              <label style={{
                height: "220px",
                border: "2px dashed var(--border-glass)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "1rem",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                transition: "var(--transition-smooth)",
                background: "rgba(0,0,0,0.15)"
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  if (!file.type.startsWith("image/")) {
                    setError("Only image files are permitted.");
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      const MAX_WIDTH = 800;
                      const MAX_HEIGHT = 800;
                      let width = img.width;
                      let height = img.height;

                      if (width > height) {
                        if (width > MAX_WIDTH) {
                          height *= MAX_WIDTH / width;
                          width = MAX_WIDTH;
                        }
                      } else {
                        if (height > MAX_HEIGHT) {
                          width *= MAX_HEIGHT / height;
                          height = MAX_HEIGHT;
                        }
                      }

                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext("2d");
                      ctx.drawImage(img, 0, 0, width, height);

                      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                      setImagePreview(dataUrl);
                      setError("");
                    };
                    img.src = event.target.result;
                  };
                  reader.readAsDataURL(file);
                }
              }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0
                    }}
                  />
                ) : (
                  <>
                    <FileImage size={36} style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Drag & Drop Image</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      or click to browse
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
                Supports PNG, JPG, or JPEG. Max size 5MB.
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="title">
                  Listing Title
                </label>
                <div style={{ position: "relative" }}>
                  <ShoppingBag size={16} style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)"
                  }} />
                  <input
                    type="text"
                    id="title"
                    className="form-input"
                    style={{ paddingLeft: "2.75rem", width: "100%" }}
                    placeholder="e.g. SRM reference book, router..."
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-split-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="price">
                    Price (INR)
                  </label>
                  <div style={{ position: "relative" }}>
                    <DollarSign size={16} style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)"
                    }} />
                    <input
                      type="number"
                      id="price"
                      className="form-input"
                      style={{ paddingLeft: "2.75rem", width: "100%" }}
                      placeholder="₹"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="category">
                    Category
                  </label>
                  <div style={{ position: "relative" }}>
                    <List size={16} style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                      zIndex: 2
                    }} />
                    <select
                      id="category"
                      className="form-select"
                      style={{ paddingLeft: "2.75rem", width: "100%" }}
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="hostel">
                  Hostel Availability
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
                    {HOSTELS.map((h) => (
                      <option key={h} value={h}>{h} Hostel</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Listing Description (Optional)
            </label>
            <textarea
              id="description"
              className="form-input"
              rows={4}
              style={{ width: "100%", resize: "vertical" }}
              placeholder="State the item's condition, usage duration, details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: "1rem", padding: "0.9rem" }}
          >
            {loading ? "Publishing listing..." : "Publish Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
