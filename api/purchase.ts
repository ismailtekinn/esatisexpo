import { API_URL } from "../constants/constant";
import { CreatePurchase } from "../types/purchase";
import { CreateSale } from "../types/saleType";

export async function createPurchase(
  params: CreatePurchase | CreatePurchase[]
): Promise<{ isSuccess: boolean; message: string }> {
  try {
    console.log("satış ekleme methoduna gelen veri console yazdırılıyor: ", params);
    const url = API_URL + "api/purchase/createPurchase";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "addCustomer failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred during register");
  }
}