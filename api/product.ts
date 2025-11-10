import { API_URL, API_URL101 } from "../constants/constant";
import {
  ProductDataItem,
  SearchProductResponse,
  SQLDataParsed,
} from "../types/apiresponse/searchProduct";
import {
  Product,
  SearchProductFields,
  UpdateProduct,
} from "../types/productType";

export async function createProduct(params: Product) {
  try {
    console.log("Ürün verisi backend'e gönderilmek üzere alındı", params);

    const url = API_URL + "api/product/createProduct";
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

export async function getProductList(categoryId: number) {
  try {
    const url = `${API_URL}api/product/productList/${categoryId}`;

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
export async function getProductByBarcode(BarcodeNumber: string) {
  try {
    const url = `${API_URL}api/product/getProductByBarcode?BarcodeNumber=${BarcodeNumber}`;

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
export async function getProdcutNameList(productName: string) {
  try {
    const url = `${API_URL}api/product/getProdcutNameList?ProductName=${productName}`;

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

export async function getProductById(productId: number) {
  try {
    const url = `${API_URL}api/product/getProductById?ProductId=${productId}`;

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

export async function updateProduct(params: UpdateProduct) {
  try {
    const url = API_URL + "api/product/updateProduct";
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
      throw new Error(
        errorData.error || "Ürün güncelleme işlemi başarısız oldu."
      );
    }
    const createdProduct = await response.json();
    return createdProduct;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    throw new Error("Ürün oluşturulurken bir hata oluştu.");
  }
}

export async function searchProduct( // Fonksiyon tanımı
  params: SearchProductFields // Parametre tipini al
): Promise<ProductDataItem[]> {
  try {
    const url = API_URL101 + "TriaRestEczane/UrunAra"; // API URL
    const response = await fetch(url, {
      method: "POST", // POST metodu
      headers: { "Content-Type": "application/json" }, // Başlık
      body: JSON.stringify(params), // Parametreyi stringe çevir
      mode: "cors", // CORS modu
    });

    if (!response.ok) {
      const errorData = await response.json(); // Hata verisi
      throw new Error( // Hata fırlat
        errorData.error || "Ürün güncelleme işlemi başarısız oldu."
      );
    }
    const searchProduct: SearchProductResponse = await response.json(); // Yanıt json
    if (!searchProduct.SQL_Data) {
      return []; // Boş dizi dön
    }

    const cleanSQLData = searchProduct.SQL_Data.replace(
      /[\u0000-\u001F]+/g,
      ""
    ); // Kontrol karakter temizle
    const parsedData: SQLDataParsed = JSON.parse(cleanSQLData); // JSON parse et
    return parsedData.DATA; // DATA dizisini dön
  } catch (error) {
    // Hata yakalama
    console.error("Bir hata oluştu:", error); // Hata yazdır
    throw new Error("Ürünler alınamadı."); // Hata fırlat
  }
}

// export async function searchProduct(
//   UrunAdi: string
// ): Promise<ProductDataItem[]> {

//   try {
//     const url = API_URL101 + "TriaRestEczane/UrunSorgula"; // API URL
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ UrunAdi }), // parametreyi obje olarak gönder
//       mode: "cors",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData.error || "Ürün sorgulama işlemi başarısız oldu."
//       );
//     }

//     const searchProduct: SearchProductResponse = await response.json();

//     // RECORD_COUNT'u console'a yazdır
//     const recordMatch = searchProduct.SQL_Data?.match(/"RECORD_COUNT":"(\d+)"/);

//     if (!searchProduct.SQL_Data) return [];
//     const cleanSQLData = searchProduct.SQL_Data.replace(
//       /[\u0000-\u001F]+/g,
//       ""
//     ).replace(/\\/g, "\\\\"); // tüm \ karakterlerini çift \ yap
//     const parsedData: SQLDataParsed = JSON.parse(cleanSQLData);

//     return parsedData.DATA;
//   } catch (error) {
//     console.error("Bir hata oluştu:", error);
//     throw new Error("Ürünler alınamadı.");
//   }
// }
