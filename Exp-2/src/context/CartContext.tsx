import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where,
  getDocs
} from 'firebase/firestore';
import { db, auth, handleFirestoreError } from '../firebase';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});

  // Sync products for lookups
  useEffect(() => {
    const q = query(collection(db, 'products'));
    return onSnapshot(q, (snapshot) => {
      const prodMap: Record<string, Product> = {};
      snapshot.forEach(doc => {
        prodMap[doc.id] = { id: doc.id, ...doc.data() } as Product;
      });
      setProducts(prodMap);
    }, (err) => console.error("Error fetching products:", err));
  }, []);

  // Sync cart items
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const cartRef = collection(db, `users/${user.uid}/cart`);
    return onSnapshot(cartRef, (snapshot) => {
      const cartItems: CartItem[] = [];
      snapshot.forEach(doc => {
        cartItems.push({ id: doc.id, ...doc.data() } as CartItem);
      });
      setItems(cartItems);
    }, (err) => console.error("Error fetching cart:", err));
  }, [user]);

  const addToCart = useCallback(async (product: Product) => {
    if (!user) return;
    
    const existing = items.find(item => item.productId === product.id);
    const cartRef = collection(db, `users/${user.uid}/cart`);

    try {
      if (existing) {
        await updateDoc(doc(cartRef, existing.id), {
          quantity: existing.quantity + 1
        });
      } else {
        const newDoc = doc(cartRef);
        await setDoc(newDoc, {
          productId: product.id,
          quantity: 1,
          addedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      handleFirestoreError(err, 'write', `users/${user.uid}/cart`);
    }
  }, [user, items]);

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/cart/${itemId}`));
    } catch (err) {
      handleFirestoreError(err, 'delete', `users/${user.uid}/cart/${itemId}`);
    }
  }, [user]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user || quantity < 1) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/cart/${itemId}`), { quantity });
    } catch (err) {
      handleFirestoreError(err, 'update', `users/${user.uid}/cart/${itemId}`);
    }
  }, [user]);

  const enrichedItems = items.map(item => ({
    ...item,
    product: products[item.productId]
  })).filter(item => !!item.product);

  const totalItems = enrichedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = enrichedItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items: enrichedItems, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
