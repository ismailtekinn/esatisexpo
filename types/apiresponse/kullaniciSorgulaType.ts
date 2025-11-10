type FirmaInfo = {
  FIRMA_KODU: string;
  FIRMA_ADI: string;
  ADRES1: string;
  ADRES2: string;
  TELEFON: string;
  FAX: string;
  EMAIL: string;
  SEMT: string;
  ILCE: string;
  IL: string;
  YETKILI_ADI: string;
  VERGI_DAIRESI: string;
  VERGI_NUMARASI: string;
  GSM_TELEFON: string;
  TC_KIMLIK_NO: string;
  FIRMA_KISA_ADI: string;
  E_FAT_TRIA_SRV_ADRESS: string;
};

type PosAyar = {
  PC_POS_U_MAX_ISK: string;
  PC_POS_U_MAX_TUR: string;
  PC_POS_D_MAX_ISK: string;
  PC_POS_D_MAX_TUR: string;
  PC_POS_U_MAX_ART: string;
  PC_POS_U_MAX_ART_TUR: string;
  PC_POS_D_MAX_ART: string;
  PC_POS_D_MAX_ART_TUR: string;
  PC_POS_FIYAT_DEG_TIPI: string;
};

type Yetki = {
  GRUP_NO: string;
  YETKI_NO: string;
  YETKI: string;
  YETKI_ADI: string;
};

type UrunAyar = {
  MUSTERI_TURU: string;
  POS_TIPI: string;
  URUN_OZEL_ALAN_NO_1: string;
  URUN_OZEL_ALAN_NO_2: string;
  URUN_OZEL_ALAN_NO_3: string;
  URUN_OZEL_ALAN_NO_1_A: string;
  URUN_OZEL_ALAN_NO_2_A: string;
  URUN_OZEL_ALAN_NO_3_A: string;
};

type CihazInfo = {
  ID: string;
  CIHAZ_NO: string;
  TPS_AKTIF: string;
  TPS_YKASA_CIHAZ_ID: string;
  SERIAL_NO: string;
  CIHAZ_ADI: string;
  LISANS_DURUM: string;
  LISANS_EXP_DATE: string;
  LISANS_GUN: string;
  KAPIDA_ODEME: string;
};