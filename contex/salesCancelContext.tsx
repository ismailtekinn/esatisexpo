import React, { createContext, useContext, useState, ReactNode } from "react";

// Context içinde tutulacak tipler
type SalesCancelContextType = {
  cancelledIds: Set<number>;              // iptal edilen ürün ID’leri
  toggleCancelled: (id: number) => void;  // ürün iptal / geri al
  isItemCancelled: (id: number) => boolean; // ürün iptal mi kontrol et
  isDiscountApplied: boolean;             // dip iskonto yapıldı mı
  setIsDiscountApplied: React.Dispatch<React.SetStateAction<boolean>>; // iskonto state güncelle
  isIscontoApplied: boolean;             // dip iskonto yapıldı mı
  setIscontoApplied: React.Dispatch<React.SetStateAction<boolean>>; // iskonto state güncelle
};

// Context oluşturuluyor
const SalesCancelContext = createContext<SalesCancelContextType | undefined>(
  undefined
);

// Sağlayıcı component
export const SalesCancelProvider = ({ children }: { children: ReactNode }) => {
  // iptal edilen ürünlerin tutulduğu set
  const [cancelledIds, setCancelledIds] = useState<Set<number>>(new Set());

  // dip iskonto için ayrı flag
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [isIscontoApplied, setIscontoApplied] = useState(false);

  // ürünü iptal et veya geri al
  const toggleCancelled = (id: number) => {
    setCancelledIds((prev) => {
      const next = new Set(prev); // önceki setin kopyası
      if (next.has(id)) {
        next.delete(id); // eğer vardıysa geri al
      } else {
        next.add(id);    // yoksa iptal et
      }
      return next;       // yeni set’i döndür
    });
  };

  // belirli bir ürün iptal edilmiş mi kontrol et
  const isItemCancelled = (id: number) => cancelledIds.has(id);

  return (
    <SalesCancelContext.Provider
      value={{
        cancelledIds,        // iptal edilen ürünlerin ID seti
        toggleCancelled,     // iptal / geri al fonksiyonu
        isItemCancelled,     // ürün iptal mi fonksiyonu
        isDiscountApplied,   // dip iskonto var mı bilgisi
        setIsDiscountApplied, // iskonto flag güncelleme fonksiyonu
        isIscontoApplied,
        setIscontoApplied,

      }}
    >
      {children}
    </SalesCancelContext.Provider>
  );
};

// Context’i kullanmak için custom hook
export const useSalesCancel = () => {
  const context = useContext(SalesCancelContext);
  if (!context)
    throw new Error("useSalesCancel must be used within SalesCancelProvider");
  return context;
};
