import { API_URL } from "../constants/constant";
import { CreateSale, SaleEdit } from "../types/saleType";

export async function createSale(
  params: CreateSale | CreateSale[]
): Promise<{ isSuccess: boolean; message: string }> {
  try {
    console.log("satış ekleme methoduna gelen veri console yazdırılıyor: ", params);
    const url = API_URL + "api/sale/createSale";

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


export async function saleAllList(userID: number) {
  try {
    const url = `${API_URL}api/sale/saleTotalList/${userID}/all`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ürünleri getirme başarısız oldu.");
    }

    const productList = await response.json();
    return productList;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    throw new Error("Ürünler getirilirken bir hata oluştu.");
  }
}


export async function updateSale(
  params: SaleEdit | SaleEdit[]
): Promise<{ isSuccess: boolean; message: string }> {
  try {
    const url = API_URL + "api/sale/updateSale";

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