import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
              <div className="bg-success bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
                <UserPlus size={32} className="text-success" />
              </div>
              <h2 className="fw-bold">Create Account</h2>
              <p className="text-muted">Join us today for the best shopping deals</p>
            </div>

            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3" controlId="email">
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

              <Form.Group className="mb-3" controlId="password">
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

              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label className="small fw-bold text-secondary text-uppercase tracking-wider">Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Confirm password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  className="py-3 border-0 bg-slate-100 shadow-none focus:bg-slate-200 transition-all"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-3 fw-bold mb-3 shadow-none border-0" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="text-success fw-bold text-decoration-none small">Login here</Link>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Register;
