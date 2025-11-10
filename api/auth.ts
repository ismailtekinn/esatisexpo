import axios from "axios";
import { Register, SignIn } from "../types/authType";
import Constants from "expo-constants";
import https from "https";
import { API_URL, LOGIN_URL } from "../constants/constant";
import { BackendResponse } from "../types/apiresponse/newGenericResponseType";

// export async function login(params: SignIn) {
//   try {
//     // const url = LOGIN_URL + 'api/auth/login';
//     const url = LOGIN_URL;

//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         ...params,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || "Login failed");
//     }
//     const raw = await response.json();
//     const userData: BackendResponse = Object.fromEntries(
//       Object.entries(raw).map(([k, v]) => [
//         k,
//         k.startsWith("SQL_Data") && typeof v === "string" ? JSON.parse(v) : v,
//       ])
//     ) as BackendResponse;
//     return userData;
//   } catch (error) {
//     console.error(error);
//     throw new Error("An error occurred during login");
//   }
// }

export async function login(params: SignIn) {
  try {
    const url = LOGIN_URL;
    // const url = "http://192.168.1.172:44342/KullaniciSorgula";
    const timeout = 2000; // test için kısa süre

    const response = await Promise.race([
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      }),
      new Promise<Response>((_, reject) =>
        setTimeout(
          () =>
            reject({
              title: "Hata",
              message: "Sunucunun yanıt vermesi çok uzun sürdü",
            }),
          timeout
        )
      ),
    ]);

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        title: "Login Hatası",
        message: errorData.error || "Login başarısız",
      };
    }

    const raw = await response.json();

    const userData: BackendResponse = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [
        k,
        k.startsWith("SQL_Data") && typeof v === "string" ? JSON.parse(v) : v,
      ])
    ) as BackendResponse;

    return userData;
  } catch (error: any) {
    // Error objesini title + message olarak fırlat
    if (typeof error === "string") throw { title: "Hata", message: error };
    throw {
      title: error.title || "Hata",
      message: error.message || "Bir hata oluştu",
    };
  }
}

export async function register(params: Register) {
  console.log("Register data verileri ekrana yazdırıldı", params);
  try {
    const url = API_URL + "api/auth/register";
    console.log("kayıt verileri console yazdırıldı");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...params,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "register failed");
    }

    const userData = await response.json();
    console.log("Burası register methodu ", userData.message);
    return userData;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred during register");
  }
}
