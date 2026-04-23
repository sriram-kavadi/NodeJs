import React from 'react';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { ShoppingCart, LogOut, User, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AppNavbar: React.FC = () => {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" sticky="top" className="py-0">
      <Container>
        <Navbar.Brand href="#" onClick={() => navigate('/')} className="d-flex align-items-center gap-2 py-0">
          <span className="fw-bolder fs-4 tracking-tighter text-primary" style={{ letterSpacing: '-0.5px' }}>CORE.SHOP</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-4">
            {user ? (
              <>
                <Nav.Link onClick={() => navigate('/')} className="px-0 fw-medium text-muted hover-text-primary transition-all">
                  Catalog
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/cart')} className="position-relative d-flex align-items-center gap-1 px-0 fw-medium text-muted hover-text-primary transition-all">
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <Badge pill className="ms-1 badge-danger">
                      {totalItems}
                    </Badge>
                  )}
                </Nav.Link>
                <div className="d-flex align-items-center gap-2 border-start ps-4 ms-2">
                  <User size={18} className="text-muted" />
                  <span className="text-muted small fw-medium">{user.email?.split('@')[0]}</span>
                </div>
                <Button variant="outline-danger" size="sm" onClick={handleLogout} className="ms-2 border-0 bg-transparent text-danger fw-bold py-1">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate('/login')} className="fw-semibold text-dark">Login</Nav.Link>
                <Nav.Link onClick={() => navigate('/register')} className="pe-0">
                  <Button variant="primary" size="sm" className="px-3">Register</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
