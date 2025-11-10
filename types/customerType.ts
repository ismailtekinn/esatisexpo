export interface Customer {
  ClientID?: number;
  ClientName: string;
  ClientSurname: string;
}

export interface SelectedCustomer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface SearchCustomerFields {
  WebErisimKullanici: string;
  WebErisimSifre: string;
  Aranan: string ;
  AramaTipi: number;
  Baslangic?: number;
  Adet?: number;
  MusteriKartBilgileriGetir?: boolean;
  DetayDataGetir?: true;
  CariBakiyeGetir?: true;
  AileBakiyesiGetir?: true;
}

export interface SelectedCustomer {
  id: string; // JSON'daki "ID"
  firstName: string; // JSON'daki "MUSTERI_ADI"
  lastName: string; // JSON'daki "MUSTERI_SOYADI"
  phone: string; // JSON'daki "TELEFON_1"
  // Opsiyonel alanlar
  CINSIYETI?: string;
  DOGUM_TARIHI?: string;
  FIYAT_NO?: string;
  GSM?: string;
  IL?: string;
  ILCE?: string;
  INDIRIM_ORANI?: string;
  KART_NO?: string;
  KREDI_LIMITI?: string;
  RISK_LIMITI?: string;
  ROWNUMBER?: string;
  TC_KIMLIK_NO?: string;
  VERGI_DAIRESI?: string;
  VERGI_NUMARASI?: string;
}

export type AddCustomerFormType = {
  mKod: string;
  musteriSoydı: string;
  musteriAdi: string;
  meslek: string;
  musteriGrubu1: string;
  aileHekimi: string;
  yupass: string;
  tcKimlikNo: string;
  telkod: string;
  kanGrubu: string;
  vergiDairesi: string;
  vergiNo: string;
  telefon1: string;
  telefon2: string;
  gsm1: string;
  gsm2: string;
  fax: string;
  musteriTipi: string;
  dogumYeriTarihi: Date;
  cinsiyet: string;
  adresSatiri: string;
  adresSatiri2: string;
  semtIlceSehir: string;
  webEmail: string;
  smsGrubu: string;
  interPosSatis: string;
  musteriIndirimi: string;
  ozelFiyat1: string;
  secimTuru: string;
};

export type AddCustomerFormTypeDeneme = {
  WebErisimKullanici: string;
  WebErisimSifre: string;
  CARI_ADI: string;
  CARI_UNVANI: string;
  TUR_KODU: string;
  TELEFON: string;
  INSERT_USER: string;
  UPDATE_USER: string;
  GSM: string;
  TC_KIMLIK_NO: string;
  Yas: string;

  // Opsiyonel alanlar
  ID?: number;
  VERGI_DAIRESI?: string;
  VERGI_NUMARASI?: string;
  ADRES1?: string;
  ADRES2?: string;
  SEMT?: string;
  ILCE?: string;
  IL?: string;
  EMAIL?: string;
  M_DOGUM_YERI?: string;
  M_DOGUM_TARIHI?: string;
  M_MEDENI_HALI?: number;
  M_CINSIYETI?: string;
  SMS_GRUP_NO?: string;
  GRUP_NO?: string;
  PASIF?: number;
  YUPAS_NO?: string;
  KAN_GRUBU?: string;
  MESLEK_NO?: string;
  MESLEK?: string;
  SMS_GONDERILMESIN?: number;
  KART_NO?: string;
  KartAdı?: string;
  KartDurumu?: string;
  KartTuru?: string;

  YetkiliAdi?: string;
  VeresiyeLimiti?: string;
  EmanetLimiti?: string;
  MusteriBorcu?: string;
  MusteriAlacagi?: string;
  MedeniHali?: string;
  MusteriUyarilari?: { id: number; label: string }[];
  UYARI_BILGI?: string;
  AileFertTotal: string;
  ToplamAileEmanetAdet: string;
  AileFertBorç: string;
  AileFertAlacak: string;
  ToplamAileEmanetTutar: string;
  E_FAT_DURUM: string;
  E_FAT_MUKELLEFI: string;
  E_FAT_ODEME_EKLE: string;
  E_FAT_POS_KUTUSU: string;
  E_FAT_SENARYO: string;
  FIRMA_SAHIS_DURUMU?: string;
  FIYAT_NO: string;
  MusteriGruoNo2: string;
  MusteriGruoNo3: string;
  MusteriGruoNo4: string;
  MusteriGruoNo5: string;
  MUSTERI_KODU?: string;
  RISK_LIMITI?: string;
  TAKIPLI: string;
  UTS_FIRMA_NO?: string;
};
