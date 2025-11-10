export interface SaleList {
  ProductID: number;
  ProductName: string;
  SalePrice: number;
  SaleDate: Date;
  Stok_Quantity: number;
}
export interface RaporList {
  ProductID: number;
  ProductName: string;
  SalePrice: number;
  SaleDate: Date;
  Stok_Quantity: number;
  ReturnDate: Date;
  SupplierID: number;
  SupplierName: string;
  SupplierSurname: string;
  ClientID: number;
  ClientName: string;
  ClientSurname: string;
}
export interface SaleList {
  Purchase_date: Date;
}

export interface TotalSummary {
  purchaseReturnTotal: number;
  purchaseTotal: number;
  saleReturnTotal: number;
  saleTotal: number;
  debtSaleTotal: number;
}
