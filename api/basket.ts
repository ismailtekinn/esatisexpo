import { API_URL } from "../constants/constant";
import { AddBasket, UpdateBasket } from "../types/basketType";




export async function addBasket(params: AddBasket) {
  try {
    console.log("Ürün verisi backend'e gönderilmek üzere alındı", params);

    const url = API_URL + "api/cartitem/addCartItem";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      mode: "cors",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ürün oluşturma başarısız oldu.");
    }
    const createdProduct = await response.json();
    console.log("Ürün başarıyla oluşturuldu:", createdProduct);
    return createdProduct;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    throw new Error("Ürün oluşturulurken bir hata oluştu.");
  }
}



export async function getBasketList(userId: number) {
  try {
    const url = `${API_URL}api/cartitem/getCartItemList/${userId}`;

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



export async function updateBasket(request: UpdateBasket) {
  try {
    const url = `${API_URL}api/cartitem/updateCartItem`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      mode: "cors",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ürün güncelleme başarısız oldu.");
    }

    const updatedResult = await response.json();
    return updatedResult;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    throw new Error("Ürün güncellenirken bir hata oluştu.");
  }
}

export async function deleteBasketItem(id: number) {
  try {
    const url = `${API_URL}api/cartitem/deleteCartItem/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ürün silme başarısız oldu.");
    }

    const deletedResult = await response.json();
    console.log("Ürün başarıyla silindi:", deletedResult);
    return deletedResult;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    throw new Error("Ürün silinirken bir hata oluştu.");
  }
}