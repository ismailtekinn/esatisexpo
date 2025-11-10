// import { CameraView,Camera, CameraType, useCameraPermissions } from "expo-camera";
// import { useEffect, useState } from "react";
// import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { Audio } from 'expo-av';

// interface BarcodeScannerProps {
//   onBarcodeScanned: (data: string) => void;
//   onClose: () => void;
// }

// const BarCodeScanResult: React.FC<BarcodeScannerProps> = ({
//   onBarcodeScanned,
//   onClose,
// }) => {
//   const [facing, setFacing] = useState<CameraType>("back");
//   const [permission, requestPermission] = useCameraPermissions();
//   const [lastScanned, setLastScanned] = useState<number | null>(null);
//   const scanCooldown = 3000;

// const playBeep = async () => {
//   const { sound } = await Audio.Sound.createAsync(
//     require('../assets/beepsound.mp3')
//   );
//   await sound.playAsync();
// };

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to use the camera
//         </Text>
//         <Button onPress={requestPermission} title="Grant Permission" />
//       </View>
//     );
//   }

//   const handleBarcodeScanned = async ({
//     data,
//   }: {
//     type: string;
//     data: string;
//   }) => {
//     const now = Date.now();
//     // onBarcodeScanned(data);
//     if (!lastScanned || now - lastScanned > scanCooldown) {
//       setLastScanned(now);
//       playBeep();
//       onBarcodeScanned(data);
//     }
//   };

