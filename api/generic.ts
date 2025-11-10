import {
  AddUpdateApiResponse,
  AddUpdateData,
  // BackendResponse,
  // SqlData,
} from "../types/apiresponse/genericResponseType";
import {
  BackendResponse,
  SqlData,
} from "../types/apiresponse/newGenericResponseType";

export function safeJSONParse<T>(str: string): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    const cleaned = str.replace(/"([^"]*(?:\\.[^"]*)*)"/g, (match, content) => {
      return `"${content
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n")
        .replace(/\t/g, "\\t")}"`;
    });
    return JSON.parse(cleaned) as T;
  }
}

// export async function fetchSearchMethot<T, TParams extends object>(
//   url: string,
//   params: TParams
// ): Promise<{ main: SqlData<T>; [key: string]: SqlData<any> | null }> {
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(params),
//     });
//     if (response.ok != true) {
//       const errorData = await response.json().catch(() => null);
//       throw new Error(errorData?.ErrorMessage || "API isteği başarısız oldu.");
//     }
//     const backendResponse: BackendResponse = await response.json();
//     if (!backendResponse.SQL_Data) {
//       throw new Error("SQL_Data alanı boş döndü.");
//     }
//     const mainData: SqlData<T> = safeJSONParse(backendResponse.SQL_Data);
//     const result: { main: SqlData<T>; [key: string]: SqlData<any> | null } = {
//       main: mainData,
//     };

//     for (let i = 2; i <= 10; i++) {
//       const key = `SQL_Data_${i}` as keyof BackendResponse;
//       result[key] = backendResponse[key]
//         ? safeJSONParse(backendResponse[key]!)
//         : null;
//     }

//     return result;
//   } catch (error: any) {
//     console.error("API hatası:", error);
//     throw new Error(error.message || "API sırasında bir hata oluştu.");
//   }
// }

export async function fetchSearchMethot<T, TParams extends object>(
  url: string,
  params: TParams
): Promise<{ main: SqlData<T>; [key: string]: SqlData<any> | null }> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data: BackendResponse = await response.json();
  if (!response.ok) {
    throw new Error(data?.ErrorMessage || "API isteği başarısız oldu.");
  }
  if (!data.SQL_Data ||data.SQL_Data === "") throw new Error("SQL_Data alanı boş döndü.");
  const result: any = { main: safeJSONParse<SqlData<T>>(data.SQL_Data) };
  for (let i = 2; i <= 10; i++) {
    const key = `SQL_Data_${i}`;
    result[key] = data[key as keyof BackendResponse]
      ? safeJSONParse(data[key as keyof BackendResponse]!)
      : null;
  }

  return result;
}

export async function addUpdateEntity(url: string, data: AddUpdateData) {
  try {
    console.log(
      "addUpdateEntity methodu çağrıldı url console yazdırılıyor: ",
      url
    );
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result: AddUpdateApiResponse = await response.json();
    let parsedData = null;
    if (result.SQL_Data) {
      try {
        parsedData = JSON.parse(result.SQL_Data);
      } catch (e) {
        console.warn("SQL_Data parse edilemedi:", e);
      }
    }
    if (result.ResultCode === "0") {
      return {
        success: true,
        message: "Ekleme başarılı",
        raw: result,
        parsedData,
      };
    } else {
      return {
        success: false,
        message: result.ErrorMessage || "Bilinmeyen hata",
        raw: result,
        parsedData,
      };
    }
  } catch (err: any) {
    console.error("Request hatası:", err);
    return {
      success: false,
      message: err.message,
      raw: null,
      parsedData: null,
    };
  }
}
