import React from 'react';
import { Container, Row, Col, Card, Button, Table, Image, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-5"
        >
          <div className="bg-light d-inline-flex p-4 rounded-circle mb-4 text-secondary">
            <ShoppingBag size={64} />
          </div>
          <h2 className="fw-bold">Your cart is empty</h2>
          <p className="text-muted mb-4">You haven't added any products to your cart yet.</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/')}>
            Go Shopping
          </Button>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <Button variant="link" className="p-0 text-dark" onClick={() => navigate('/')}>
            <ArrowLeft size={24} />
          </Button>
          <h1 className="fw-bolder mb-0" style={{ fontSize: '28px' }}>Shopping Cart</h1>
        </div>
        <Badge pill className="badge-danger fs-6 px-3 py-2">{totalItems} Items</Badge>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 bg-white">
            <Card.Body className="p-0 text-slate-900">
              <Table responsive className="mb-0 align-middle border-0">
                <thead className="bg-light text-secondary small text-uppercase">
                  <tr className="border-0">
                    <th className="px-4 py-3 border-0">Product</th>
                    <th className="py-3 text-center border-0">Quantity</th>
                    <th className="px-4 py-3 text-end border-0">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                        className="border-bottom"
                      >
                        <td className="px-4 py-4 border-0">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-light p-1 rounded" style={{ width: '64px', height: '64px' }}>
                              <Image 
                                src={item.product?.imageUrl} 
                                rounded 
                                className="w-100 h-100 object-fit-cover shadow-sm"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <h6 className="fw-bold mb-0" style={{ fontSize: '15px' }}>{item.product?.name}</h6>
                              <p className="text-secondary small mb-0">1 x ${item.product?.price}.00</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 border-0">
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <Button 
                              variant="light" 
                              size="sm" 
                              className="rounded-circle border-0 small"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="fw-bold mx-1">{item.quantity}</span>
                            <Button 
                              variant="light" 
                              size="sm" 
                              className="rounded-circle border-0 small"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus size={12} />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-end fw-bold border-0" style={{ fontSize: '16px' }}>
                          ${(item.product?.price || 0) * item.quantity}.00
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </Table>
              <div className="p-4 bg-light bg-opacity-50 border-top text-center">
                <div className="d-inline-block text-secondary small p-2 border border-dashed rounded cursor-pointer transition-all hover-bg-white px-4">
                  Apply Promo Code
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 bg-white sticky-top shadow-sm" style={{ top: '100px', borderRadius: '16px !important' }}>
            <Card.Body className="p-4 d-flex flex-column h-100">
              <h5 className="fw-bold mb-4">Shopping Cart</h5>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Subtotal</span>
                  <span>${totalPrice}.00</span>
                </div>
                <div className="d-flex justify-content-between mb-4 small text-secondary">
                  <span>Shipping</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <h4 className="fw-bold mb-0">Total</h4>
                  <h4 className="fw-bold mb-0 text-dark">${totalPrice}.00</h4>
                </div>
              </div>
              <Button variant="dark" size="lg" className="w-100 py-3 fw-bold mb-3 checkout-btn shadow-sm">
                Proceed to Checkout
              </Button>
              <div className="text-center" style={{ fontSize: '11px', color: '#94a3b8' }}>
                Secure SSL Checkout — Free 30-day Returns
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
