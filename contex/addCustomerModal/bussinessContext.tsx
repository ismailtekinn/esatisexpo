import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import { fetchSearchMethot } from "../../api/generic";
import {
  CARI_GROUP_SORGULA_URL,
  MESLEK_SORGULA_URL,
  MUSTERI_SORGULA_URL,
} from "../../constants/constant";
import { SqlData } from "../../types/apiresponse/newGenericResponseType";

export interface Bussiness {
  KOD: string;
  ACIKLAMA: string;
}
export interface CustomerGroup {
  GRUP_NO: string;
  GRUP_ADI: string;
}
type BussinessContextType = {
  bussinessData: Bussiness[] | null;
  reloadBussiness: () => Promise<void>;
  customerData: CustomerGroup[] | null;
};
const BussinessContext = createContext<BussinessContextType | undefined>(
  undefined
);

export const BussinessProvider = ({ children }: { children: ReactNode }) => {
  const [bussinessData, setBussinessData] = useState<Bussiness[] | null>(null);
  const [customerData, setCustomerData] = useState<CustomerGroup[] | null>(
    null
  );

  const loadBussiness = async () => {
    try {
      // const url = `${API_URL8082}TriaRestEczane/MeslekSorgula`;
      const response = await fetchSearchMethot<Bussiness, {}>(
        MESLEK_SORGULA_URL,
        {}
      );

      const mainData: SqlData<Bussiness> = response.main;
      setBussinessData(mainData.DATA);
    } catch (err) {
      console.error("Meslek verisi alınamadı:", err);
      setBussinessData(null);
    }
  };



  const loadCustomerGroup = async () => {
    try {
      // const url = `${API_URL8082}TriaRestEczane/CariGrupSorgula`;
      const response = await fetchSearchMethot<CustomerGroup, {}>(
        CARI_GROUP_SORGULA_URL,
        {}
      );
      const mainData: SqlData<CustomerGroup> = response.main;

      setCustomerData(mainData.DATA);
    } catch (err) {
      console.error("cari grup  verisi alınamadı:", err);
      setCustomerData(null);
    }
  };

  useEffect(() => {
    loadBussiness();
    loadCustomerGroup();
  }, []);

  return (
    <BussinessContext.Provider
      value={{ bussinessData, reloadBussiness: loadBussiness, customerData }}
    >
      {children}
    </BussinessContext.Provider>
  );
};

// Kullanımı kolay hook
export const useBussinessContext = () => {
  const context = useContext(BussinessContext);
  if (!context) {
    throw new Error(
      "useBussinessContext must be used within a BussinessProvider"
    );
  }
  return context;
};
