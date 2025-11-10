import React, { createContext, useContext, useState } from "react";

interface AlertContextType {
  alertModalVisible: boolean;
  setAlertModalVisible: (val: boolean) => void;
  alertMessage: string;
  setAlertMessage: (val: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <AlertContext.Provider
      value={{
        alertModalVisible,
        setAlertModalVisible,
        alertMessage,
        setAlertMessage,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
