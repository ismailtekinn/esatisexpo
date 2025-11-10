export interface CreateSale {
  UserID: number;
  SaleDate: Date;
  ProductID: number;
  SaleType: string;
  TotalAmount: number;
  // ClientID?: number |undefined;
  Quantity: number;
}

export interface SaleAllList {
  ProductID: number;
  ProductName: string;
  SalePrice: number;
  SaleID: number;
  Stok_Quantity: number;
  PurchasePrice: number;
}

export interface SaleEditProdcut {
  ProductID: number;
  ProductName: string;
  PurchasePrice: number;
  SaleDate: Date;
  SaleID: number;
  StockType?: string;
  SalePrice: number;
  Quantity: number;
  Stok_Quantity: number;
  TotalAmount: number;
  SaleType: string;
  UserID: number;
  ClientName?: string;
  ClientSurname?: string;
}
export interface SaleEdit {
  ProductID: number;
  SaleDate: Date;
  SaleID: number;
  Quantity: number;
  TotalAmount: number;
  SaleType: string;
  UserID: number;
}
export class SaleItem {
  Index!: number;
  ProductName!: string;
  Barcode!: number;
  Stock!: number;
  Price!: number;
  VatRate!: number;
  Rayon!: string;
  Currency!: string;
  Isconto?: string;
  isCanceled?: boolean;
  UrunId?: number;
  UrunTipi?: number;
  DepartmanNo?: number;
  Birim?: string;
  Adet?: number;
  BirimFiyat?: number;
  IndFlag?: number;
  IndOran?: number;
  IndTutar?: number;
  SaticiNo?: number;
  Puan?: number;
  KasiyerNo?: number;
  UrunKartiFiyati?: number;
  UpdateDate?: string;
  QrCode?: string;
  SeriNo?: string;
  Miad?: string;
  PartiNo?: string;
  DipIskonto?: number;
  DipArttirim?: number;
  FiyatNo?: number;
  Tutar: number;
  UtsLi?: number;
  UtsLotNo?: string;
  UtsSeriNo?: string;
  UtsUrunNo?: string;
  UtsEssizKimlikNo?: string;
  discount?: number;
  arttirim?: number;

  constructor(data: Omit<SaleItem, "Tutar">) {
    Object.assign(this, data);
    this.Tutar = (data.Price ?? 0) * (data.Stock ?? 0); // direkt hesapla ve ata
  }
}

export class SaleItemDeneme {
  ID?: string;
  MAL_KODU?: string;
  MAL_ADI?: string;
  SON_ALIS_FIYATI?: string;
  SATIS_KDV?: string;
  BARKOD?: string;
  GRUP_KODU?: string;
  GRUP_ADI?: string;
  SATIS_FIYATI_1?: string;
  SATIS_FIYATI_2?: string;
  SATIS_FIYATI_3?: string;
  KAMU_ISKONTO_ORANI?: string;
  PUAN?: string;
  MARKA_NO?: string;
  MARKA_ADI?: string;
  KATAGORI_NO?: string;
  KATAGORI_ADI?: string;
  Toplam: number;
  REYON_KODU?: string;
  REYON_ADI?: string;
  BAKIYE?: string;
  UTS_STATUS?: string;

  constructor(data: Omit<SaleItemDeneme, "Toplam">) {
    Object.assign(this, data);
    this.Toplam =
      (Number(data.SATIS_FIYATI_1) || 0) * (Number(data.BAKIYE) || 0);
  }
}
export type SaleProduct = {
  Barcode: string;
  ProductName: string;
  Stock: number;
  VatRate: number;
  Shelf: string;
  Price: number;
};


export type ProductJsonItem = {
  Index: number;
  ProductName: string;
  Barcode: number;
  Stock: number;
  Price: number;
  VatRate: number;
  Rayon: string;
  Currency: string;
  UrunId: number;
  Tutar: number;
};

export type ProductsJson = {
  products: ProductJsonItem[];
  documentType: string;
  timestamp: string;
};