
export async function bussinessList(
  params: Record<string, unknown> // BussinessListFields yerine daha genel tuttum
): Promise<BussinessSqlData> {
  try {
    const url =
      "http://94.54.83.21:8082/TriaRestEczane/MeslekSorgula";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      mode: "cors",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || "Meslek sorgulama başarısız oldu."
      );
    }

    // API response
    const apiResponse: BussinessApiResponse = await response.json();

    if (!apiResponse.SQL_Data) {
      throw new Error("SQL_Data alanı boş döndü.");
    }

    // SQL_Data JSON stringini parse et
    const sqlData: BussinessSqlData = JSON.parse(apiResponse.SQL_Data);
//  console.log("MESLEK DATASI CONSOLE YAZDIRILIYOR: ", sqlData)
    sqlData.DATA = sqlData.DATA.map((item) => ({
      KOD: String(item.KOD),
      ACIKLAMA: String(item.ACIKLAMA),
    }));

    return sqlData;
  } catch (error: any) {
    console.error("Meslek sorgulama hatası:", error);
    throw new Error(
      error.message || "Meslek sorgulama sırasında bir hata oluştu."
    );
  }
}
