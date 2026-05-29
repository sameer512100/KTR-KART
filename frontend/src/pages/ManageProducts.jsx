import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE, useAuth } from "../context/AuthContext";
import { Trash2, Edit3, Save, X, ShoppingBag, MapPin, Plus, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

const CATEGORIES = ["Books", "Electronics", "Hostel Essentials", "Cycles", "Others"];

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

export default function ManageProducts() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editHostel, setEditHostel] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const fetchMyProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/products/my-listings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to retrieve your listings");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (_err) {
      setError("Unable to retrieve your products. Check server status.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchMyProducts();
    }
  }, [token, fetchMyProducts]);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to permanently delete this product listing from KTR-KART?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete product");

      setSuccess("Listing successfully deleted!");
      setProducts(products.filter((p) => p._id !== productId));
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Could not delete listing. Try again later.");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditTitle(product.title);
    setEditDescription(product.description || "");
    setEditPrice(product.price.toString());
    setEditQuantity(product.quantity ? product.quantity.toString() : "1");
    setEditCategory(product.category);
    setEditHostel(product.hostel);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setEditLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/products/${editingProduct}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          category: editCategory,
          price: Number(editPrice),
          quantity: Number(editQuantity),
          hostel: editHostel
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update product");

      setSuccess("Listing successfully updated!");
      setEditingProduct(null);
      fetchMyProducts();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to save edits.");
    } finally {
      setEditLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "var(--text-secondary)" }}>Please sign in to manage your products.</p>
      </div>
    );
  }

  return (
    <div className="page-container manage-page animate-fade-in" style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 1rem" }}>
      <div className="page-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <button 
          onClick={() => navigate(-1)}
          className="btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-sm)"
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <Link to="/list-product" className="btn-primary" style={{
          textDecoration: "none",
          padding: "0.5rem 1.25rem",
          fontSize: "0.9rem"
        }}>
          <Plus size={16} />
          Add New Product
        </Link>
      </div>

      <div className="glass-panel" style={{
        padding: "2.5rem",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-glass)",
        marginBottom: "2rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          <div style={{
            background: "rgba(255, 179, 0, 0.15)",
            color: "var(--accent)",
            padding: "0.5rem",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center"
          }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.6rem" }}>Manage Your Products</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Edit pricing, inventory, descriptions, or delete sold listings
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

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
            <p style={{ fontSize: "1.1rem" }}>Loading...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            padding: "4rem 2rem",
            textAlign: "center",
            background: "rgba(0,0,0,0.1)",
            borderRadius: "var(--radius-md)",
            border: "1px dashed var(--border-glass)"
          }}>
            <ShoppingBag size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No Active Listings</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              You currently do not have any active product listings on KTR-KART.
            </p>
            <Link to="/list-product" className="btn-primary" style={{ textDecoration: "none", fontSize: "0.9rem" }}>
              <Plus size={16} />
              List an Item
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {products.map((product) => (
              <div key={product._id} className={`glass-card ${editingProduct === product._id ? "" : "manage-product-card"}`} style={{
                padding: "1.25rem",
                borderRadius: "var(--radius-md)",
                background: editingProduct === product._id ? "rgba(26, 128, 230, 0.03)" : "var(--bg-card)",
                borderColor: editingProduct === product._id ? "var(--primary)" : "var(--border-glass)",
                transition: "all 0.3s ease"
              }}>
                
                {editingProduct !== product._id && (
                  <>
                    <div className="edit-product-grid" style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      background: "rgba(0,0,0,0.2)"
                    }}>
                      <img 
                        src={product.imageUrl.startsWith("data:") ? product.imageUrl : `${API_BASE}${product.imageUrl}`} 
                        alt={product.title} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="badge badge-blue" style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem" }}>
                          {product.category}
                        </span>
                        <span style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          textTransform: "capitalize",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}>
                          <MapPin size={12} />
                          {product.hostel}
                        </span>
                      </div>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ffffff" }}>{product.title}</h4>
                      
                      <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.25rem" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>PRICE</span>
                          <span style={{ fontSize: "1rem", color: "var(--accent)", fontWeight: 800 }}>₹{product.price}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>STOCK QUANTITY</span>
                          <span style={{ fontSize: "1rem", color: "#ffffff", fontWeight: 700 }}>
                            {product.quantity || 1} units
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="btn-secondary"
                        style={{
                          padding: "0.5rem",
                          borderRadius: "var(--radius-sm)",
                          color: "#66a3ff",
                          borderColor: "rgba(26, 128, 230, 0.2)"
                        }}
                        title="Edit Listing"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="btn-secondary"
                        style={{
                          padding: "0.5rem",
                          borderRadius: "var(--radius-sm)",
                          color: "#ff4d4d",
                          borderColor: "rgba(255, 77, 77, 0.2)"
                        }}
                        title="Delete Listing"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}

                {editingProduct === product._id && (
                  <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem" }}>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}>Editing listing settings</h4>
                      <button 
                        type="button" 
                        onClick={handleCancelEdit}
                        style={{ border: "none", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="edit-product-grid">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Listing Title</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          required
                          value={editTitle} 
                          onChange={(e) => setEditTitle(e.target.value)} 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Price (INR)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          min={0}
                          required
                          value={editPrice} 
                          onChange={(e) => setEditPrice(e.target.value)} 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Quantity</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          min={0}
                          required
                          value={editQuantity} 
                          onChange={(e) => setEditQuantity(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="edit-meta-grid">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Category</label>
                        <select 
                          className="form-select" 
                          required
                          value={editCategory} 
                          onChange={(e) => setEditCategory(e.target.value)}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Hostel Coordinate</label>
                        <select 
                          className="form-select" 
                          required
                          value={editHostel} 
                          onChange={(e) => setEditHostel(e.target.value)}
                        >
                          {HOSTELS.map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Description (Optional)</label>
                      <textarea 
                        className="form-input" 
                        rows={3} 
                        style={{ resize: "vertical" }}
                        value={editDescription} 
                        onChange={(e) => setEditDescription(e.target.value)} 
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                      <button 
                        type="button" 
                        onClick={handleCancelEdit}
                        className="btn-secondary"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={editLoading}
                        className="btn-primary"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                      >
                        <Save size={14} />
                        {editLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                  </form>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
