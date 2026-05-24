import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE, useAuth } from "../context/AuthContext";
import { MessageSquare, MapPin, ArrowLeft, User, ShieldAlert, Calendar } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const normalizeId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") return value._id ? String(value._id) : "";
    return String(value);
  };

  const sellerId = normalizeId(product?.sellerId) || normalizeId(product?.seller?._id) || normalizeId(product?.seller);
  const sellerName = product?.seller?.name || product?.sellerName || "Student";
  const sellerHostel = product?.seller?.hostel || product?.sellerHostel || product?.hostel || "";
  const sellerRoomNumber = product?.seller?.roomNumber || product?.sellerRoomNumber || "N/A";

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE}/api/products/${id}`);
        if (!response.ok) throw new Error("Listing not found");
        const data = await response.json();
        setProduct(data.product);
      } catch (_err) {
        setError("The product listing could not be retrieved. It may have been sold or removed.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleStartChat = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (!sellerId) {
      alert("This listing is missing seller details, so chat cannot be started.");
      return;
    }

    if (normalizeId(user?.id || user?._id) === sellerId) {
      alert("You cannot start a chat thread on your own product listing!");
      return;
    }

    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chats/${sellerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: `Hey! I'm interested in your listed item: "${product.title}"`,
          productId: product._id
        })
      });

      if (!response.ok) throw new Error("Could not initiate chat connection");

      navigate(`/chats?selectUser=${sellerId}`);
    } catch (_err) {
      alert("Unable to open chat thread at this moment. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "8rem 2rem", color: "var(--text-secondary)" }}>
        <p style={{ fontSize: "1.1rem" }}>Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "3rem auto", padding: "1rem" }}>
        <div className="glass-panel" style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <ShieldAlert size={48} style={{ color: "var(--error)", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Failed to Load</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{error || "An error occurred."}</p>
          <Link to="/" className="btn-secondary" style={{ marginTop: "1.5rem", textDecoration: "none" }}>
            <ArrowLeft size={16} />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container product-details-page animate-fade-in" style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "1rem"
    }}>
      <Link to="/" style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        color: "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: 600,
        marginBottom: "1.5rem",
        fontSize: "0.95rem"
      }}>
        <ArrowLeft size={16} />
        Back to Marketplace
      </Link>

      <div className="details-layout">
        
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
          <div style={{
            position: "relative",
            width: "100%",
            paddingTop: "75%",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden"
          }}>
            <img
              src={product.imageUrl.startsWith("data:") ? product.imageUrl : `${API_BASE}${product.imageUrl}`}
              alt={product.title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
            
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <span className="badge badge-blue" style={{ fontSize: "0.75rem" }}>{product.category}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Calendar size={13} />
                Posted: {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: 800, lineHeight: "1.25", marginBottom: "1rem" }}>
              {product.title}
            </h1>

            <div style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "var(--accent)",
              marginBottom: "1.5rem"
            }}>
              ₹{product.price}
            </div>

            {product.description && (
              <div style={{
                borderTop: "1px solid var(--border-glass)",
                paddingTop: "1.25rem",
                marginBottom: "1.5rem"
              }}>
                <h4 style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Item Description</h4>
                <p style={{
                  color: "var(--text-primary)",
                  lineHeight: "1.6",
                  fontSize: "0.95rem",
                  whiteSpace: "pre-line"
                }}>
                  {product.description}
                </p>
              </div>
            )}

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              background: "rgba(255, 255, 255, 0.02)",
              padding: "0.85rem 1.25rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-glass)"
            }}>
              <MapPin size={18} style={{ color: "var(--accent)" }} />
              <span style={{ textTransform: "capitalize" }}>
                Location: <strong>{product.hostel} Hostel</strong>
              </span>
            </div>

          </div>

          <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <User size={18} style={{ color: "var(--primary)" }} />
              Seller Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ color: "var(--text-secondary)", minWidth: "80px", fontSize: "0.9rem" }}>Name:</span>
                <span style={{ fontWeight: 600 }}>{sellerName}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ color: "var(--text-secondary)", minWidth: "80px", fontSize: "0.9rem" }}>Hostel:</span>
                <span style={{ textTransform: "capitalize", fontWeight: 500 }}>{sellerHostel} Hostel</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ color: "var(--text-secondary)", minWidth: "80px", fontSize: "0.9rem" }}>Room No:</span>
                <span style={{ fontWeight: 600, color: "var(--accent)" }}>{sellerRoomNumber}</span>
              </div>
            </div>

            {normalizeId(user?.id || user?._id) === sellerId ? (
              <div style={{
                background: "rgba(255, 179, 0, 0.05)",
                border: "1px solid rgba(255, 179, 0, 0.15)",
                borderRadius: "var(--radius-sm)",
                padding: "0.75rem",
                fontSize: "0.85rem",
                color: "var(--accent)",
                textAlign: "center",
                fontWeight: 500
              }}>
                This is your own listed product!
              </div>
            ) : (
              <button
                onClick={handleStartChat}
                disabled={chatLoading}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "0.9rem" }}
              >
                <MessageSquare size={18} />
                {chatLoading ? "Initiating thread..." : "Chat with Seller"}
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
