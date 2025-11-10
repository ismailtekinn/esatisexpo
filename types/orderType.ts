export interface OrderItemPostDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface OrderPostDto {
  userId: number;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: "CASH" | "CARD";
  orderItems: OrderItemPostDto[];
}

export interface OrderCartItem {
  id: number;
  productId: number;
  userId: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
  };
}