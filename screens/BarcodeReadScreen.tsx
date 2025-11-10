import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Audio } from "expo-av";

const BarcodeReadScreen: React.FC = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [lastScanned, setLastScanned] = useState<number | null>(null);
  const scanCooldown = 3000;

  const [scannedCodes, setScannedCodes] = useState<string>("");

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
      setScannedCodes(normalizedData);
      console.log("✅ Kod başarıyla okundu:", normalizedData);
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

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
        <View style={styles.scanGuide}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          {/* Barkod sonucu kamera üzerinde minimal kutuda */}
        </View>
      </CameraView>
      <View style={styles.resultBox}>
        {scannedCodes ? (
          <Text style={styles.resultText}>{scannedCodes}</Text>
        ) : null}
      </View>
      <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
        <Text style={styles.text}>Flip Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //  flex: 1,
    zIndex: 9999,
  },
  message: { textAlign: "center", paddingBottom: 10, zIndex: 9999 },
  camera: { width: "100%", height: "100%" },
  button: { position: "absolute", bottom: 20, right: 20, padding: 10 },
  text: { fontSize: 18, fontWeight: "bold", color: "white" },
  scanGuide: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: { width: 380, height: 540, position: "relative", marginTop: 30 },
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
    bottom: 70, // Alt kenardan biraz yukarı
    left: 0,
    right: 0, // Tam genişlik için
    height: 100, // Sabit yükseklik
    backgroundColor: "rgba(0,0,0,0.5)", // Hafif siyah şeffaf
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BarcodeReadScreen;
