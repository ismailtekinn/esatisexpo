import { MinimalProduct } from "./types/productType";
import { SaleEditProdcut } from "./types/saleType";

export type RootStackParamList = {
  Home: undefined;
  Signin: undefined;
  Clock: undefined;
  Language: undefined;
  AddDebt: undefined;
  AccountInfoForm: undefined;
  Account: undefined;
  FormListDeneme: undefined;
  MoneyTransferScreen: undefined;
  CashReceivable: undefined;
  AddCustomer: undefined;
  AddSuplier: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  AddNew: undefined;
  Financial: undefined;
  NewSale: undefined;
  ProductEdit: { productId: number };
  ProductList: undefined;
  Debt: undefined;
  DeleteDebt: undefined;
  Help: undefined;
  // SalesEdit: undefined;
  // SalesEdit: SaleEditProdcut;
  SalesScreen: undefined;
  SettingsScreen:undefined;
  MainPage: undefined;
  PurchaseForm: undefined;
  BarcodeScannerPage: undefined;
  ReturnProduct: undefined;
  PurchaseForms: undefined;
  CustomerSelect: undefined;
  SelectProduct: { source: string };
  Rapor: undefined;
  SaleProductList: undefined;
  AdminPage: undefined;
  HomeScreen: undefined;
  ProductListScreen: {categoryId:number,categoryName:string};
  BasketCardScreen: undefined;
  StaffScreen: undefined;
  CustomerSearchScreen:undefined;
  TriaSplashScreen:undefined;

};

export type User = {
  UserID: number;
  Name: string;
  Surname: string;
  Username: string;
  Email: string;
  Password: string;
  RoleID: number;
  Phone: number;
};
