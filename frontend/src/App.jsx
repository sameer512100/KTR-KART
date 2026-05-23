import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Pages
import Marketplace from "./pages/Marketplace";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyOtp from "./pages/VerifyOtp";
import ProductDetails from "./pages/ProductDetails";
import ListProduct from "./pages/ListProduct";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import ManageProducts from "./pages/ManageProducts";

import "./App.css";

// Helper Component for Protected Paths
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        color: "var(--text-secondary)"
      }}>
        <p style={{ fontSize: "1.1rem" }}>Connecting with SRM database servers...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}>
        {/* Navigation Bar */}
        <Navbar />

        {/* Central main workspace container */}
        <main style={{
          flexGrow: 1,
          padding: "1rem"
        }}>
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Protected Routes */}
            <Route
              path="/list-product"
              element={
                <ProtectedRoute>
                  <ListProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-products"
              element={
                <ProtectedRoute>
                  <ManageProducts />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
