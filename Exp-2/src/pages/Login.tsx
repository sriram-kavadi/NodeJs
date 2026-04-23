import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <Card className="border-0 shadow-lg p-3 bg-white">
          <Card.Body>
            <div className="text-center mb-4">
              <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
                <LogIn size={32} className="text-primary" />
              </div>
              <h2 className="fw-bold">Welcome Back</h2>
              <p className="text-muted">Login to manage your shopping cart</p>
            </div>

            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-4" controlId="email">
                <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="py-3 border-0 bg-slate-100 shadow-none focus:bg-slate-200 transition-all"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="py-3 border-0 bg-slate-100 shadow-none focus:bg-slate-200 transition-all"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-3 fw-bold mb-3 shadow-none border-0" disabled={loading}>
                {loading ? 'Logging in...' : 'Sign In'}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="text-primary fw-bold text-decoration-none small">Register here</Link>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Login;
