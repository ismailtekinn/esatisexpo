export interface SearchProductResponse {
  ResultCode: string;
  ErrorMessage: string | null;
  ServisVersiyon: string;
  FisBarkod: string | null;
  BelgeNo: string | null;
  BarkodData: string | null;
  Id: number;
  CariId: number;
  SQL_Data: string | null; // burası string, parse edilip DATA array alınacak
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
  dtBelgeTarihi: string; // ISO tarih string
  SQL_Data_List: string | null;
}

// SQL_Data içindeki DATA dizisi için ayrı tip
export interface ProductDataItem {
  ROWNUMBER: string;
  ID: string;
  MAL_KODU: string;
  MAL_ADI: string;
  SON_ALIS_FIYATI: string;
  SATIS_KDV: string;
  BARKOD: string;
  GRUP_KODU: string;
  GRUP_ADI: string;
  SATIS_FIYATI_1: string;
  SATIS_FIYATI_2: string;
  SATIS_FIYATI_3: string;
  KAMU_ISKONTO_ORANI: string;
  PUAN: string;
  MARKA_NO: string;
  MARKA_ADI: string;
  KATAGORI_NO: string;
  KATAGORI_ADI: string;
  REYON_KODU: string;
  REYON_ADI: string;
  BAKIYE: string;
  UTS_STATUS: string;
}

// SQL_Data parse edildikten sonra
export interface SQLDataParsed {
  RECORD_COUNT: string;
  DATA: ProductDataItem[];
}