import * as FileSystem from "expo-file-system";
import { PendingDocument } from "../../types/documentsActionType";

import * as Sharing from "expo-sharing";
import { SaleItem } from "../../types/saleType";

const PENDING_DOCS_DIR = FileSystem.documentDirectory + "pendingDocuments/";

const ensurePendingDocsDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(PENDING_DOCS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PENDING_DOCS_DIR, {
      intermediates: true,
    });
  }
};

export const savePendingDocument = async (doc: PendingDocument) => {
  try {
    await ensurePendingDocsDirExists();
    // 2. Dosya adı oluştur
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const customerId = doc.customer?.id ?? "unknown";
    const fileName = `customer_${customerId}_${timestamp}.json`;
    const fileUri = PENDING_DOCS_DIR + fileName;

    // 3. JSON'a çevir ve kaydet
    const json = JSON.stringify(doc, null, 2);
    await FileSystem.writeAsStringAsync(fileUri, json);

    console.log("Belge kaydedildi:", fileUri);
  } catch (error) {
    console.error("Belge kaydedilemedi:", error);
  }
};

export const getPendingDocumentContent = async (fileName: string) => {
  try {
    const fileUri =
      FileSystem.documentDirectory + "pendingDocuments/" + fileName;
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const jsonData = JSON.parse(fileContent);
    return jsonData;
  } catch (error) {
    console.error("Dosya okunamadı:", error);
    return null;
  }
};
export const listPendingDocuments = async () => {
  try {
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + "pendingDocuments/"
    );
    console.log(
      "dökümanlar list methodunun içinde console yazdırılıyor:",
      files
    );
    return files;
  } catch (error) {
    console.error("Klasör okunamadı:", error);
    return [];
  }
};
const productCache = new Map<number, SaleItem>();
let isCacheInitialized = false;

export const findProductByBarcode = async (barcode: number) => {
  try {
    console.log("barcode numarası console yazdırılıyor :", barcode);

    if (!isCacheInitialized) {
      const files = await listPendingDocuments();

      for (const file of files) {
        const content = await getPendingDocumentContent(file);
        if (content?.products && Array.isArray(content.products)) {
          for (const product of content.products) {
            const key = Number(product.Barcode);
            if (!isNaN(key)) {
              productCache.set(key, product);
            }
          }
        }
      }

      isCacheInitialized = true;
      console.log(
        "Product cache initialized with",
        productCache.size,
        "products"
      );
    }

    const result = productCache.get(barcode);
    if (!result) {
      console.warn("Aranan ürün cache'de bulunamadı:", barcode);
    }

    return result ?? null;
  } catch (error) {
    console.error("Ürün arama hatası:", error);
    return null;
  }
};

// dosyayı silme methodu
export const clearPendingDocuments = async () => {
  const dir = FileSystem.documentDirectory + "pendingDocuments/";
  try {
    const files = await FileSystem.readDirectoryAsync(dir);
    for (const file of files) {
      await FileSystem.deleteAsync(dir + file);
    }
    console.log("Tüm bekleyen belgeler silindi.");
  } catch (error) {
    console.error("Belgeler silinemedi:", error);
  }
};

// dosyayı paylaşma methodu
export const sharePendingDocument = async () => {
  try {
    console.log("bekleyen belgeyi paylaşma fonksiyonu çağrıldı");

    const pendingDir = FileSystem.documentDirectory + "pendingDocuments/";
    const files = await FileSystem.readDirectoryAsync(pendingDir);

    if (files.length === 0) {
      alert("Paylaşılacak belge yok.");
      return;
    }

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      alert("Paylaşım cihazınızda desteklenmiyor.");
      return;
    }

    for (const fileName of files) {
      const fileUri = pendingDir + fileName;
      await Sharing.shareAsync(fileUri);
      console.log("Paylaşılan belge:", fileUri);
    }
  } catch (error) {
    console.error("Belgeler paylaşılmadı:", error);
  }
};
