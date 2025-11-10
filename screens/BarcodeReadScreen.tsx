// import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
// import { useEffect, useState, useRef } from "react";
// import {
//   Button,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { Audio } from "expo-av";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from "../types";

// const BarcodeReadScreen: React.FC = () => {
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

//   const [facing, setFacing] = useState<CameraType>("back");
//   const [permission, requestPermission] = useCameraPermissions();
//   const [lastScanned, setLastScanned] = useState<number | null>(null);
//   const scanCooldown = 3000;

//   const [scannedCodes, setScannedCodes] = useState<string>("");
//   const [scannedList, setScannedList] = useState<string[]>([]);

//   const scanBuffer = useRef<Map<string, { count: number; timestamp: number }>>(
//     new Map()
//   );
//   const requiredScans = 2;
//   const bufferTimeout = 1500;

//   const playBeep = async () => {
//     try {
//       const { sound } = await Audio.Sound.createAsync(
//         require("../assets/beepsound.mp3")
//       );
//       await sound.playAsync();
//     } catch (error) {
//       console.log("Ses çalma hatası:", error);
//     }
//   };

//   console.log(
//     "okunan barcode state atandı ve bu sonuç yazdırılıyor : ",
//     scannedCodes
//   );

//   const validateBarcode = (code: string, type?: string): boolean => {
//     if (!code || code.trim().length === 0) return false;
//     const typeStr = (type || "").toLowerCase();
//     const isQR =
//       typeStr.includes("qr") ||
//       type === "256" ||
//       type === "org.iso.QRCode" ||
//       typeStr === "qrcode";
//     if (isQR) return code.trim().length > 0;
//     if (/^(.)\1+$/.test(code) && code.length < 20) return false;
//     return true;
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       scanBuffer.current.forEach((value, code) => {
//         if (now - value.timestamp > bufferTimeout) {
//           scanBuffer.current.delete(code);
//         }
//       });
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>Kamera kullanımı için izin gerekli</Text>
//         <Button onPress={requestPermission} title="İzin Ver" />
//       </View>
//     );
//   }
//   const handleBarcodeScanned = async ({
//     type,
//     data,
//   }: {
//     type: string;
//     data: string;
//   }) => {
//     const now = Date.now();
//     if (lastScanned && now - lastScanned < scanCooldown) return;

//     const normalizedData = data.trim();
//     if (!validateBarcode(normalizedData, type)) return;

//     const existing = scanBuffer.current.get(normalizedData);
//     if (!existing) {
//       scanBuffer.current.set(normalizedData, { count: 1, timestamp: now });
//       return;
//     }
//     if (now - existing.timestamp > bufferTimeout) {
//       scanBuffer.current.set(normalizedData, { count: 1, timestamp: now });
//       return;
//     }

//     const newCount = existing.count + 1;
//     scanBuffer.current.set(normalizedData, {
//       count: newCount,
//       timestamp: existing.timestamp,
//     });

//     if (newCount >= requiredScans) {
//       setLastScanned(now);
//       scanBuffer.current.clear();
//       await playBeep();

//       // QR mu?
//       const typeStr = (type || "").toLowerCase();
//       const isQR =
//         typeStr.includes("qr") ||
//         type === "256" ||
//         type === "org.iso.QRCode" ||
//         typeStr === "qrcode";

//       let barcodeToDisplay = normalizedData; // fallback: tüm veri

//       // 1) Eğer GS1 AI formatı varsa: AI "01" + 14 haneli GTIN
//       // örn: ...01<14digits>...
//       const matchAI01 = normalizedData.match(/01(\d{14})/);
//       if (matchAI01) {
//         barcodeToDisplay = matchAI01[1];
//         console.log("Parsed via GS1 AI 01 ->", barcodeToDisplay);
//       } else if (isQR) {
//         // 2) QR ise önce JSON dene
//         try {
//           const parsedData = JSON.parse(normalizedData);
//           // olası alan isimlerini kontrol et
//           if (parsedData?.barcode) {
//             barcodeToDisplay = String(parsedData.barcode);
//             console.log("Parsed JSON.barcode ->", barcodeToDisplay);
//           } else if (parsedData?.gtin) {
//             barcodeToDisplay = String(parsedData.gtin);
//             console.log("Parsed JSON.gtin ->", barcodeToDisplay);
//           } else {
//             // JSON ama doğrudan beklenen alan yok -> fallback numeric search
//             const numericMatch = normalizedData.match(/\d{14,16}/);
//             if (numericMatch) {
//               barcodeToDisplay = numericMatch[0];
//               console.log("Parsed JSON fallback numeric ->", barcodeToDisplay);
//             }
//           }
//         } catch {
//           // 3) JSON değilse: önce GS1-like AI'leri ara (ör. 01...), sonra 14-16 haneli grup ara
//           const numericMatch = normalizedData.match(/\d{14,16}/);
//           if (numericMatch) {
//             barcodeToDisplay = numericMatch[0];
//             console.log("Parsed numeric 14-16 ->", barcodeToDisplay);
//           } else {
//             // 4) hiç yoksa ilk sayı grubunun ilk 14 hanesini alın
//             const anyNum = normalizedData.match(/\d+/);
//             if (anyNum) {
//               barcodeToDisplay = anyNum[0].slice(0, 14);
//               console.log("Parsed anyNum fallback ->", barcodeToDisplay);
//             } else {
//               console.log("No numeric part found, using full normalizedData");
//             }
//           }
//         }
//       } else {
//         // non-QR: yine numeric arama
//         const numericMatch = normalizedData.match(/\d{14,16}/);
//         if (numericMatch) {
//           barcodeToDisplay = numericMatch[0];
//           console.log("Parsed numeric non-QR ->", barcodeToDisplay);
//         } else {
//           const anyNum = normalizedData.match(/\d+/);
//           if (anyNum) {
//             barcodeToDisplay = anyNum[0].slice(0, 14);
//             console.log("Parsed anyNum non-QR fallback ->", barcodeToDisplay);
//           }
//         }
//       }

//       // Son kontroller: trim, saflaştır
//       barcodeToDisplay = String(barcodeToDisplay).trim();

//       // Tekrarlardan kaçınma: sadece yeni barkodları ekle
//       setScannedCodes(barcodeToDisplay);
//       setScannedList((prev) => {
//         if (prev.includes(barcodeToDisplay)) return prev;
//         return [...prev, barcodeToDisplay];
//       });

//       console.log("✅ Kod başarıyla okundu (final):", barcodeToDisplay);
//     }
//   };

//   function toggleCameraFacing() {
//     setFacing((current) => (current === "back" ? "front" : "back"));
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView
//         style={styles.camera}
//         facing={facing}
//         onBarcodeScanned={handleBarcodeScanned}
//         barcodeScannerSettings={{
//           barcodeTypes: [
//             "qr",
//             "ean13",
//             "ean8",
//             "upc_a",
//             "upc_e",
//             "code128",
//             "code39",
//             "code93",
//             "codabar",
//             "itf14",
//             "pdf417",
//             "aztec",
//             "datamatrix",
//           ],
//         }}
//       >
//         <View style={styles.scanGuide}>
//           <View style={styles.scanFrame}>
//             <View style={[styles.corner, styles.topLeft]} />
//             <View style={[styles.corner, styles.topRight]} />
//             <View style={[styles.corner, styles.bottomLeft]} />
//             <View style={[styles.corner, styles.bottomRight]} />
//           </View>
//           {/* Barkod sonucu kamera üzerinde minimal kutuda */}
//         </View>
//       </CameraView>
//       <View style={styles.resultBox}>
//         {scannedCodes ? (
//           <Text style={styles.resultText}>{scannedCodes}</Text>
//         ) : null}
//       </View>
//       <View style={[styles.bottomBar, { zIndex: 1000 }]}>
//         <Text style={styles.counterText}>Sayaç: {scannedList.length}</Text>
//         <TouchableOpacity
//           style={styles.shareButton}
//           onPress={() => {
//             if (scannedList.length === 0) return; // liste boşsa işlem yapma

//             const products = scannedList.map((barcode) => ({
//               name: "Ürün Adı",
//               barcode: barcode,
//               price: 10,
//               quantity: 1,
//             }));

//             console.log("tıklanıldı");
//             navigation.navigate("ProductBarcodeReadListScreen", { products });
//           }}
//         >
//           <Ionicons name="share-social-outline" size={28} color="white" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     //  flex: 1,
//     zIndex: 9999,
//   },
//   message: { textAlign: "center", paddingBottom: 10, zIndex: 9999 },
//   camera: { width: "100%", height: "100%" },
//   button: { position: "absolute", bottom: 20, right: 20, padding: 10 },
//   text: { fontSize: 18, fontWeight: "bold", color: "white" },
//   scanGuide: {
//     // flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   scanFrame: { width: 380, height: 540, position: "relative", marginTop: 30 },
//   corner: {
//     position: "absolute",
//     width: 30,
//     height: 30,
//     borderColor: "#00FF00",
//     borderWidth: 5,
//   },
//   topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
//   topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
//   bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
//   bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
//   resultBox: {
//     position: "absolute",
//     bottom: 70, // Alt kenardan biraz yukarı
//     left: 0,
//     right: 0, // Tam genişlik için
//     height: 100, // Sabit yükseklik
//     backgroundColor: "rgba(0,0,0,0.5)", // Hafif siyah şeffaf
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   resultText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   bottomBar: {
//     position: "absolute",
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   counterText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//     backgroundColor: "#007AFF",

//     borderRadius: 8, // ✅ Köşeleri yumuşatmak için
//     paddingHorizontal: 10, // ✅ İç boşluk (yatay)
//     paddingVertical: 5, // ✅ İç boşluk (dikey)
//     textAlign: "center",
//   },

//   shareButton: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },

//   shareText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default BarcodeReadScreen;

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

const BarcodeReadScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [lastScanned, setLastScanned] = useState<number | null>(null);
  const scanCooldown = 3000;

  const [scannedCodes, setScannedCodes] = useState<string>("");
  const [scannedList, setScannedList] = useState<string[]>([]);

  const scanBuffer = useRef<Map<string, { count: number; timestamp: number }>>(
    new Map()
  );
  const requiredScans = 2;
  const bufferTimeout = 1500;

  const playBeep = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/beepsound.mp3")
      );
      await sound.playAsync();
    } catch (error) {
      console.log("Ses çalma hatası:", error);
    }
  };

  const validateBarcode = (code: string, type?: string): boolean => {
    if (!code || code.trim().length === 0) return false;
    const typeStr = (type || "").toLowerCase();
    const isQR =
      typeStr.includes("qr") ||
      type === "256" ||
      type === "org.iso.QRCode" ||
      typeStr === "qrcode";
    if (isQR) return code.trim().length > 0;
    if (/^(.)\1+$/.test(code) && code.length < 20) return false;
    return true;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      scanBuffer.current.forEach((value, code) => {
        if (now - value.timestamp > bufferTimeout) {
          scanBuffer.current.delete(code);
        }
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Kamera kullanımı için izin gerekli</Text>
        <Button onPress={requestPermission} title="İzin Ver" />
      </View>
    );
  }

  const handleBarcodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    const now = Date.now();
    if (lastScanned && now - lastScanned < scanCooldown) return;

    const normalizedData = data.trim();
    if (!validateBarcode(normalizedData, type)) return;

    const existing = scanBuffer.current.get(normalizedData);
    if (!existing) {
      scanBuffer.current.set(normalizedData, { count: 1, timestamp: now });
      return;
    }
    if (now - existing.timestamp > bufferTimeout) {
      scanBuffer.current.set(normalizedData, { count: 1, timestamp: now });
      return;
    }

    const newCount = existing.count + 1;
    scanBuffer.current.set(normalizedData, {
      count: newCount,
      timestamp: existing.timestamp,
    });

    if (newCount >= requiredScans) {
      setLastScanned(now);
      scanBuffer.current.clear();
      await playBeep();

      const typeStr = (type || "").toLowerCase();
      const isQR =
        typeStr.includes("qr") ||
        type === "256" ||
        type === "org.iso.QRCode" ||
        typeStr === "qrcode";

      let barcodeToDisplay = normalizedData;

      const matchAI01 = normalizedData.match(/01(\d{14})/);
      if (matchAI01) {
        barcodeToDisplay = matchAI01[1];
      } else if (isQR) {
        try {
          const parsedData = JSON.parse(normalizedData);
          if (parsedData?.barcode) {
            barcodeToDisplay = String(parsedData.barcode);
          } else if (parsedData?.gtin) {
            barcodeToDisplay = String(parsedData.gtin);
          } else {
            const numericMatch = normalizedData.match(/\d{14,16}/);
            if (numericMatch) {
              barcodeToDisplay = numericMatch[0];
            }
          }
        } catch {
          const numericMatch = normalizedData.match(/\d{14,16}/);
          if (numericMatch) {
            barcodeToDisplay = numericMatch[0];
          } else {
            const anyNum = normalizedData.match(/\d+/);
            if (anyNum) {
              barcodeToDisplay = anyNum[0].slice(0, 14);
            }
          }
        }
      } else {
        const numericMatch = normalizedData.match(/\d{14,16}/);
        if (numericMatch) {
          barcodeToDisplay = numericMatch[0];
        } else {
          const anyNum = normalizedData.match(/\d+/);
          if (anyNum) {
            barcodeToDisplay = anyNum[0].slice(0, 14);
          }
        }
      }

      barcodeToDisplay = String(barcodeToDisplay).trim();

      setScannedCodes(barcodeToDisplay);
      setScannedList((prev) => {
        if (prev.includes(barcodeToDisplay)) return prev;
        return [...prev, barcodeToDisplay];
      });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "code128",
            "code39",
            "code93",
            "codabar",
            "itf14",
            "pdf417",
            "aztec",
            "datamatrix",
          ],
        }}
      >
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.scanGuide} pointerEvents="none">
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          <View style={styles.resultBox} pointerEvents="none">
            {scannedCodes ? (
              <Text style={styles.resultText}>{scannedCodes}</Text>
            ) : null}
          </View>

          <View style={styles.bottomBar} pointerEvents="box-none">
            <View style={styles.counterBox} pointerEvents="none">
              <Text style={styles.counterText}>
                Sayaç: {scannedList.length}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.shareButton}
              activeOpacity={0.7}
              onPress={() => {
                if (scannedList.length === 0) return;
                const products = scannedList.map((barcode) => ({
                  name: "Ürün Adı",
                  barcode: barcode,
                  price: 10,
                  quantity: 1,
                }));
                navigation.navigate("HomeScreen");
              }}
            >
              <Ionicons name="share-social-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  scanGuide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 380,
    height: 540,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#00FF00",
    borderWidth: 5,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  resultBox: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
  },
  resultText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counterBox: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  counterText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default BarcodeReadScreen;
