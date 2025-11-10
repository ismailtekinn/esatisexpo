import { Product } from "./productListType";

type ProductPreview = Pick<Product, "id" | "name" | "description" | "imageUrl">;

export interface BasketType  {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: ProductPreview;
}

export interface CartItemProps {
  item: BasketType;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, change: number) => void;
  updating: boolean;
}

export interface AddBasket {
  userId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface UpdateBasket {
  id: number;
  quantity: number;
}