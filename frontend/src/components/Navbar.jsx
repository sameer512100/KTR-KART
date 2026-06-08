import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, LogOut, MessageSquare, PlusCircle, User, Home, Layers, Download } from "lucide-react";

const resolveProfilePhotoUrl = (value) => {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return value;
  }

  const apiBase = import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "";
  return `${apiBase}${value.startsWith("/") ? value : `/${value}`}`;
};

export const Navbar = () => {
  const { user, signout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredInstallPrompt(null);
      setCanInstall(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleSignout = () => {
    signout();
    navigate("/");
  };

  const handleInstallApp = async () => {
    if (!deferredInstallPrompt) {
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    setDeferredInstallPrompt(null);
    setCanInstall(false);
  };

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <nav className="glass-panel navbar-container site-navbar" style={{
        position: "sticky",
        top: "1rem",
        zIndex: 1000,
        margin: "0 auto 1rem",
        maxWidth: "1200px",
        width: "calc(100% - 2rem)",
        padding: "1rem 2rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-glass)"
      }}>
        <Link to="/" style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <div style={{
            background: "linear-gradient(135deg, var(--accent), #ff9900)",
            color: "#090d16",
            padding: "0.4rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 10px rgba(255,179,0,0.3)"
          }}>
            <ShoppingCart size={20} />
          </div>
          <span className="brand-wordmark" style={{
            fontFamily: "var(--font-title)",
            fontWeight: 800,
            fontSize: "1.4rem",
            letterSpacing: "-0.5px"
          }}>
            <span style={{ color: "#ffffff" }}>KTR</span>
            <span style={{ color: "var(--accent)" }}>-KART</span>
          </span>
        </Link>

      </nav>
    );
  }

  return (
    <nav className="glass-panel navbar-container site-navbar" style={{
      position: "sticky",
      top: "1rem",
      zIndex: 1000,
      margin: "0 auto 1rem",
      maxWidth: "1200px",
      width: "calc(100% - 2rem)",
      padding: "1rem 2rem",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-glass)"
    }}>
      <Link to="/" style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <div style={{
          background: "linear-gradient(135deg, var(--accent), #ff9900)",
          color: "#090d16",
          padding: "0.4rem",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 10px rgba(255,179,0,0.3)"
        }}>
          <ShoppingCart size={20} />
        </div>
        <span className="brand-wordmark" style={{
          fontFamily: "var(--font-title)",
          fontWeight: 800,
          fontSize: "1.4rem",
          letterSpacing: "-0.5px"
        }}>
          <span style={{ color: "#ffffff" }}>KTR</span>
          <span style={{ color: "var(--accent)" }}>-KART</span>
        </span>
      </Link>

      <div className="nav-links">
        <Link to="/" style={{
          textDecoration: "none",
          color: isActive("/") ? "var(--accent)" : "var(--text-secondary)",
          fontFamily: "var(--font-title)",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          fontSize: "0.95rem",
          padding: "0.5rem 0.75rem",
          borderRadius: "var(--radius-sm)",
          background: isActive("/") ? "rgba(255, 179, 0, 0.08)" : "transparent",
          transition: "var(--transition-smooth)"
        }}>
          <Home size={16} />
          Market
        </Link>

        {user ? (
          <>
            <Link to="/list-product" style={{
              textDecoration: "none",
              color: isActive("/list-product") ? "var(--primary)" : "var(--text-secondary)",
              fontFamily: "var(--font-title)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.95rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              background: isActive("/list-product") ? "rgba(26, 128, 230, 0.08)" : "transparent",
              transition: "var(--transition-smooth)"
            }}>
              <PlusCircle size={16} />
              Sell
            </Link>

            <Link to="/chats" style={{
              textDecoration: "none",
              color: isActive("/chats") ? "var(--primary)" : "var(--text-secondary)",
              fontFamily: "var(--font-title)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.95rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              background: isActive("/chats") ? "rgba(26, 128, 230, 0.08)" : "transparent",
              transition: "var(--transition-smooth)"
            }}>
              <MessageSquare size={16} />
              Inbox
            </Link>

            <Link to="/manage-products" style={{
              textDecoration: "none",
              color: isActive("/manage-products") ? "var(--primary)" : "var(--text-secondary)",
              fontFamily: "var(--font-title)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.95rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              background: isActive("/manage-products") ? "rgba(26, 128, 230, 0.08)" : "transparent",
              transition: "var(--transition-smooth)"
            }}>
              <Layers size={16} />
              Manage
            </Link>

            <div className="nav-divider" style={{
              height: "24px",
              width: "1px",
              background: "var(--border-glass)",
              margin: "0 0.5rem"
            }} />

            <Link to="/profile" className="nav-profile-bubble" style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "rgba(255, 255, 255, 0.02)",
              padding: "0.35rem 0.85rem",
              borderRadius: "50px",
              border: isActive("/profile") ? "1px solid var(--primary)" : "1px solid var(--border-glass)",
              transition: "var(--transition-smooth)"
            }}>
              <div style={{
                background: "rgba(26, 128, 230, 0.2)",
                color: "var(--primary)",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}>
                {user.profilePhoto ? (
                  <img src={resolveProfilePhotoUrl(user.profilePhoto)} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User size={14} />
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                <span style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#ffffff"
                }}>{user.name}</span>
                <span style={{
                  fontSize: "0.7rem",
                  color: "var(--accent)",
                  fontWeight: 500,
                  textTransform: "uppercase"
                }}>{user.hostel}</span>
              </div>
            </Link>

            <button
              onClick={handleSignout}
              className="btn-secondary"
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "#ff4d4d",
                borderColor: "rgba(255, 77, 77, 0.2)"
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>

            {canInstall && (
              <button
                onClick={handleInstallApp}
                className="btn-secondary"
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  color: "var(--accent)",
                  borderColor: "rgba(255, 179, 0, 0.25)"
                }}
              >
                <Download size={15} />
                Install App
              </button>
            )}
          </>
        ) : (
          <>
            <Link to="/signin" className="btn-secondary" style={{
              textDecoration: "none",
              padding: "0.5rem 1rem",
              fontSize: "0.9rem"
            }}>
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary" style={{
              textDecoration: "none",
              padding: "0.5rem 1rem",
              fontSize: "0.9rem"
            }}>
              Sign Up
            </Link>

            {canInstall && (
              <button
                onClick={handleInstallApp}
                className="btn-secondary"
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  color: "var(--accent)",
                  borderColor: "rgba(255, 179, 0, 0.25)"
                }}
              >
                <Download size={15} />
                Install App
              </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
