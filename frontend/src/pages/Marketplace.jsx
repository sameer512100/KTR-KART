import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_BASE, useAuth } from "../context/AuthContext";
import { Search, MapPin, Plus, ShoppingBag, Eye, Calendar } from "lucide-react";

const CATEGORIES = ["All", "Books", "Electronics", "Hostel Essentials", "Cycles", "Others"];

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

export default function Marketplace() {
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = selectedHostel
        ? `${API_BASE}/api/products?hostel=${encodeURIComponent(selectedHostel)}`
        : `${API_BASE}/api/products`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (_err) {
      setError("Unable to retrieve listings. Check if database is active.");
    } finally {
      setLoading(false);
    }
  }, [selectedHostel]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getRelativeTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const seconds = Math.floor((new Date() - date) / 1000);
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return `${interval}y ago`;
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return `${interval}mo ago`;
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval}d ago`;
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return `${interval}h ago`;
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return `${interval}m ago`;
      return "just now";
    } catch {
      return "recently";
    }
  };

  return (
    <div className="page-container marketplace-page animate-fade-in">
      
      <div className="glass-panel marketplace-hero" style={{
        padding: "3rem 2rem",
        textAlign: "center",
        borderRadius: "var(--radius-lg)",
        marginBottom: "2.5rem",
        background: "linear-gradient(135deg, rgba(26, 128, 230, 0.1) 0%, rgba(255, 179, 0, 0.05) 100%), var(--bg-card)",
        border: "1px solid var(--border-glass)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem"
      }}>
        <h1 className="marketplace-title" style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-1px" }}>
          SRM campus peer-trading, <span className="text-gradient-primary">simplified.</span>
        </h1>
        <p className="marketplace-subtitle" style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px" }}>
          Buy, sell, and rent essentials directly inside your hostels. No shipping, no fees - just verify your email, list items, meet up, and trade!
        </p>

        <div style={{
          position: "relative",
          maxWidth: "600px",
          width: "100%",
          marginTop: "1rem"
        }}>
          <Search size={18} style={{
            position: "absolute",
            left: "1.25rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)"
          }} />
          <input
            type="text"
            className="form-input"
            style={{
              width: "100%",
              padding: "1rem 1rem 1rem 3rem",
              fontSize: "1rem",
              borderRadius: "var(--radius-md)",
              background: "rgba(9, 13, 22, 0.8)",
              border: "1px solid var(--border-glass)"
            }}
            placeholder="Search for books, routers, kettles, drafters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="marketplace-layout">
        
        <aside className="glass-panel hostel-sidebar-wrapper" style={{
          padding: "1.5rem",
          borderRadius: "var(--radius-md)",
          position: "sticky",
          top: "6.5rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <MapPin size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ fontSize: "1.1rem" }} className="inbox-sidebar-mobile-hide">Hostel Location</h3>
          </div>

          <div className="hostel-sidebar">
            <button
              onClick={() => setSelectedHostel("")}
              className="btn-secondary"
              style={{
                width: "100%",
                justifyContent: "flex-start",
                padding: "0.5rem 0.75rem",
                fontSize: "0.9rem",
                borderRadius: "var(--radius-sm)",
                borderColor: selectedHostel === "" ? "var(--primary)" : "var(--border-glass)",
                background: selectedHostel === "" ? "rgba(26, 128, 230, 0.08)" : "transparent",
                color: selectedHostel === "" ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              All Hostels
            </button>
            {HOSTELS.map((hostel) => (
              <button
                key={hostel}
                onClick={() => setSelectedHostel(hostel)}
                className="btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.9rem",
                  textTransform: "capitalize",
                  borderRadius: "var(--radius-sm)",
                  borderColor: selectedHostel === hostel ? "var(--primary)" : "var(--border-glass)",
                  background: selectedHostel === hostel ? "rgba(26, 128, 230, 0.08)" : "transparent",
                  color: selectedHostel === hostel ? "#ffffff" : "var(--text-secondary)",
                }}
              >
                {hostel}
              </button>
            ))}
          </div>
        </aside>

        <main style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className="marketplace-toolbar" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid var(--border-glass)"
          }}>
            <div className="category-tabs" style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "2px" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    border: "none",
                    background: selectedCategory === cat ? "var(--primary)" : "rgba(255, 255, 255, 0.03)",
                    color: selectedCategory === cat ? "#ffffff" : "var(--text-secondary)",
                    padding: "0.5rem 1rem",
                    borderRadius: "50px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)",
                    whiteSpace: "nowrap"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {user && (
              <Link to="/list-product" className="btn-primary" style={{
                textDecoration: "none",
                fontSize: "0.85rem",
                padding: "0.5rem 1rem"
              }}>
                <Plus size={16} />
                List Item
              </Link>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
              <p style={{ fontSize: "1.1rem" }}>Loading...</p>
            </div>
          ) : error ? (
            <div className="glass-panel" style={{
              padding: "3rem 2rem",
              textAlign: "center",
              borderColor: "rgba(239, 68, 68, 0.2)"
            }}>
              <p style={{ color: "var(--error)", fontWeight: 600, fontSize: "1.1rem" }}>{error}</p>
              <button
                onClick={fetchProducts}
                className="btn-secondary"
                style={{ marginTop: "1rem", fontSize: "0.9rem" }}
              >
                Retry Connection
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass-panel" style={{
              padding: "4rem 2rem",
              textAlign: "center",
              borderRadius: "var(--radius-md)"
            }}>
              <ShoppingBag size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
              <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>No Listings Found</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                Be the first to list a product in this hostel/category!
              </p>
              {user && (
                <Link to="/list-product" className="btn-primary" style={{
                  textDecoration: "none",
                  marginTop: "1.5rem",
                  fontSize: "0.9rem"
                }}>
                  <Plus size={16} />
                  Add a Listing
                </Link>
              )}
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product._id} className="glass-card" style={{
                  padding: 0,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%"
                }}>
                  
                  <div className="product-media" style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "75%",
                    background: "rgba(0,0,0,0.2)"
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
                    <div style={{
                      position: "absolute",
                      top: "0.75rem",
                      right: "0.75rem",
                      background: "rgba(9, 13, 22, 0.8)",
                      border: "1px solid var(--border-glass)",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-title)",
                      fontWeight: 800,
                      color: "var(--accent)",
                      fontSize: "0.95rem"
                    }}>
                      ₹{product.price}
                    </div>
                  </div>

                  <div style={{
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    flexGrow: 1
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "0.5rem" }}>
                      <span className="badge badge-blue" style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem" }}>
                        {product.category}
                      </span>
                      <span style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem"
                      }}>
                        <Calendar size={12} />
                        {getRelativeTime(product.createdAt)}
                      </span>
                    </div>

                    <h4 style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      lineHeight: "1.3",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      minHeight: "2.8rem"
                    }}>{product.title}</h4>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      marginTop: "auto"
                    }}>
                      <MapPin size={14} style={{ color: "var(--accent)" }} />
                      <span style={{ textTransform: "capitalize", fontWeight: 500 }}>
                        {product.hostel} Hostel
                      </span>
                    </div>
                  </div>

                  <div style={{
                    borderTop: "1px solid var(--border-glass)",
                    padding: "0.75rem 1.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(255, 255, 255, 0.01)"
                  }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Seller: {product.seller?.name || product.sellerName || "Student"}
                    </span>
                    <Link to={`/product/${product._id}`} className="btn-secondary view-details-btn" style={{
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.8rem",
                      gap: "0.3rem",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      background: "rgba(26, 128, 230, 0.15)",
                      color: "#66a3ff"
                    }}>
                      <Eye size={12} />
                      View Details
                    </Link>
                  </div>

                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
