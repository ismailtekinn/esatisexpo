import { API_URL } from "../constants/constant";
import {
  ApiResponse,
  CustomerItem,
  SQLDataResponse,
} from "../types/apiresponse/searchCustomers";
import { AddCustomerFormTypeDeneme, Customer, SearchCustomerFields } from "../types/customerType";
import { fetchSearchMethot } from "./generic";

export async function addCustomer(
  params: Customer
): Promise<{ isSuccess: boolean; message: string }> {
  try {
    const url = API_URL + "api/customer/createCustomer";
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

export async function customerList(userID: number) {
  try {
    const url = `${API_URL}api/customer/customerList/${userID}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Müşteriler başarıyla getirildi .");
    }

    const productList = await response.json();
    return productList;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    throw new Error("Müşteriler getirilirken bir hata oluştu.");
  }
}

export async function searchCustomers(
  params: Partial<SearchCustomerFields>
): Promise<SQLDataResponse> {
  try {
    const url = "http://94.54.83.21:8082/TriaRestEczane/MusteriSorgula";

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
      throw new Error(errorData.error || "Müşteri sorgulama başarısız oldu.");
    }

    const apiResponse: ApiResponse = await response.json();

    if (!apiResponse.SQL_Data) {
      throw new Error("SQL_Data alanı boş döndü.");
    }

    // SQL_Data stringini parse et
    const sqlData: SQLDataResponse = JSON.parse(apiResponse.SQL_Data);
    sqlData.DATA = sqlData.DATA.map((item) => ({
      ...item,
    }));

    return sqlData;
  } catch (error: any) {
    console.error("Müşteri sorgulama hatası:", error);
    throw new Error(
      error.message || "Müşteri sorgulama sırasında bir hata oluştu."
    );
  }
}
// export async function createUpdateCustomer(params: Partial<AddCustomerFormTypeDeneme>): Promise<> {
//   try {
//     const url = `${API_URL}TriaRestEczane//CariEkleGuncelle`;

//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(params),
//       mode: "cors",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || "Müşteri ekleme işlemi başarısız oldu.");
//     }

//     const apiResponse: ApiResponse = await response.json();

//     if (!apiResponse.SQL_Data) {
//       throw new Error("SQL_Data alanı boş döndü.");
//     }

//     // SQL_Data stringini parse et
//     const sqlData: SQLDataResponse = JSON.parse(apiResponse.SQL_Data);
//     sqlData.DATA = sqlData.DATA.map((item) => ({
//       ...item,
//     }));

//     return sqlData;
//   } catch (error: any) {
//     console.error("Müşteri sorgulama hatası:", error);
//     throw new Error(
//       error.message || "Müşteri sorgulama sırasında bir hata oluştu."
//     );
//   }
// }
