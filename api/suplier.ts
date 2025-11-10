import { API_URL } from "../constants/constant";
import { Customer   } from "../types/customerType";
import { Suplier } from "../types/suplierType";





export async function addSupplier(
  params: Suplier
): Promise<{ isSuccess: boolean; message: string }> {
  try {
    const url = API_URL + "api/suplier/createSupplier";
    console.log("öğeler buraya geldi", params);

    const response = await fetch(url, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...params,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "addCustomer failed");
    }
    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred during register");
  }
}

 export async function suplierList (userID: number) {
  try {
    const url = `${API_URL}api/suplier/suplierList/${userID}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Tedarikçiler başarıyla getirildi .");
    }

    const productList = await response.json();
    return productList;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    throw new Error("Tedarikçiler getirilirken bir hata oluştu.");
  }
}

