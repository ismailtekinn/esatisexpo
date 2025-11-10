// SalesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Type’ı senin dosyadan import edebilirsin
import { SaleItem } from "../types/saleType";

export type ActionType = "edit" | "delete" | "etiket" | "isconto" | null;

export type SummaryState = {
  totalItems: number;
  totalStock: number;
  totalPrice: number;
  total?: number;

  IndFlag?: number;
  IndOran?: number;
  IndTutar: number;
  UrunTutar: number;
  Isconto?: string;
  cancelled?: boolean;
};

type SalesContextType = {
  selectedSale: SaleItem[];
  setSelectedSales: React.Dispatch<React.SetStateAction<SaleItem[]>>;
  summary: SummaryState;
  setSummary: React.Dispatch<React.SetStateAction<SummaryState>>;
};

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSale, setSelectedSales] = useState<SaleItem[]>([]); // başlangıç boş array
  const [summary, setSummary] = useState<SummaryState>({
    totalItems: 0,
    totalStock: 0,
    totalPrice: 0,
    IndFlag: 0,
    IndOran: 0,
    IndTutar: 0,
    Isconto: "",
    UrunTutar: 0,
  });


  useEffect(() => {
    const newTotalPrice = selectedSale.reduce((sum, item) => {
      const itemPrice = (item.Price || 0) * (item.Stock || 1);
      const discounted = item.IndTutar ? itemPrice - item.IndTutar : itemPrice;
      return sum + discounted;
    }, 0);

    setSummary((prev) => ({
      ...prev,
      totalPrice: newTotalPrice,
      totalItems: selectedSale.length,
      totalStock: selectedSale.reduce(
        (sum, item) => sum + (item.Stock || 0),
        0
      ),
    }));
  }, [selectedSale]);

  
  return (
    <SalesContext.Provider
      value={{ selectedSale, setSelectedSales, summary, setSummary }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) throw new Error("useSales must be used within SalesProvider");
  return context;
};
