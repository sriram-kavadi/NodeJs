export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface CartItem {
  id: string; // Document ID in users/{userId}/cart
  productId: string;
  quantity: number;
  addedAt: string;
  product?: Product; // Populated for UI convenience
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
}
