import React, { createContext, useContext, useState, ReactNode } from "react";
import { SelectedCustomer } from "../types/customerType";

interface SelectedCustomerContextType {
  selectedCustomer?: SelectedCustomer;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<SelectedCustomer | undefined>>;
}

const SelectedCustomerContext = createContext<SelectedCustomerContextType | undefined>(undefined);

export const SelectedCustomerProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer | undefined>(undefined);

  return (
    <SelectedCustomerContext.Provider value={{ selectedCustomer, setSelectedCustomer }}>
      {children}
    </SelectedCustomerContext.Provider>
  );
};

export const useSelectedCustomer = () => {
  const context = useContext(SelectedCustomerContext);
  if (!context) {
    throw new Error("useSelectedCustomer must be used within a SelectedCustomerProvider");
  }
  return context;
};
