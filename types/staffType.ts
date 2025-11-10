import { OrderStatus } from "./enums/staff";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: "CASH" | "CARD" | string; 
  status: OrderStatus ; 
  createdAt: Date;
  orderItems: OrderItem[];
}

export interface OrderCardProps {
  order: Order;
  updateOrderStatus: (orderId: number, newStatus: Order["status"]) => void;
}
