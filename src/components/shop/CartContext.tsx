"use client";

import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import type { ShopProduct } from "@/data/shop-products";

export interface CartItem {
  product: ShopProduct;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: ShopProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "moroccan-organica-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setItems(parsedCart);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever items change (but only after initial load)
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [items, isInitialized]);

  const addItem = useCallback((product: ShopProduct, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    // Open the cart drawer automatically when an item is added
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
    return { totalItems, totalPrice };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      isCartOpen,
      setIsCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, isCartOpen, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
