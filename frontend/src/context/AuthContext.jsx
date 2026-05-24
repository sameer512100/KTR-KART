import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

const AuthContext = createContext(null);

const configuredApiBase = import.meta.env.VITE_API_BASE;
if (!configuredApiBase) {
  throw new Error("VITE_API_BASE is required. Set it to your backend URL.");
}
export const API_BASE = configuredApiBase.replace(/\/+$/, "");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ktr_kart_token") || "");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  const signout = useCallback(() => {
    localStorage.removeItem("ktr_kart_token");
    setToken("");
    setUser(null);
    setSocket((currentSocket) => {
      currentSocket?.disconnect();
      return null;
    });
  }, []);

  // Auto fetch user profile if token is present
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          signout();
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token, signout]);

  // Handle Socket.IO connection when user & token are present
  useEffect(() => {
    if (user && token) {
      const newSocket = io(API_BASE, {
        auth: { token },
      });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server as user:", user.id);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      setSocket((currentSocket) => {
        currentSocket?.close();
        return null;
      });
    }
  }, [user, token]);

  const initiateSignup = async ({ name, email, password, hostel, roomNumber }) => {
    const res = await fetch(`${API_BASE}/api/auth/signup/initiate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, hostel, roomNumber }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to initiate signup");
    return data;
  };

  const verifySignup = async ({ email, otp }) => {
    const res = await fetch(`${API_BASE}/api/auth/signup/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to verify OTP");
    
    // Auto login
    localStorage.setItem("ktr_kart_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signin = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Invalid credentials");
    
    localStorage.setItem("ktr_kart_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const updateUserProfile = async ({ name, hostel, roomNumber, profilePhoto }) => {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, hostel, roomNumber, profilePhoto }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update profile");
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        socket,
        loading,
        initiateSignup,
        verifySignup,
        signin,
        signout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
