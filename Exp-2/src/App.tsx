import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppNavbar from './components/Navbar';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <Router>
      <CartProvider>
        <div className="min-vh-100 d-flex flex-column bg-light">
          <AppNavbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/cart" element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="py-4 mt-auto border-top bg-white">
            <div className="container d-flex justify-content-between align-items-center opacity-50 small fw-medium">
              <span className="text-secondary">© 2026 CORE.SHOP</span>
              <div className="d-flex gap-3">
                <span>Support</span>
                <span>Terms</span>
                <span>Privacy</span>
              </div>
            </div>
          </footer>
        </div>
      </CartProvider>
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
