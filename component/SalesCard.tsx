import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { SaleItem } from "../types/saleType";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import SalesCardDetayModal, { ActionType } from "./SalesCardDetayModal";
import { useSales } from "../contex/SalesContext";
import { useSalesCancel } from "../contex/salesCancelContext";
import { useAlert } from "../contex/AlertContext";
type Props = {
  product: SaleItem;
  onPress?: () => void;
  orderNumber: number;
  onCountChange?: (itemIndex: number, newCount: number) => void;
  isSelected?: boolean;
  onDelete?: (barcode: number) => void;
};
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const baseWidth = 375;
const baseHeight = 812;
const scale = screenWidth / baseWidth;
const vScale = screenHeight / baseHeight;
const fs = (size: number) => Math.max(9, Math.round(size * scale)); // font-size
const vs = (size: number) => Math.max(8, Math.round(size * vScale)); // vertical spacing
const hs = (size: number) => Math.max(6, Math.round(size * scale)); // horizontal spacing

const SalesCard: React.FC<Props> = ({
  product,
  onPress,
  orderNumber,
  isSelected,
}) => {
  // const { isCancelled: isItemCancelled, setIsCancelled } = useSalesCancel();

  const { isItemCancelled, toggleCancelled } = useSalesCancel();
  const cancelled = isItemCancelled(product.Index);
  const total = (product.Stock ?? 0) * (product.Price ?? 0);
  const isSmall = screenWidth < 360; // küçük telefonlar
  const isLarge = screenWidth > 420; // büyük telefonlar
  const swipeableRef = useRef<Swipeable>(null);
  const [modalType, setModalType] = React.useState<ActionType | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const { selectedSale, setSelectedSales } = useSales();
  const {
    alertModalVisible,
    setAlertModalVisible,
    alertMessage,
    setAlertMessage,
  } = useAlert();

  const [selectedItemBarcode, setSelectedItemBarcode] = useState<string | null>(
    null
  );
  const { isDiscountApplied, setIsDiscountApplied } = useSalesCancel();

  const [modalData, setModalData] = useState<{
    type: ActionType;
    data?: any;
  } | null>(null);

  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      {/* Etiket ile ilgili düzenleme butonu */}
      <Pressable
        style={({ pressed }) => [
          styles.actionButton,
          styles.editButton,
          pressed && styles.buttonPressed,
          { backgroundColor: cancelled ? "#ccc" : "#4CAF50" }, // pasif ise gri
        ]}
        disabled={cancelled}
        onPress={() => {
          if (isDiscountApplied) {
            Alert.alert(
              "Uyarı",
              "Dip isconto yapıldıktan sonra ürünler üzerinde değişiklik yapılamaz."
            );
            return; // burda return diyerek devamını engelle
          } else {
            setModalType("etiket");
            setModalVisible(true);
          }
        }}
        android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: false }}
      >
        <Ionicons
          name="pricetag"
          size={30}
          color={cancelled ? "#888" : "#fff"}
        />
      </Pressable>
      {/* İsconto ile ilgili düzenleme butonu */}

      <Pressable
        style={({ pressed }) => [
          styles.actionButton,
          styles.editButton,
          pressed && styles.buttonPressed,
          { backgroundColor: cancelled ? "#ccc" : "#FFB74D" },
        ]}
        disabled={cancelled}
        onPress={() => {
          if (isDiscountApplied) {
            Alert.alert(
              "Uyarı",
              "Dip isconto yapıldıktan sonra ürünler üzerinde değişiklik yapılamaz."
            );
            return; // burda return diyerek devamını engelle
          } else {
            setModalType("isconto");
            setModalData({
              type: "isconto",
              data: {
                itemId: product.Index,
                price: product.Price,
                currentIsconto: product.Isconto ?? "",
              },
            });
            setModalVisible(true);
          }
          // if (!isItemCancelled) {
          //   setModalType("isconto");
          //   setModalData({
          //     type: "isconto",
          //     data: {
          //       itemId: product.Index,
          //       price: product.Price,
          //       currentIsconto: product.Isconto ?? "",
          //     },
          //   });
          //   setModalVisible(true);
          // }
        }}
        android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: false }}
      >
        <MaterialIcons
          name="percent"
          size={30}
          color={cancelled ? "#888" : "#fff"}
        />
      </Pressable>

      {/* Edit düzenleme butonu */}

      <Pressable
        style={({ pressed }) => [
          styles.actionButton,
          styles.editButton,
          pressed && styles.buttonPressed,
          { backgroundColor: cancelled ? "#ccc" : "#2196F3" },
        ]}
        disabled={cancelled}
        onPress={() => {
          if (isDiscountApplied) {
            Alert.alert(
              "Uyarı",
              "Dip isconto yapıldıktan sonra ürünler üzerinde değişiklik yapılamaz."
            );
            return; // burda return diyerek devamını engelle
          } else {
            setModalType("edit");
            setModalData({
              type: "edit",
              data: { itemId: product.Index, initialCount: product.Stock },
            });
            setSelectedSales(
              selectedSale.map((p) =>
                p.Barcode === product.Barcode ? new SaleItem({ ...p }) : p
              )
            );
            setModalVisible(true);
          }
          // if (!isItemCancelled) {
          //   setModalType("edit");
          //   setModalData({
          //     type: "edit",
          //     data: { itemId: product.Index, initialCount: product.Stock },
          //   });
          //   setSelectedSales(
          //     selectedSale.map((p) =>
          //       p.Barcode === product.Barcode ? new SaleItemDeneme({ ...p }) : p
          //     )
          //   );
          //   setModalVisible(true);
          // }
        }}
        android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: false }}
      >
        <Ionicons
          name="create-outline"
          size={30}
          color={cancelled ? "#888" : "#fff"}
        />
      </Pressable>

      {/* Delete butonu her zaman aktif */}
      <Pressable
        style={({ pressed }) => [
          styles.actionButton,
          styles.deleteButton,
          pressed && styles.buttonPressed,
          { backgroundColor: "#FF3B30" },
        ]}
        onPress={() => {
          if (isDiscountApplied) {
            setAlertMessage(
              "Dip iskonto yapıldıktan sonra ürün iptali yapamazsını.Ürün iptali yapabilmek için lütfen dip isconto işlemini iptal edin."
            );
            setAlertModalVisible(true);
            return;
          }
          setModalType("delete");
          setModalData({
            type: "delete",
            data: {
              itemId: product.Index,
              initialCount: product.Stock,
              isCancelled: isItemCancelled,
            },
          });
          setModalVisible(true);
        }}
        android_ripple={{ color: "rgba(28, 11, 11, 0.2)", borderless: false }}
      >
        <MaterialIcons name="delete" size={30} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <>
      <Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.card,
            pressed && { opacity: 0.95 },
            isSelected && {
              borderColor: "#00FF88",
              borderWidth: 2,
              shadowColor: "#00FF88",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.7,
              shadowRadius: 16,
              elevation: 20,
              borderRadius: 12,
            },
          ]}
        >
          {cancelled && (
            <View style={styles.cancelOverlay}>
              <Text style={styles.cancelText}>İPTAL EDİLDİ</Text>
            </View>
          )}
          <View style={styles.content}>
            {/* Ana Satır */}
            <View style={styles.mainRow}>
              <View
                style={[
                  styles.indexBadge,
                  isLarge && { width: 26, height: 26 },
                ]}
              >
                <Text
                  style={[styles.indexText, isSmall && { fontSize: fs(9) }]}
                >
                  {orderNumber}
                </Text>
              </View>

              <View style={styles.productSection}>
                <Text
                  style={[
                    styles.productName,
                    isSmall && { fontSize: fs(11), lineHeight: fs(13) },
                  ]}
                  ellipsizeMode="tail"
                >
                  {product.ProductName}
                </Text>

                <Text
                  style={[
                    styles.barcode,
                    isSmall && { fontSize: fs(8), lineHeight: fs(10) },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  #{product.Barcode}
                </Text>
              </View>

              <View style={styles.rightSection}>
                <Text
                  style={[
                    styles.vatRate,
                    isSmall && { fontSize: fs(10), minWidth: 32 },
                  ]}
                >
                  %{(product.VatRate ?? 0).toFixed(0)}
                </Text>

                <Text
                  style={[
                    styles.calculation,
                    isSmall && { fontSize: fs(11), minWidth: 70 },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {product.Stock} × {(product.Price ?? 0).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Alt Satır */}
            <View style={styles.bottomSection}>
              <View style={styles.leftInfo}>
                <View style={styles.leftBottom}>
                  <Text
                    style={[styles.serialText, isSmall && { fontSize: fs(9) }]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {String(product.Barcode)}
                  </Text>

                  {product.Isconto && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={[
                          styles.discount,
                          isSmall && { fontSize: fs(9) },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {product.Isconto}
                      </Text>

                      <Text style={[styles.newField]}>
                        -{product.IndTutar} TL
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <Text
                style={[styles.totalAmount, isSmall && { fontSize: fs(12) }]}
                numberOfLines={1}
              >
                {/* {total.toFixed(2)} TL */}
                {product.Tutar.toFixed(2)} TL
              </Text>
            </View>
          </View>

          <View style={styles.bottomBorder} />
          <View style={styles.sideIndicator} />
        </Pressable>
      </Swipeable>
      {modalType && (
        <SalesCardDetayModal
          visible={modalVisible}
          type={modalType}
          onClose={() => {
            setModalVisible(false);
            swipeableRef.current?.close();
          }}
          // onDelete={() => setIsCancelled(true)}
          // onDelete={() => setIsCancelled((prev) => !prev)}
          onDelete={(itemId) => {
            setSelectedSales((prev) =>
              prev.map((p) =>
                p.Index === itemId ? { ...p, isCanceled: true } : p
              )
            );
          }}
          data={
            modalType === "edit"
              ? { itemId: product.Index, initialCount: product.Stock }
              : modalType === "isconto"
              ? {
                  itemId: product.Index,
                  price: product.Tutar.toFixed(2),
                  indirimTutar: product.IndTutar ?? 0,
                  indirimOran: product.IndOran ?? 0,
                }
              : modalType === "delete"
              ? {
                  itemId: product.Index,
                  price: product.Tutar.toFixed(2),
                  isCancelled: isItemCancelled,
                }
              : undefined
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    borderWidth: 1.5,
    borderRadius: hs(8),
    paddingHorizontal: hs(12),
    paddingVertical: vs(10),
    width: "100%",
    minHeight: vs(110),
    position: "relative",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#374151",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(8),
    minHeight: vs(28),
  },
  indexBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    marginRight: hs(10),
    borderWidth: 1,
    borderColor: "#374151",
  },
  indexText: {
    fontSize: fs(11),
    color: "#ffffff",
    lineHeight: fs(13),
    fontWeight: "700",
  },
  productSection: {
    flex: 1,
    marginRight: hs(10),
    minWidth: 0,
  },
  productName: {
    fontSize: fs(13),
    fontWeight: "700",
    color: "#111827",
    marginBottom: vs(2),
    lineHeight: fs(16),
  },
  barcode: {
    fontSize: fs(11),
    padding: 3,
    fontWeight: "500",
    color: "#6b7280",
    fontFamily: "monospace",
    backgroundColor: "#f9fafb",
    borderRadius: 4,
    alignSelf: "flex-start",
    lineHeight: fs(13),
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    gap: hs(8),
  },
  vatRate: {
    fontSize: fs(12),
    fontWeight: "700",
    color: "#dc2626",
    minWidth: 38,
    textAlign: "center",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  calculation: {
    fontSize: fs(11),
    fontWeight: "600",
    color: "#374151",
    minWidth: 80,
    textAlign: "right",
    fontFamily: "monospace",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    minHeight: vs(24),
    paddingTop: vs(6),
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: hs(10),
    flex: 1,
    minWidth: 0,
  },
  leftBottom: {
    flexDirection: "column",
    // flex: 1,
    // minWidth: 0,
  },
  serialText: {
    fontSize: fs(10),
    fontWeight: "500",
    color: "#6b7280",
    lineHeight: fs(12),
    flexShrink: 1,
    fontFamily: "monospace",
  },

  newField: {
    fontSize: fs(11), // yazı boyutu
    color: "#fff", // yazı rengi
    fontWeight: "500", // orta kalınlık
    marginLeft: 18,
    backgroundColor: "red",
    borderRadius: 3,
  },
  discount: {
    fontSize: fs(10),
    fontWeight: "600",
    color: "#059669",
    lineHeight: fs(11),
    flexShrink: 1, // Discount etiketleri küçülmesin
    backgroundColor: "#fdf6ecff",
    // paddingHorizontal: 4,
    // paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    minWidth: 0,
    // width: screenWidth * 0.0,
    textAlign: "center",
  },
  totalAmount: {
    fontSize: fs(14),
    fontWeight: "800",
    color: "#111827",
    textAlign: "right",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minWidth: 80,
  },
  bottomBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#1f2937",
    opacity: 0.1,
  },
  sideIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#1f2937",
  },

  // yana kaydırmayla ilgili css ler
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // paddingHorizontal: 16,
    // paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    gap: 4,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    // minHeight: 48,
    minHeight: vs(110),
    minWidth: vs(50),

    // width: 80,
    backgroundColor: "#f0f0f0", // Test için açık gri arka plan
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  editButton: {
    // backgroundColor: "#3b82f6", // Test sonrası tekrar ekleyebilirsiniz
  },
  deleteButton: {
    // backgroundColor: "#ef4444", // Test sonrası tekrar ekleyebilirsiniz
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  cancelOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 59, 48, 0.2)", // hafif kırmızı
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderRadius: hs(8), // kartla aynı radius
    borderWidth: 2,
    borderColor: "#FF3B30",
  },
  cancelText: {
    color: "#FF3B30",
    fontWeight: "800",
    fontSize: fs(16),
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
export default SalesCard;
