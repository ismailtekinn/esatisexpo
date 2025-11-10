import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  Keyboard,
} from "react-native";
import { useSales } from "../contex/SalesContext";
import { IndirimTipi } from "../types/enums/tria";
import AlertModal from "./AlertModal";
import { useSalesCancel } from "../contex/salesCancelContext";
export type ActionType =
  | "edit"
  | "delete"
  | "etiket"
  | "isconto"
  | "totalCount";

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  type: ActionType;
  data?: any;
  onConfirm?: (data: { type: ActionType; value?: any }) => void;
  // onDelete?: () => void;
  onDelete?: (itemId: number) => void;
}
interface IscontoForm {
  // iscontoType: "Yüzdesel" | "Tutarsal" | "Alınacak Tutar";
  inputValue: string;
  iscontoOran: number;
  iscontoTutar: number;
  urunTutar: number;
}
const { width: screenWidth } = Dimensions.get("window");

const ActionModal: React.FC<ActionModalProps> = ({
  visible,
  onClose,
  type,
  data,
  onConfirm,
  onDelete,
}) => {
  const { selectedSale, setSelectedSales, summary, setSummary } = useSales();
  // const { isCancelled, setIsCancelled } = useSalesCancel();
  const { isItemCancelled, toggleCancelled } = useSalesCancel();

  const initialCount = data?.initialCount ?? 1;

  const katilimPayi = data?.price ?? 1;
  const [count, setCount] = useState<number>(initialCount);
  const [inputIscontoValue, setIscontoInputValue] = useState<string>("");

  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedIscontoType, setSelectedIscontoType] = useState("Yüzdesel"); // varsayılan seçenek
  const dropdownOptions = ["Yüzdesel", "Tutarsal", "Alınacak Tutar"];

  const {
    isDiscountApplied,
    setIsDiscountApplied,
    isIscontoApplied,
    setIscontoApplied,
  } = useSalesCancel();

  const handleConfirm = () => {
    if (count <= 0) {
      setAlertMessage("Adet miktarı 0 ve altında olamaz");
      setAlertModalVisible(true);
      return;
    }
    const updated = selectedSale.map((p) =>
      p.Index === data.itemId
        ? {
            ...p,
            Stock: count,
            Tutar: count * (p.Price ?? 0), // yeni tutarı hesapla
          }
        : p
    );

    setSelectedSales(updated);
    onClose();
  };

  const [iscontoForm, setIscontoForm] = useState<IscontoForm>({
    inputValue: "",
    iscontoOran: 0,
    iscontoTutar: 0,
    urunTutar: 0,
  });
  const resetForm = () => {
    setCount(initialCount);
    setIscontoInputValue("");
    setSelectedIscontoType("Yüzdesel");
    setIscontoForm({
      inputValue: "",
      iscontoOran: 0,
      iscontoTutar: 0,
      urunTutar: 0,
    });
  };

  const handleTutarConfirm = () => {
    onClose();
    setSummary((prev) => ({
      ...prev,
      UrunTutar: katilimPayi - iscontoForm.iscontoTutar,
      IndOran: iscontoForm.iscontoOran,
      IndFlag:
        selectedIscontoType === "Yüzdesel"
          ? IndirimTipi.YuzdeIndirim
          : selectedIscontoType === "Tutarsal"
          ? IndirimTipi.TutarIndirimi
          : IndirimTipi.OtoYuzdeIndirim,
      Isconto:
        selectedIscontoType === "Yüzdesel"
          ? `% ${iscontoForm.iscontoOran}  ind.`
          : selectedIscontoType === "Tutarsal"
          ? `% ${iscontoForm.iscontoOran} tutar ind.`
          : iscontoForm.inputValue,
      IndTutar: iscontoForm.iscontoTutar,
    }));
    resetForm();
  };

  const applyToggleCancelAndTotals = (itemId: number) => {
    // 1) İlgili ürünü bul
    const item = selectedSale.find((p) => p.Index === itemId);
    if (!item) return;

    // 2) Satır etkisi: (ürün içi ind. varsa düş)
    const lineBase = (item.Price || 0) * (item.Stock || 0);
    const lineEffect = lineBase - (item.IndTutar || 0);

    // 3) Şu anki iptal durumu ve sonraki durum
    const currentlyCancelled = isItemCancelled(itemId);
    const willBeCancelled = !currentlyCancelled;

    // 4) İptal durumunu değiştir
    toggleCancelled(itemId);

    // 5) Özetleri delta ile güncelle
    setSummary((prev) => {
      const newTotalPrice = willBeCancelled
        ? prev.totalPrice - lineEffect // iptal -> düş
        : prev.totalPrice + lineEffect; // geri al -> ekle

      const indTutar = prev.IndTutar || 0;
      const newUrunTutar = Math.max(0, newTotalPrice - indTutar);

      return {
        ...prev,
        totalPrice: newTotalPrice,
        UrunTutar: indTutar > 0 ? newUrunTutar : newTotalPrice,
      };
    });
  };
  const handleDipIscontoCancel = () => {
    onClose();
    setIsDiscountApplied(false);
    setSummary((prev) => ({
      ...prev,
      UrunTutar: prev.totalPrice, // indirim uygulanmış toplam
      IndTutar: 0,
      IndOran: 0,
      IndFlag: undefined,
      Isconto: undefined,
    }));
  };

  const handleIscontoCancel = () => {
    onClose();
    setIscontoApplied(false);
    const updated = selectedSale.map((p) =>
      p.Index === data.itemId
        ? {
            ...p,
            Isconto: undefined,
            IndFlag: undefined,
            IndOran: 0,
            IndTutar: 0,
          }
        : p
    );
    setSelectedSales(updated);
    const newTotalPrice = updated.reduce((sum, item) => {
      const itemPrice = (item.Price || 0) * (item.Stock || 1);
      return sum + itemPrice;
    }, 0);
    setSummary((prev) => ({
      ...prev,
      totalPrice: newTotalPrice,
    }));
  };

  const handleIscontoConfirm = () => {
    const value = parseFloat(iscontoForm.inputValue);
    // Boş veya NaN kontrolü
    if (!iscontoForm.inputValue || isNaN(value)) {
      setAlertMessage("İndirim değeri boş olamaz");
      setAlertModalVisible(true);
      resetForm();
      return;
    }

    // Negatif veya sıfır kontrolü
    if (value <= 0) {
      setAlertMessage("İndirim tutar 0 veya negatif olamaz.");
      setAlertModalVisible(true);
      resetForm();
      return;
    }

    if (selectedIscontoType === "Yüzdesel" && value >= 100) {
      setAlertMessage("İndirim miktarı %100 ve üzerinde olamaz");
      setAlertModalVisible(true);
      resetForm();
      return;
    }
    if (selectedIscontoType === "Tutarsal" && value >= katilimPayi) {
      setAlertMessage("İndirim miktarı tutara eşit ve üzerinde olamaz");
      setAlertModalVisible(true);
      resetForm();
      return;
    }
    // Tüm kontroller geçerse işlemleri yap
    const updated = selectedSale.map((p) =>
      p.Index === data.itemId
        ? {
            ...p,
            Isconto:
              selectedIscontoType === "Yüzdesel"
                ? `% ${iscontoForm.inputValue}  ind.`
                : selectedIscontoType === "Tutarsal"
                ? `% ${iscontoForm.inputValue} tutar ind.`
                : iscontoForm.inputValue,
            IndFlag:
              selectedIscontoType === "Yüzdesel"
                ? IndirimTipi.YuzdeIndirim
                : selectedIscontoType === "Tutarsal"
                ? IndirimTipi.TutarIndirimi
                : IndirimTipi.OtoYuzdeIndirim,
            IndOran: iscontoForm.iscontoOran,
            IndTutar: iscontoForm.iscontoTutar,
          }
        : p
    );

    setSelectedSales(updated);

    const newTotalPrice = updated.reduce((sum, item) => {
      const itemPrice = (item.Price || 0) * (item.Stock || 1);
      const discounted = item.IndTutar ? itemPrice - item.IndTutar : itemPrice;
      return sum + discounted;
    }, 0);

    setSummary((prev) => ({
      ...prev,
      totalPrice: newTotalPrice,
    }));
    onClose();
    resetForm();
  };
  useEffect(() => {
    const numericValue = parseFloat(iscontoForm.inputValue) || 0;
    let iscontoTutar = 0;
    let urunTutar = katilimPayi;
    let iscontOranı = 0;

    if (selectedIscontoType === "Yüzdesel") {
      urunTutar = katilimPayi * (1 - numericValue / 100); // yeni fiyat
      iscontoTutar = katilimPayi - urunTutar; // fark
      iscontOranı = numericValue;
    } else if (selectedIscontoType === "Tutarsal") {
      urunTutar = katilimPayi - numericValue; // yeni fiyat
      iscontoTutar = numericValue; // indirim tutarı
      iscontOranı = Math.ceil((numericValue / katilimPayi) * 100);
    } else if (selectedIscontoType === "totalCount") {
      urunTutar = katilimPayi - numericValue; // yeni fiyat
      iscontoTutar = numericValue; // indirim tutarı
      iscontOranı = Math.ceil((numericValue / katilimPayi) * 100);
    } else if (selectedIscontoType === "Alınacak Tutar") {
      urunTutar = numericValue; // yeni fiyat
      iscontOranı = iscontOranı = Math.ceil(
        Math.abs((numericValue - katilimPayi) / katilimPayi) * 100
      );
      iscontoTutar = katilimPayi - numericValue; // fark
    }

    setIscontoForm((prev) => ({
      ...prev,
      // iscontoOran: numericValue,
      iscontoOran: parseFloat(iscontOranı.toFixed(2)),
      iscontoTutar: iscontoTutar,
      urunTutar: parseFloat(urunTutar.toFixed(2)),
    }));
  }, [iscontoForm.inputValue, selectedIscontoType, katilimPayi]);

  const renderContent = () => {
    switch (type) {
      case "edit":
        return (
          <View style={styles.caseContainer}>
            <Text style={styles.modalTitle}>Ürün Adedi Düzenle</Text>
            <Text style={styles.initialCountText}>
              Başlangıç: {initialCount}
            </Text>
            <View style={styles.editContainer}>
              <TouchableOpacity
                style={[styles.editButton, styles.editButtonMinus]}
                onPress={() => setCount((c) => Math.max(0, c - 1))}
              >
                <Text style={styles.editButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.editNumber}
                value={String(count)}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCount(Number(numericValue) || 0);
                }}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.editButton, styles.editButtonPlus]}
                onPress={() => setCount((c) => c + 1)}
              >
                <Text style={styles.editButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancel]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirm]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case "delete":
        return (
          <View style={styles.caseContainer}>
            <Text style={styles.modalTitle}>
              {data?.isCancelled ? "Silme İşlemini Geri Al" : "Öğeyi Sil"}
            </Text>

            <Text style={styles.text}>
              {data?.isCancelled
                ? "Bu öğeyi geri almak istiyor musunuz?"
                : "Bu öğeyi silmek istiyor musunuz?"}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancel]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirm]}
                onPress={() => {
                  const id = data?.itemId;
                  if (typeof id === "number") {
                    // onDelete?.(id);
                    // toggleCancelled(id);
                    applyToggleCancelAndTotals(id);
                  }

                  onClose();
                }}
              >
                <Text style={styles.buttonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "etiket":
        return (
          <View style={styles.caseContainer}>
            <Text style={styles.modalTitle}>Etiket Ekle</Text>
            <Text style={styles.text}>
              Bu öğeye etiket eklemek istiyor musunuz?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancel]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirm]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case "isconto":
        return (
          <View style={styles.caseContainer}>
            {/* Başlık */}
            <Text style={styles.iscontoBaslik}>KATILIM PAYI</Text>
            {data?.indirimTutar > 0 && (
              <View style={styles.iscontoCancelContainer}>
                <Text style={styles.iscontoCancelText}>
                  Önceki İskonto : {data.indirimTutar.toFixed(2)} TL • %
                  {data.indirimOran && isFinite(data.indirimOran)
                    ? data.indirimOran
                    : 0}
                </Text>
                <TouchableOpacity
                  style={styles.iscontoCancelButton}
                  onPress={handleIscontoCancel}
                >
                  <Text style={styles.iscontoCancelButtonText}>İptal</Text>
                </TouchableOpacity>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              {dropdownOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={{
                    flex: 1,
                    marginHorizontal: 5,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor:
                      selectedIscontoType === opt ? "#4da6ff" : "#eee",
                    alignItems: "center",
                  }}
                  onPress={() => setSelectedIscontoType(opt)}
                >
                  <Text
                    style={{
                      color: selectedIscontoType === opt ? "#fff" : "#333",
                      fontWeight: "600",
                    }}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.iscontoTutarAna}>{katilimPayi} TL</Text>
            <View style={styles.iscontoSatir}>
              <Text style={styles.iscontoEtiket}>İskonto Tipi</Text>
              <Text style={styles.iscontoDropdownText}>
                {selectedIscontoType}
              </Text>
            </View>

            {/* Değer Girişi */}
            <View style={styles.iscontoSatir}>
              <Text style={styles.iscontoEtiket}>Değer</Text>
              <TextInput
                style={styles.iscontoInput}
                placeholder="0.00"
                placeholderTextColor="#888"
                value={iscontoForm.inputValue}
                onChangeText={(text) => {
                  const cleanText = text.replace(/[^0-9.]/g, "");
                  setIscontoForm((prev) => ({
                    ...prev,
                    inputValue: cleanText,
                  }));
                }}
                keyboardType="numeric"
              />
            </View>
            {/* Hesaplanan */}
            <Text style={styles.iscontoHesaplananBaslik}>Hesaplanan</Text>
            <View style={styles.iscontoOzetteSatir}>
              <Text style={styles.iscontoEtiket}>İsk. Oran</Text>
              <Text style={styles.iscontoSariDeger}>
                % {iscontoForm.iscontoOran}
              </Text>
            </View>
            <View style={styles.iscontoOzetteSatir}>
              <Text style={styles.iscontoEtiket}>İsk. Tutar</Text>
              <Text style={styles.iscontoSariDeger}>
                {iscontoForm.iscontoTutar.toFixed(2)} TL
              </Text>
            </View>
            <View style={styles.iscontoOzetteSatir}>
              <Text style={styles.iscontoEtiket}>Ürün Tutar</Text>
              <Text style={styles.iscontoYesilDeger}>
                {iscontoForm.urunTutar} TL
              </Text>
            </View>

            {/* Butonlar */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancel]}
                onPress={() => {
                  resetForm(); // 2. işlem
                  onClose(); // 1. işlem
                }}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirm]}
                onPress={() => {
                  Keyboard.dismiss(); // klavyeyi kapatır
                  handleIscontoConfirm(); // senin fonksiyonun
                  setIscontoApplied(true);
                }}
              >
                <Text style={styles.buttonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case "totalCount":
        return (
          <View style={styles.caseContainer}>
            {/* Başlık */}
            <Text style={styles.iscontoBaslik}>Dip İskonto</Text>
            {(summary?.IndTutar ?? 0) > 0 && (
              <View style={styles.iscontoCancelContainer}>
                <Text style={styles.iscontoCancelText}>
                  Önceki İskonto : {(summary?.IndTutar ?? 0).toFixed(2)} TL • %
                  {summary?.IndOran && isFinite(summary?.IndOran)
                    ? summary.IndOran
                    : 0}
                </Text>
                <TouchableOpacity
                  style={styles.iscontoCancelButton}
                  onPress={handleDipIscontoCancel}
                >
                  <Text style={styles.iscontoCancelButtonText}>İptal</Text>
                </TouchableOpacity>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              {dropdownOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={{
                    flex: 1,
                    marginHorizontal: 5,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor:
                      selectedIscontoType === opt ? "#4da6ff" : "#eee",
                    alignItems: "center",
                  }}
                  onPress={() => setSelectedIscontoType(opt)}
                >
                  <Text
                    style={{
                      color: selectedIscontoType === opt ? "#fff" : "#333",
                      fontWeight: "600",
                    }}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* TUTAR BURDA CONSOLE YAZDIRILIYOR:  */}
            <Text style={styles.iscontoTutarAna}>{katilimPayi} TL</Text>

            <View style={styles.iscontoSatir}>
              <Text style={styles.iscontoEtiket}>İskonto Tipi</Text>
              <Text style={styles.iscontoDropdownText}>
                {selectedIscontoType}
              </Text>
            </View>

            {/* Değer Girişi */}
            <View style={styles.iscontoSatir}>
              <Text style={styles.iscontoEtiket}>Değer</Text>
              <TextInput
                style={styles.iscontoInput}
                placeholder="0.00"
                placeholderTextColor="#888"
                value={iscontoForm.inputValue}
                onChangeText={(text) => {
                  const cleanText = text.replace(/[^0-9.]/g, "");
                  setIscontoForm((prev) => ({
                    ...prev,
                    inputValue: cleanText,
                  }));
                }}
                keyboardType="numeric"
              />
            </View>
            {/* Hesaplanan */}
            <Text style={styles.iscontoHesaplananBaslik}>Hesaplanan</Text>
            <View style={styles.iscontoOzetteSatir}>
              <Text style={styles.iscontoEtiket}>İsk. Oran</Text>
              <Text style={styles.iscontoSariDeger}>
                % {iscontoForm.iscontoOran}
              </Text>
            </View>
            <View style={styles.iscontoOzetteSatir}>
              <Text style={styles.iscontoEtiket}>İsk. Tutar</Text>
              <Text style={styles.iscontoSariDeger}>
                {iscontoForm.iscontoTutar.toFixed(2)} TL
              </Text>
            </View>
            <View style={styles.iscontoOzetteSatir}>
              <Text style={styles.iscontoEtiket}>Ürün Tutar</Text>
              <Text style={styles.iscontoYesilDeger}>
                {iscontoForm.urunTutar} TL
              </Text>
            </View>

            {/* Butonlar */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancel]}
                onPress={() => {
                  resetForm(); // 2. işlem
                  Keyboard.dismiss();
                  onClose(); // 1. işlem
                }}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirm]}
                onPress={() => {
                  // if ((summary?.IndTutar ?? 0) === 0) {
                  //   setAlertMessage("Tutar değeri 0 iken işlem yapamazsınız.");
                  //   setAlertModalVisible(true);
                  //   return; // ❌
                  // }

                  Keyboard.dismiss();
                  handleTutarConfirm();
                  setIsDiscountApplied(true);
                }}
              >
                <Text style={styles.buttonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {renderContent()}

        <AlertModal
          visible={alertModalVisible}
          message={alertMessage}
          onClose={() => setAlertModalVisible(false)}
        />
      </View>
    </Modal>
  );
};

