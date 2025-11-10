// export type Product = {
//     id: number;
//     name: string;
//     quantity: number;
//   };


  export interface Product {
    ProductName: string;
    BarcodeNumber: string;
    Description?: string;
    SalePrice: number;
    UserID:number;
    PurchasePrice: number;
    Stok_Quantity: number;
    // SupplierID: number;
    StockType: string;
    Created_At: string; 
    Update_At: string;
  }

export interface MinimalProduct {
  ProductID:number;
  ProductName: string;
  Stok_Quantity: number;
  PurchasePrice:number;
  SaleDate:Date;
  SalePrice:number;
  SaleID?:number;
  Quantity:number;
}

  export interface AddProduct {
    ProductID:number;
    ProductName: string;
    SalePrice: number;
    SaleID:number;
    PurchasePrice: number;
    Stok_Quantity: number;
  }
  export interface UpdateProduct {
    ProductID:number;
    ProductName: string;
    BarcodeNumber: string;
    Description?: string;
    SalePrice: number;
    PurchasePrice: number;
    Stok_Quantity: number;
    StockType: string;
    Update_At: string;
  }

  export interface SearchProductFields{
    Aranan :string,
    AramaTipi:number
    Baslangic?:number,
    Adet?:number,
  }