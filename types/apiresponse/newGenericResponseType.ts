export type BackendResponse = {
  ResultCode: string;
  ErrorMessage: string | null;
  ServisVersiyon: string;
  FisBarkod?: string | null;
  BelgeNo?: string | null;
  BarkodData?: any;
  TPSOrderNo?: string;
  Id?: number;
  CariId?: number;
  BelgeTarihi?: string;
  dtBelgeTarihi?: string;
  SQL_Data_List?: any;
  ToplamSorguAdet?: number;
  // SQL_Data_1..10 ve SQL_Data dahil
  SQL_Data?: string | null;
  SQL_Data_2?: string | null;
  SQL_Data_3?: string | null;
  SQL_Data_4?: string | null;
  SQL_Data_5?: string | null;
  SQL_Data_6?: string | null;
  SQL_Data_7?: string | null;
  SQL_Data_8?: string | null;
  SQL_Data_9?: string | null;
  SQL_Data_10?: string | null;
  [key: string]: any; // ileride eklenebilecek alanlar için
};

export type SqlData<T> = {
  RECORD_COUNT: string;
  DATA: T[];
};