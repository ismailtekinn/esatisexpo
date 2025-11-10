export interface CreateReturn {
  Quantity: number;
  ReturnDate: Date;
  ReturnType: string;
  TotalAmount: number;
  ReturnDescription: string;
  UserID: number;
  ClientID?: number;
  SaleID?: number;
  ProductID: number;
}

