import { API_URL } from "../constants/constant";


export async function getCategoryList() {
  try {
    const url = `${API_URL}api/category/categories`;

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