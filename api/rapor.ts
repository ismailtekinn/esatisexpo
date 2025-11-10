import { API_URL } from "../constants/constant";

export async function allTotalAmount(userID: number) {
  try {
    const url = `${API_URL}api/rapor/allTotalAmount/${userID}`;
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

export async function raporList(userID: number, type: string) {
  try {
    let endpoint = "";
    if (type === "standard") {
      endpoint = `api/sale/saleTotalList/${userID}/${type}`;
    }
    else if (type === "debt") {
      endpoint = `api/sale/saleTotalList/${userID}/${type}`;
    } else if (type === "purchase") {
      endpoint = `api/purchase/purchaseList/${userID}`;
    } else if (type === "customer") {
      endpoint = `api/return/returnList/${userID}/${type}`;
    } else if (type === "supplier") {
      endpoint = `api/return/returnList/${userID}/${type}`;
    } else {
      throw new Error(
        "Geçersiz işlem türü: type sadece 'sale' veya 'purchase' olabilir."
      );
    }
    const url = `${API_URL}${endpoint}`;

    console.log("url console yazdırılıyo r: ", url)
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Verileri getirme başarısız oldu.");
    }
    const dataList = await response.json();
    return dataList;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    throw new Error("Veriler getirilirken bir hata oluştu.");
  }
}
