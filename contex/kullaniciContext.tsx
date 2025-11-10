import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackendResponse } from "../types/apiresponse/newGenericResponseType";

interface KullaniciContextProps {
  userData?: BackendResponse | null;
  setUserData: React.Dispatch<
    React.SetStateAction<BackendResponse | undefined>
  >;
  handleLogin: (data: BackendResponse) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const KullaniciContext = createContext<KullaniciContextProps | undefined>(
  undefined
);

export const KullaniciProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<BackendResponse | undefined>();

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedUser && storedUser !== "") {
          setUserData(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
      } 
    };
    loadStoredData();
  }, []);

  const handleLogin = async (data: BackendResponse) => {
    try {
      // SQL_Data ve benzeri JSON stringleri parse et
      const parsedData: BackendResponse = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [
          k,
          k.startsWith("SQL_Data") && typeof v === "string" ? JSON.parse(v) : v,
        ])
      ) as BackendResponse;

      setUserData(parsedData);
      // await AsyncStorage.setItem("autoLogin", "Evet");
      await AsyncStorage.setItem("userData", JSON.stringify(parsedData));
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      setUserData(undefined);
      await AsyncStorage.removeItem("userData");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <KullaniciContext.Provider
      value={{ userData, setUserData, handleLogin, handleLogout }}
    >
      {children}
    </KullaniciContext.Provider>
  );
};

// Hook
export const useKullanici = () => {
  const context = useContext(KullaniciContext);
  if (!context) {
    throw new Error("useKullanici must be used within a KullaniciProvider");
  }
  return context;
};
