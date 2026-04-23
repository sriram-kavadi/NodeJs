import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { collection, onSnapshot, query, setDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus } from 'lucide-react';
import { motion } from 'motion/react';

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prodList: Product[] = [];
      snapshot.forEach(doc => {
        prodList.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prodList);
      setLoading(false);

      // Seed data if empty
      if (snapshot.empty && !loading) {
        seedInitialData();
      }
    });

    return () => unsubscribe();
  }, [loading]);

  const seedInitialData = async () => {
    const initialProducts = [
      { name: "Pro Headphones", description: "Noise-cancelling wireless headphones with superior sound quality.", price: 299, category: "Electronics", imageUrl: "https://picsum.photos/seed/headphones/400/300" },
      { name: "Smart Watch", description: "Health tracking and notifications on your wrist.", price: 199, category: "Electronics", imageUrl: "https://picsum.photos/seed/watch/400/300" },
      { name: "Canvas Backpack", description: "Durable and stylish backpack for everyday use.", price: 79, category: "Fashion", imageUrl: "https://picsum.photos/seed/bag/400/300" },
      { name: "Desk Lamp", description: "Modern LED desk lamp with adjustable brightness.", price: 45, category: "Home", imageUrl: "https://picsum.photos/seed/lamp/400/300" },
      { name: "Coffee Maker", description: "Brews perfect coffee in minutes.", price: 120, category: "Appliances", imageUrl: "https://picsum.photos/seed/coffee/400/300" },
      { name: "Running Shoes", description: "Lightweight and comfortable for long runs.", price: 110, category: "Fashion", imageUrl: "https://picsum.photos/seed/shoes/400/300" }
    ];

    for (const p of initialProducts) {
      const newRef = doc(collection(db, 'products'));
      await setDoc(newRef, p);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <header className="mb-5">
        <h1 className="fw-extrabold text-dark" style={{ fontSize: '28px' }}>Spring Collection</h1>
        <p className="text-secondary">Showing {products.length} premium tech accessories</p>
      </header>
      
      <Row xs={1} md={2} xl={3} className="g-4">
        {products.map((product, idx) => (
          <Col key={product.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="h-100 border-0 transition-all overflow-hidden bg-white">
                <div className="position-relative overflow-hidden" style={{ height: '200px', background: '#f1f5f9' }}>
                  <Card.Img 
                    variant="top" 
                    src={product.imageUrl} 
                    className="h-100 w-100 object-fit-cover transition-all duration-300 hover-scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <Badge bg="white" className="position-absolute top-0 end-0 m-3 text-dark border shadow-sm px-2 py-1">
                    {product.category}
                  </Badge>
                </div>
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="mb-3">
                    <Card.Title className="fw-bold fs-5 mb-1 text-dark">{product.name}</Card.Title>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Technical Accessory</div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="fs-4 fw-bold text-primary">${product.price}.00</span>
                    <Button 
                      variant="primary" 
                      className="d-flex align-items-center justify-content-center gap-2 px-4"
                      onClick={() => addToCart(product)}
                    >
                      <Plus size={16} />
                      <span className="small">Add to Cart</span>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Catalog;
