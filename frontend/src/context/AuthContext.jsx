import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";

const AuthContext = createContext(null);

const configuredApiBase = import.meta.env.VITE_API_BASE;
if (!configuredApiBase) {
  throw new Error("VITE_API_BASE is required. Set it to your backend URL.");
}
export const API_BASE = configuredApiBase.replace(/\/+$/, "");

const normalizeUser = (value) => {
  if (!value) {
    return null;
  }

  const id = value.id || value._id || "";
  return {
    ...value,
    id: String(id),
    _id: String(id)
  };
};

const resolveProfilePhotoUrl = (value) => {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return value;
  }

  return `${API_BASE}${value.startsWith("/") ? value : `/${value}`}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ktr_kart_token") || "");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const signout = useCallback(() => {
    localStorage.removeItem("ktr_kart_token");
    setToken("");
    setUser(null);
    setSocket((currentSocket) => {
      currentSocket?.disconnect();
      return null;
    });
  }, []);

  useEffect(() => {
    let isActive = true;
    const requestToken = token;

    const fetchMe = async () => {
      if (!token) {
        if (isActive) {
          setUser(null);
          setLoading(false);
        }
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
          if (isActive && tokenRef.current === requestToken) {
            setUser(normalizeUser(data.user));
          }
        } else if (isActive && tokenRef.current === requestToken) {
          signout();
        }
      } catch (_err) {
      } finally {
        if (isActive && tokenRef.current === requestToken) {
          setLoading(false);
        }
      }
    };

    fetchMe();
    return () => {
      isActive = false;
    };
  }, [token, signout]);

  useEffect(() => {
    if (user && token) {
      const newSocket = io(API_BASE, {
        auth: { token },
        transports: ["websocket", "polling"]
      });

      newSocket.on("connect", () => {});
      newSocket.on("connect_error", () => {});

      newSocket.on("disconnect", () => {});

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
    
    localStorage.setItem("ktr_kart_token", data.token);
    setToken(data.token);
    setUser(normalizeUser(data.user));
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
    setUser(normalizeUser(data.user));
    return data;
  };

  const updateUserProfile = async ({ name, hostel, roomNumber, profilePhoto }) => {
    const isFileUpload = typeof File !== "undefined" && profilePhoto instanceof File;
    const requestBody = isFileUpload ? new FormData() : JSON.stringify({ name, hostel, roomNumber, profilePhoto });

    if (isFileUpload) {
      requestBody.append("name", name);
      requestBody.append("hostel", hostel);
      requestBody.append("roomNumber", roomNumber);
      requestBody.append("profilePhoto", profilePhoto);
    }

    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: "PUT",
      headers: isFileUpload
        ? { Authorization: `Bearer ${token}` }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
      body: requestBody,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update profile");

    setUser(
      normalizeUser({
        ...data.user,
        profilePhoto: resolveProfilePhotoUrl(data.user?.profilePhoto || "")
      })
    );
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
