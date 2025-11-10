export interface CreatePurchase {
  UserID:number;
  Purchase_date: Date;
  ProductID:number;
  SupplierID?:number;
  Total_amount: number;
  Quantity: number;
}