export default ActionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  caseContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancel: { backgroundColor: "#ff4d4d" },
  confirm: { backgroundColor: "#4da6ff" },
  buttonText: { color: "#fff", fontWeight: "bold" },

  // Edit
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  initialCountText: { fontSize: 14, color: "#888", marginBottom: 10 },
  editButton: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    backgroundColor: "black",
  },
  editButtonMinus: { backgroundColor: "#ff4d4d" },
  editButtonPlus: { backgroundColor: "#4da6ff" },
  editButtonText: { fontSize: 30, color: "#fff", fontWeight: "bold" },
  editNumber: { fontSize: 20, marginHorizontal: 20, fontWeight: "500" },

  iscontoBaslik: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  iscontoTutarAna: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
    color: "#64dd17",
  },

  iscontoSatir: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },

  iscontoEtiket: { fontSize: 16, color: "#333" },
  iscontoDropdown: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  iscontoDropdownText: { fontSize: 16, color: "#333" },

  iscontoInput: {
    width: 100,
    height: 50, // yüksekliği artır
    fontSize: 18, // yazı boyutunu artır
    paddingHorizontal: 12, // iç boşluk artır
    // height: 36,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    textAlign: "right",
  },

  iscontoHesaplananBaslik: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 12,
    textAlign: "center",
  },

  iscontoOzetteSatir: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 6,
  },

  iscontoSariDeger: { fontSize: 16, fontWeight: "700", color: "#ffd54f" },
  iscontoYesilDeger: { fontSize: 16, fontWeight: "700", color: "#64dd17" },

  // iskontoDropdown ayarları

  dropdown: {
    position: "absolute",
    top: 45,
    right: 0,
    width: 150,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },

  // add these styles to your existing StyleSheet
  iscontoCancelContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff8e1",
    borderWidth: 1,
    borderColor: "#ffecb3",
    marginBottom: 12,
  },

  iscontoCancelText: {
    flex: 1,
    fontSize: 14,
    color: "#a16207", // koyu sarı/kahve ton
    fontWeight: "600",
    marginRight: 10,
  },

  iscontoCancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },

  iscontoCancelButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
