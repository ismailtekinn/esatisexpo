import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AutoLoginOption } from "../../types/enums/settings";

type AutoLoginContextType = {
  autoLogin: AutoLoginOption;
  setAutoLogin: (value: AutoLoginOption) => void;
};

export const AutoLoginContext = createContext<AutoLoginContextType>({
  autoLogin: AutoLoginOption.Hayir,
  setAutoLogin: () => {},
});

export const AutoLoginProvider = ({ children }: { children: ReactNode }) => {
  const [autoLogin, setAutoLoginState] = useState<AutoLoginOption>(AutoLoginOption.Hayir);

  useEffect(() => {
    const loadAutoLogin = async () => {
      const saved = await AsyncStorage.getItem("autoLogin");
      if (saved === AutoLoginOption.Evet || saved === AutoLoginOption.Hayir) setAutoLoginState(saved);
    };
    loadAutoLogin();
  }, []);

  const setAutoLogin = async (value: AutoLoginOption) => {
    setAutoLoginState(value);
    await AsyncStorage.setItem("autoLogin", value);
  };

  return (
    <AutoLoginContext.Provider value={{ autoLogin, setAutoLogin }}>
      {children}
    </AutoLoginContext.Provider>
  );
};

export const useAutoLogin = () => {
 const context = React.useContext(AutoLoginContext);
 if (!context) throw new Error("useAutoLogin must be used within AutoLoginProvider");
 return context
}
    
