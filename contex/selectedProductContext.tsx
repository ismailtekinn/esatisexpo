import React, { createContext, useContext, useState } from 'react';
import { MinimalProduct } from '../types/productType';
import { SaleAllList } from '../types/saleType';

interface SelectedProductContextType {
  selectedProduct: MinimalProduct | null;
  setSelectedProduct: (product: MinimalProduct|null) => void;
}

const SelectedProductContext = createContext<SelectedProductContextType | undefined>(undefined);

export const SelectedProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<MinimalProduct  |null>(null);

  return (
    <SelectedProductContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </SelectedProductContext.Provider>
  );
};

export const useSelectedProduct = () => {
  const context = useContext(SelectedProductContext);
  if (!context) {
    throw new Error("useSelectedProduct must be used within a SelectedProductProvider");
  }
  return context;
};