//   function toggleCameraFacing() {
//     setFacing((current) => (current === "back" ? "front" : "back"));
//   }

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//         <Text style={styles.closeButtonText}>X</Text>
//       </TouchableOpacity>
//       <CameraView
//         style={styles.camera}
//         facing={facing}
//         onBarcodeScanned={handleBarcodeScanned}
//       >
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//             {/* <Text style={styles.text}>Flip Camera</Text> */}
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   message: {
//     textAlign: "center",
//     paddingBottom: 10,
//   },
//   camera: {
//     width: "100%",
//     height: 150,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "transparent",
//     margin: 64,
//   },
//   button: {
//     flex: 1,
//     alignSelf: "flex-end",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
//   closeButton: {
//     position: "absolute",
//     top: -50,
//     right: 5,
//     zIndex: 1,
//     backgroundColor: "red",
//     padding: 8,
//     borderRadius: 10,
//   },
//   closeButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default BarCodeScanResult;

// cloude 1. çözümü
// import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
// import { useEffect, useState, useRef } from "react";
// import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { Audio } from 'expo-av';

// interface BarcodeScannerProps {
//   onBarcodeScanned: (data: string) => void;
//   onClose: () => void;
// }

// const BarCodeScanResult: React.FC<BarcodeScannerProps> = ({
//   onBarcodeScanned,
//   onClose,
// }) => {
//   const [facing, setFacing] = useState<CameraType>("back");
//   const [permission, requestPermission] = useCameraPermissions();
//   const [lastScanned, setLastScanned] = useState<number | null>(null);
//   const scanCooldown = 3000;

//   // Çoklu okuma doğrulaması için
//   const scanBuffer = useRef<Map<string, number>>(new Map());
//   const requiredScans = 3; // Aynı barkodun kaç kez okunması gerektiği
//   const bufferTimeout = 1000; // Buffer temizleme süresi (ms)

//   const playBeep = async () => {
//     const { sound } = await Audio.Sound.createAsync(
//       require('../assets/beepsound.mp3')
//     );
//     await sound.playAsync();
//   };

//   // Buffer temizleme
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       scanBuffer.current.forEach((timestamp, code) => {
//         if (now - timestamp > bufferTimeout) {
//           scanBuffer.current.delete(code);
//         }
//       });
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to use the camera
//         </Text>
//         <Button onPress={requestPermission} title="Grant Permission" />
//       </View>
//     );
//   }

//   const handleBarcodeScanned = async ({
//     data,
//   }: {
//     type: string;
//     data: string;
//   }) => {
//     const now = Date.now();

//     // Cooldown kontrolü
//     if (lastScanned && now - lastScanned < scanCooldown) {
//       return;
//     }

//     // Geçersiz veya çok kısa barkodları filtrele
//     if (!data || data.trim().length < 3) {
//       return;
//     }

//     // Aynı barkodun birden fazla kez okunmasını bekle
//     const currentCount = scanBuffer.current.get(data) || 0;
//     scanBuffer.current.set(data, now);

//     // İlk okuma
//     if (currentCount === 0) {
//       scanBuffer.current.set(data, now);
//       return;
//     }

//     // İkinci okuma - doğrulama
//     if (now - currentCount < bufferTimeout) {
//       setLastScanned(now);
//       scanBuffer.current.clear(); // Buffer'ı temizle
//       await playBeep();
//       onBarcodeScanned(data);
//     }
//   };

//   function toggleCameraFacing() {
//     setFacing((current) => (current === "back" ? "front" : "back"));
//   }

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//         <Text style={styles.closeButtonText}>X</Text>
//       </TouchableOpacity>
//       <CameraView
//         style={styles.camera}
//         facing={facing}
//         onBarcodeScanned={handleBarcodeScanned}
//         barcodeScannerSettings={{
//           barcodeTypes: [
//             "ean13",
//             "ean8",
//             "upc_a",
//             "upc_e",
//             "code128",
//             "code39",
//             "qr"
//           ],
//         }}
//       >
//         <View style={styles.buttonContainer}>
//           <View style={styles.scanGuide}>
//             <View style={styles.scanFrame} />
//             <Text style={styles.scanText}>Barkodu çerçeve içine yerleştirin</Text>
//           </View>
//           <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//             {/* <Text style={styles.text}>Flip Camera</Text> */}
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   message: {
//     textAlign: "center",
//     paddingBottom: 10,
//   },
//   camera: {
//     width: "100%",
//     height: 150,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   buttonContainer: {
//     flex: 1,
//     backgroundColor: "transparent",
//     margin: 64,
//   },
//   button: {
//     flex: 1,
//     alignSelf: "flex-end",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
//   closeButton: {
//     position: "absolute",
//     top: -50,
//     right: 5,
//     zIndex: 1,
//     backgroundColor: "red",
//     padding: 8,
//     borderRadius: 10,
//   },
//   closeButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   scanGuide: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   scanFrame: {
//     width: 250,
//     height: 100,
//     borderWidth: 2,
//     borderColor: "white",
//     borderRadius: 8,
//     backgroundColor: "transparent",
//   },
//   scanText: {
//     color: "white",
//     marginTop: 10,
//     fontSize: 14,
//     textAlign: "center",
//   },
// });

// export default BarCodeScanResult;

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Audio } from "expo-av";

interface BarcodeScannerProps {
  onBarcodeScanned: (data: string) => void;
  onClose: () => void;
}

const BarCodeScanResult: React.FC<BarcodeScannerProps> = ({
  onBarcodeScanned,
  onClose,
}) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [lastScanned, setLastScanned] = useState<number | null>(null);
  const scanCooldown = 3000;

  // Çoklu okuma doğrulaması için
  const scanBuffer = useRef<Map<string, { count: number; timestamp: number }>>(
    new Map()
  );
  const requiredScans = 2; // QR ve barkod için 2 okuma yeterli
  const bufferTimeout = 1500; // Buffer temizleme süresi (ms)

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

  // EAN13 checksum doğrulama
  const validateEAN13 = (code: string): boolean => {
    if (code.length !== 13) return false;
    if (!/^\d+$/.test(code)) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(code[i]);
      sum += i % 2 === 0 ? digit : digit * 3;
    }
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(code[12]);
  };

  // EAN8 checksum doğrulama
  const validateEAN8 = (code: string): boolean => {
    if (code.length !== 8) return false;
    if (!/^\d+$/.test(code)) return false;

    let sum = 0;
    for (let i = 0; i < 7; i++) {
      const digit = parseInt(code[i]);
      sum += i % 2 === 0 ? digit * 3 : digit;
    }
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(code[7]);
  };

  // UPC-A checksum doğrulama
  const validateUPCA = (code: string): boolean => {
    if (code.length !== 12) return false;
    if (!/^\d+$/.test(code)) return false;

    let sum = 0;
    for (let i = 0; i < 11; i++) {
      const digit = parseInt(code[i]);
      sum += i % 2 === 0 ? digit * 3 : digit;
    }
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(code[11]);
  };

  // Code128 için basit format kontrolü
  const validateCode128 = (code: string): boolean => {
    if (code.length < 6) return false;
    return /^[\x20-\x7E]+$/.test(code);
  };

  // QR kod doğrulama - daha esnek
  const validateQR = (code: string): boolean => {
    if (!code || code.length < 1) return false;
    if (code.length > 4296) return false; // QR kod max boyut
    if (code.trim().length === 0) return false;
    return true;
  };

  // Genel barkod doğrulama
  const validateBarcode = (code: string, type?: string): boolean => {
    console.log("Tarama - Tip:", type, "Veri:", code, "Uzunluk:", code.length);

    // Boş veri kontrolü
    if (!code || code.trim().length === 0) {
      console.log("❌ Boş veri reddedildi");
      return false;
    }

    // QR kod kontrolü - birden fazla format olabilir
    const typeStr = (type || "").toLowerCase();
    const isQR = typeStr.includes("qr") || 
                 type === "256" || 
                 type === "org.iso.QRCode" ||
                 typeStr === "qrcode";

    if (isQR) {
      console.log("✅ QR kod algılandı");
      return validateQR(code);
    }

    // Çok kısa veriler QR olabilir, checksum kontrolü yapma
    if (code.length < 6) {
      console.log("✅ Kısa veri (QR olabilir)");
      return true;
    }

    // Sadece barkodlar için tekrar eden karakter kontrolü
    if (/^(.)\1+$/.test(code) && code.length < 20) {
      console.log("❌ Tekrar eden karakter deseni");
      return false;
    }

    // Barkod tipine göre doğrulama
    if (code.length === 13 && /^\d+$/.test(code)) {
      const valid = validateEAN13(code);
      console.log(valid ? "✅ EAN13 geçerli" : "❌ EAN13 geçersiz");
      return valid;
    }
    
    if (code.length === 8 && /^\d+$/.test(code)) {
      const valid = validateEAN8(code);
      console.log(valid ? "✅ EAN8 geçerli" : "❌ EAN8 geçersiz");
      return valid;
    }
    
    if (code.length === 12 && /^\d+$/.test(code)) {
      const valid = validateUPCA(code);
      console.log(valid ? "✅ UPC-A geçerli" : "❌ UPC-A geçersiz");
      return valid;
    }
    
    if (typeStr.includes("code128")) {
      const valid = validateCode128(code);
      console.log(valid ? "✅ Code128 geçerli" : "❌ Code128 geçersiz");
      return valid;
    }

    // Diğer formatlar için esnek kabul et
    console.log("✅ Genel format kabul edildi");
    return true;
  };

  // Buffer temizleme
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

  if (!permission) {
    return <View />;
  }

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

    console.log("📷 Tarama algılandı - Tip:", type, "Veri:", data);

    // Cooldown kontrolü
    if (lastScanned && now - lastScanned < scanCooldown) {
      console.log("⏳ Cooldown aktif");
      return;
    }

    // Trim ve normalizasyon
    const normalizedData = data.trim();

    // Barkod doğrulama
    if (!validateBarcode(normalizedData, type)) {
      console.log("❌ Kod doğrulanamadı");
      return;
    }

    // Buffer kontrolü ve sayma
    const existing = scanBuffer.current.get(normalizedData);

    if (!existing) {
      scanBuffer.current.set(normalizedData, { count: 1, timestamp: now });
      console.log("1️⃣ İlk okuma kaydedildi");
      return;
    }

    // Zaman aşımı kontrolü
    if (now - existing.timestamp > bufferTimeout) {
      scanBuffer.current.set(normalizedData, { count: 1, timestamp: now });
      console.log("🔄 Zaman aşımı, okuma sıfırlandı");
      return;
    }

    // Sayacı artır
    const newCount = existing.count + 1;
    scanBuffer.current.set(normalizedData, {
      count: newCount,
      timestamp: existing.timestamp,
    });

    console.log(`📊 Okuma sayısı: ${newCount}/${requiredScans}`);

    // Yeterli okuma sayısına ulaşıldı mı?
    if (newCount >= requiredScans) {
      setLastScanned(now);
      scanBuffer.current.clear();
      await playBeep();
      onBarcodeScanned(normalizedData);
      console.log("✅ Kod başarıyla okundu:", normalizedData);
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
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
            "datamatrix"
          ],
        }}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.scanGuide}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scanText}>
              Barkod veya QR kodun tamamını çerçeve içine yerleştirin
            </Text>
            <Text style={styles.scanSubtext}>
              Kod net görünene kadar bekleyin
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            {/* <Text style={styles.text}>Flip Camera</Text> */}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    zIndex: 9999,
  },
  camera: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    position: "absolute",
    top: -50,
    right: 5,
    zIndex: 1,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  scanGuide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 280,
    height: 140,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#00FF00",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanText: {
    color: "white",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  scanSubtext: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
    opacity: 0.8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default BarCodeScanResult;