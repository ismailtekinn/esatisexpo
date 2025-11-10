export type CustomerItem = {
  ROWNUMBER: string;
  ID: string;
  MUSTERI_KODU: string;
  MUSTERI_ADI: string;
  MUSTERI_SOYADI: string;
  MUSTERI_ADI_SOYADI: string;
  TC_KIMLIK_NO: string;
  VERGI_DAIRESI: string;
  VERGI_NUMARASI: string;
  IL: string;
  ILCE: string;
  TELEFON_1: string;
  GSM: string;
  DOGUM_TARIHI: string;
  CINSIYETI: string;
  INDIRIM_ORANI: string;
  FIYAT_NO: string;
  KREDI_LIMITI: string;
  RISK_LIMITI: string;
  KART_NO: string;
};

export type SQLDataResponse = {
  RECORD_COUNT: string;
  DATA: CustomerItem[];
};

export type ApiResponse = {
  ResultCode: string;
  ErrorMessage: string | null;
  ServisVersiyon: string;
  FisBarkod: string | null;
  BelgeNo: string | null;
  BarkodData: string | null;
  Id: number;
  CariId: number;
  SQL_Data: string;       // Backend JSON string gönderiyor
  SQL_Data_2: string | null;
  SQL_Data_3: string | null;
  SQL_Data_4: string | null;
  SQL_Data_5: string | null;
  SQL_Data_6: string | null;
  SQL_Data_7: string | null;
  SQL_Data_8: string | null;
  SQL_Data_9: string | null;
  SQL_Data_10: string | null;
  BelgeTarihi: string;
  dtBelgeTarihi: string;  // ISO date string
  SQL_Data_List: string | null;
};

// Kullanımı:
const parseSQLData = (response: ApiResponse): SQLDataResponse => {
  return JSON.parse(response.SQL_Data) as SQLDataResponse;
};




export interface DATum {
  ROWNUMBER: string;
  ID: string;
  CARI_KODU: string;
  MUSTERI_KODU: string;
  MUSTERI_ADI: string;
  MUSTERI_SOYADI: string;
  MUSTERI_ADI_SOYADI: string;
  TC_KIMLIK_NO: string;
  VERGI_DAIRESI: string;
  VERGI_NUMARASI: string;
  IL: string;
  ILCE: string;
  TELEFON_1: string;
  TELEFON: string;
  GSM: string;
  DOGUM_TARIHI: string;
  CINSIYETI: string;
  INDIRIM_ORANI: string;
  FIYAT_NO: string;
  KREDI_LIMITI: string;
  RISK_LIMITI: string;
  KART_NO: string;
  FIRMA_SAHIS_DURUMU: string;
  GRUP_NO: string;
  GRUP_ADI: string;
  E_FAT_MUKELLEFI: string;
  CARI_ADI: string;
  CARI_UNVANI: string;
  TUR_KODU: string;
  TUR_ADI: string;
  M_DOGUM_TARIHI: string;
  M_CINSIYETI: string;
  KREDI_LIMIT: string;
  M_MEDENI_HALI: string;
  UYARI_BILGI: string;
  HESAP_DURUMU: string;
  KVKK_PROCESS: string;
  ETK_GSM: string;
  ETK_EMAIL: string;
  TAKIPLI: string;
  YAS: string;
  YUPAS_NO: string;
  PUAN_BAKIYE: string;
  SMS_GONDERILMESIN: string;
  GRUP_NO_2: string;
  GRUP_NO_3: string;
  GRUP_NO_4: string;
  GRUP_NO_5: string;
  GRUP_ADI_2: string;
  GRUP_ADI_3: string;
  GRUP_ADI_4: string;
  GRUP_ADI_5: string;
  UTS_FIRMA_NO: string;
  KREDI_LIMIT_GUN: string;
  EMANET_LIMIT: string;
  EMANET_LIMIT_GUN: string;
  E_FAT_SENARYO: string;
  E_FAT_POS_KUTUSU: string;
  E_FAT_DURUM: string;
  E_FAT_ODEME_EKLE: string;
  AILE_REISI: string;
  AILE_REISI_ID: string;
  AILE_REISI_BORC_DURUM: string;
  KAN_GRUBU: string;
  AILE_HEKIMI: string;
  ACIL_ILETISIM_KISI: string;
  ACIL_ILETISIM_TELEFON: string;
  MESLEK_NO: string;
  MESLEK_ADI: string;
  SMS_GRUP_NO: string;
  SMS_GRUP_ADI: string;
  INSERT_USER: string;
  INSERT_DATE: string;
  UPDATE_USER: string;
  UPDATE_DATE: string;
}

export interface Root {
  RECORD_COUNT: string;
  DATA: DATum[];
}







