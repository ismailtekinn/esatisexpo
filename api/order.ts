import { API_URL } from "../constants/constant";
import { OrderPostDto } from "../types/orderType";

export async function getOrderList() {
  try {
    const url = `${API_URL}api/order/cashOrders`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Siparişler getirilirken bir hata oluştu."
      );
    }

    const productList = await response.json();

    return productList;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    throw new Error("Siparişler getirilirken bir hata oluştu.");
  }
}


export async function addOrder(orderDto: OrderPostDto) {
  try {
    const response = await fetch(`${API_URL}api/order/addOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDto),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sipariş oluşturulamadı");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Sipariş oluşturulurken hata:", error);
    throw error; // hata üst katmana aktarılır
  }
}