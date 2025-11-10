import React, { createContext, useContext, useState } from "react";

export type RaporType = "standard" | "purchase" | "customer" | "supplier" | "debt";

interface RaporTypeContextProps {
  raporType: RaporType;
  setRaporType: (type: RaporType) => void;
}

const RaporTypeContext = createContext<RaporTypeContextProps | undefined>(undefined);

export const RaporTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [raporType, setRaporType] = useState<RaporType>("standard");

  return (
    <RaporTypeContext.Provider value={{ raporType, setRaporType }}>
      {children}
    </RaporTypeContext.Provider>
  );
};

export const useRaporType = () => {
  const context = useContext(RaporTypeContext);
  if (!context) {
    throw new Error("useRaporType must be used within a RaporTypeProvider");
  }
  return context;
};
