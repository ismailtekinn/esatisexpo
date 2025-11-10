import React, { createContext, useState, ReactNode, useContext } from "react";
import {
  AddCustomerFormType,
  AddCustomerFormTypeDeneme,
} from "../../types/customerType";

// type AddCustomerFormContextType = {
//   addCustomForm: AddCustomerFormType;
//   setAddCustomForm: React.Dispatch<React.SetStateAction<AddCustomerFormType>>;
// };
type AddCustomerFormContextType = {
  addCustomForm: AddCustomerFormTypeDeneme;
  setAddCustomForm: React.Dispatch<
    React.SetStateAction<AddCustomerFormTypeDeneme>
  >;
};

const AddCustomerFormContext = createContext<
  AddCustomerFormContextType | undefined
>(undefined);

export const AddCustomerFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [addCustomForm, setAddCustomForm] = useState<AddCustomerFormTypeDeneme>(
    {
      WebErisimKullanici: "TRIA_TEST",
      WebErisimSifre: "SFR57220",
      CARI_ADI: "Ahmet Hamdi",
      CARI_UNVANI: "",
      TUR_KODU: "MÜSTERI",
      TELEFON: "",
      Yas: "",
      INSERT_USER: "ADMIN",
      UPDATE_USER: "ADMIN",
      GSM: "",
      TC_KIMLIK_NO: "",
      ID: 0,
      VERGI_DAIRESI: "",
      VERGI_NUMARASI: "",
      ADRES1: "",
      ADRES2: "",
      SEMT: "",
      ILCE: "",
      IL: "",
      EMAIL: "",
      M_DOGUM_YERI: "",
      M_DOGUM_TARIHI: "",
      M_MEDENI_HALI: 0,
      M_CINSIYETI: "",
      SMS_GRUP_NO: "",
      GRUP_NO: "",
      PASIF: 0,
      YUPAS_NO: "",
      KAN_GRUBU: "",
      MESLEK_NO: "",
      MESLEK: "",
      SMS_GONDERILMESIN: 0,
      KART_NO: "",
      KartAdı: "",
      KartTuru: "",
      KartDurumu: "",
      YetkiliAdi: "",
      VeresiyeLimiti: "",
      EmanetLimiti: "",
      MusteriBorcu: "",
      MusteriAlacagi: "",
      MusteriUyarilari: [
      ],
      AileFertTotal: "0",
      ToplamAileEmanetAdet: "0",
      AileFertBorç: "0",
      AileFertAlacak: "0",
      ToplamAileEmanetTutar: "0",
      E_FAT_DURUM: "",
      E_FAT_MUKELLEFI: "",
      E_FAT_ODEME_EKLE: "",
      E_FAT_POS_KUTUSU: "",
      E_FAT_SENARYO: "",
      FIRMA_SAHIS_DURUMU: "",
      FIYAT_NO: "",
      MusteriGruoNo2: "",
      MusteriGruoNo3: "",
      MusteriGruoNo4: "",
      MusteriGruoNo5: "",
      MUSTERI_KODU: "",
      RISK_LIMITI: "",
      TAKIPLI: "",
      UTS_FIRMA_NO: "",
    }
  );

  return (
    <AddCustomerFormContext.Provider
      value={{ addCustomForm, setAddCustomForm }}
    >
      {children}
    </AddCustomerFormContext.Provider>
  );
};

export const useAddCustomerForm = () => {
  const context = useContext(AddCustomerFormContext);
  if (!context) {
    throw new Error(
      "useAddCustomerForm must be used within AddCustomerFormProvider"
    );
  }
  return context;
};
