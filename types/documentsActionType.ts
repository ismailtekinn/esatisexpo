import { SelectedCustomer } from "./customerType";
import { SaleItem } from "./saleType";

export type PendingDocument = {
  customer?: SelectedCustomer;      
  products: SaleItem[];      
  documentType?:string;
  timestamp: string;               
};