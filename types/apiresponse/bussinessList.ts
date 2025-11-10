type BussinessApiResponse = {
  ResultCode: string;
  ErrorMessage: string | null;
  ServisVersiyon: string;
  FisBarkod: string | null;
  BelgeNo: string | null;
  BarkodData: string | null;
  Id: number;
  CariId: number;
  SQL_Data: string; // JSON string, parse edildikten sonra alt veriler kullanılabilir
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
  dtBelgeTarihi: string;
  SQL_Data_List: string | null;
};

// SQL_Data içindeki detaylı veri için ayrı bir type
type BussinessSqlDataItem = {
  KOD: string;
  ACIKLAMA: string;
};

type BussinessSqlData = {
  RECORD_COUNT: string;
  DATA: BussinessSqlDataItem[];
};
