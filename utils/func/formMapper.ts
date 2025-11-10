import { AddCustomerFormTypeDeneme } from "../../types/customerType";

export function mapBackendToForm<T extends object, U>(
  backendData: T,
  formTemplate: U
): U {
  const result = { ...formTemplate };

  for (const key in formTemplate) {
    if (key in backendData) {
      (result as any)[key] = (backendData as any)[key];
    }
  }

  return result;
}

export function mapCustomerBackendToForm(
  backendData: any, // SqlData<CustomerItem>.DATA[0]
  formTemplate: AddCustomerFormTypeDeneme
): AddCustomerFormTypeDeneme {
  return {
    ...formTemplate,

    AileFertTotal: backendData.AILE_FERT_SAYISI || "0",
    AileFertBorç: backendData.AILE_BORC || "",
    AileFertAlacak: backendData.AILE_ALACAK || "",
    ToplamAileEmanetTutar: backendData.AILE_EMANET_BORC_BAKIYE || "",
    ToplamAileEmanetAdet: backendData.AILE_EMANET_URUN_ADET || "",
    MusteriAlacagi: backendData.ALACAK || "",
    MusteriBorcu: backendData.BORC || "",
    M_CINSIYETI: backendData.CINSIYETI || "0",
    M_DOGUM_TARIHI: backendData.DOGUM_TARIHI
      ? (() => {
          const datePart = backendData.DOGUM_TARIHI.split(" ")[0];
          const [gun, ay, yil] = datePart.split("/");
          if (!gun || !ay || !yil) return datePart;
          return `${gun.padStart(2, "0")}.${ay.padStart(2, "0")}.${yil}`;
        })()
      : "",
    Yas: backendData.DOGUM_TARIHI
      ? (() => {
          try {
            const datePart = backendData.DOGUM_TARIHI.split(" ")[0]; // sadece tarih kısmı
            const [gun, ay, yil] = datePart.split("/");
            if (!gun || !ay || !yil) return "";
            const dogumTarihi = new Date(
              Number(yil),
              Number(ay) - 1,
              Number(gun)
            );
            const simdi = new Date();
            let yas = simdi.getFullYear() - dogumTarihi.getFullYear();
            const ayFarki = simdi.getMonth() - dogumTarihi.getMonth();
            if (
              ayFarki < 0 ||
              (ayFarki === 0 && simdi.getDate() < dogumTarihi.getDate())
            ) {
              yas--;
            }
            return yas.toString();
          } catch {
            return "";
          }
        })()
      : "",

    EmanetLimiti: backendData.EMANET_LIMIT || "",
    E_FAT_DURUM: backendData.E_FAT_DURUM || 0,
    E_FAT_MUKELLEFI: backendData.E_FAT_MUKELLEFI || "",
    E_FAT_ODEME_EKLE: backendData.E_FAT_ODEME_EKLE || 0,
    E_FAT_POS_KUTUSU: backendData.E_FAT_POS_KUTUSU || "",
    E_FAT_SENARYO: backendData.E_FAT_SENARYO || "",
    FIRMA_SAHIS_DURUMU: backendData.FIRMA_SAHIS_DURUMU || "",
    FIYAT_NO: backendData.FIYAT_NO || "",
    MusteriGruoNo2: backendData.MusteriGruoNo2 || "",
    MusteriGruoNo3: backendData.MusteriGruoNo3 || "",
    MusteriGruoNo4: backendData.MusteriGruoNo4 || "",
    MusteriGruoNo5: backendData.MusteriGruoNo5 || "",
    EMAIL:
      backendData.ETK_EMAIL && backendData.ETK_EMAIL !== "0"
        ? backendData.ETK_EMAIL
        : "",

    GSM: backendData.GSM || "",
    ID: backendData.ID || 0,
    IL: backendData.IL || "",
    ILCE: backendData.ILCE || "",
    KART_NO: backendData.KART_NO || "",
    KartAdı: backendData.KART_ADI || "",
    KartTuru: backendData.TURU || "",
    KartDurumu: backendData.DURUMU || "",
    VeresiyeLimiti: backendData.KREDI_LIMITI || "",
    CARI_ADI: `${backendData.MUSTERI_ADI || ""} ${
      backendData.MUSTERI_SOYADI || ""
    }`.trim(),
    MUSTERI_KODU: backendData.MUSTERI_KODU || "",
    RISK_LIMITI: backendData.RISK_LIMITI || "",
    TAKIPLI: backendData.TAKIPLI || 0,
    TC_KIMLIK_NO: backendData.TC_KIMLIK_NO || "",
    TELEFON: (backendData.TELEFON_1 || "").replace(/-/g, ""),

    UTS_FIRMA_NO: backendData.UTS_FIRMA_NO || "",
    MusteriUyarilari: (backendData.UYARI_BILGI || "")
      .split(/\r?\n/) // \r\n veya \n karakterlerine göre ayır
      .map((text: string, index: number) => text.trim()) // tipleri ekledik
      .filter((text: string) => text !== "") // boş satırları çıkar
      .map((text: string, index: number) => ({
        id: index + 1,
        label: text,
      })),

    VERGI_DAIRESI: backendData.VERGI_DAIRESI || "",
    VERGI_NUMARASI: backendData.VERGI_NUMARASI || "",
    KAN_GRUBU: backendData.KAN_GRUBU || "",
    MESLEK: backendData.MESLEK_ADI || "",
    MESLEK_NO: backendData.MESLEK_NO || "",
  };
}
