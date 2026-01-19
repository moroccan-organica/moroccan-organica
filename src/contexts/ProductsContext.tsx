'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ShopProduct, shopProducts as initialProducts } from '@/data/shop-products';

interface ProductsContextType {
  products: ShopProduct[];
  addProduct: (product: Omit<ShopProduct, 'id'>) => void;
  updateProduct: (id: string, product: Partial<ShopProduct>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => ShopProduct | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ShopProduct[]>(initialProducts);

  const addProduct = useCallback((productData: Omit<ShopProduct, 'id'>) => {
    const newProduct: ShopProduct = {
      ...productData,
      id: `product-${Date.now()}`,
    };
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id: string, productData: Partial<ShopProduct>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...productData } : product
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  }, []);

  const getProductById = useCallback((id: string) => {
    return products.find(product => product.id === id);
  }, [products]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
