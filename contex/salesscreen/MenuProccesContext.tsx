// import { createContext, useContext } from "react";
// import { MenuActionType } from "../../types/salesscreen/menuActionType";

// interface MenuProcessContextType {
//   selectedAction?: MenuActionType;                      // seçilen action / buton
//   setSelectedAction: (action?: MenuActionType) => void; // action güncelleme fonksiyonu
// }

// // Context oluşturuldu
// export const MenuProcessContext = createContext<MenuProcessContextType | null>(null);

// // Custom hook
// export const useMenuProcess = () => {
//   const context = useContext(MenuProcessContext);
//   if (!context) {
//     throw new Error("useMenuProcess must be used within a MenuProcessContext.Provider");
//   }
//   return context;
// };

import { Children, createContext, useContext, useState } from "react";
import { MenuActionType } from "../../types/salesscreen/menuActionType";

interface MenuProcessContextType {
  selectedAction?: MenuActionType; // seçilen action / buton
  setSelectedAction: (action?: MenuActionType) => void; // action güncelleme fonksiyonu
}

// Context oluşturuldu
 const MenuProcessContext = createContext<MenuProcessContextType | null>(
  null
);
export const MenuProccesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
const [selectedAction, setSelectedAction] = useState<MenuActionType | undefined>(undefined);


  return (
    <MenuProcessContext.Provider
      value={{
        selectedAction,
        setSelectedAction,
      }}
    >
      {children}
    </MenuProcessContext.Provider>
  );
};
// Custom hook
export const useMenuProcess = () => {
  const context = useContext(MenuProcessContext);
  if (!context) {
    throw new Error(
      "useMenuProcess must be used within a MenuProcessContext.Provider"
    );
  }
  return context;
};
