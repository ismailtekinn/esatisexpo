import React, { memo, useCallback, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import SalesCardDetayModal, { ActionType } from "./SalesCardDetayModal";
import { useSales } from "../contex/SalesContext";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const baseWidth = 375;
const baseHeight = 812;
const scale = screenWidth / baseWidth;
const vScale = screenHeight / baseHeight;
const fs = (size: number) => Math.max(9, Math.round(size * scale)); // font-size
const vs = (size: number) => Math.max(8, Math.round(size * vScale)); // vertical spacing
const hs = (size: number) => Math.max(6, Math.round(size * scale)); // horizontal spacing

const SalesScreenSummaryBox = () => {
  const [modalType, setModalType] = React.useState<ActionType>("totalCount");
  const [modalVisible, setModalVisible] = React.useState(false);
  const swipeableRef = useRef<Swipeable>(null);
  const { summary, setSummary } = useSales();

  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.buttonPressed,
          { backgroundColor: "#FFB74D" },
        ]}
        onPress={() => {
          setModalType("totalCount");
          setModalVisible(true);
        }}
        android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: false }}
      >
        <MaterialIcons name="percent" size={30} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <>
      <Swipeable
        renderRightActions={renderRightActions}
        ref={swipeableRef}
        friction={2}
        overshootRight={false}
      >
        <View style={[{ width: "100%" }]}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <View style={styles.leftColumn}>
                <View style={styles.contentContainer}>
                  <View style={styles.summaryItemInline}>
                    <Text style={styles.summaryLabel}>
                      {summary.totalItems} Satır {summary.totalItems} Çeşit{" "}
                      {summary.totalStock} Ürün
                    </Text>
                  </View>

                  {/* Müşteri bilgisi en alt köşeye sabitlendi */}
                  <View style={styles.customerContainer}>
                    <View style={styles.customerBox}>
                      <Text style={styles.customerLabel}>
                        Ahmet Günbay Yıldız
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.verticalDivider} />
              <View style={styles.rightColumn}>
                {/* 1. Tutar - Üst */}
                <Text style={styles.topPrice}>
                  {summary.totalPrice.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}
                  ₺
                </Text>
                {/* 2. Tutar - Orta (İndirim ile birlikte) */}
                <View style={styles.middlePriceContainer}>
                  <Text style={styles.discountAmount}>
                    {/* {summary.Isconto} {summary.IndTutar} */}
                  </Text>
                  <Text style={styles.middlePrice}>
                   -{(summary.IndTutar).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    ₺
                  </Text>
                </View>
                {/* 3. Tutar - Alt (Ana/Büyük) */}
                <Text style={styles.bottomPrice}>
                  {summary.UrunTutar && summary.UrunTutar > 0
                    ? (
                        summary.UrunTutar 
                      ).toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })
                    : summary.totalPrice.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}
                  ₺
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Swipeable>

      <SalesCardDetayModal
        key={modalType}
        visible={modalVisible}
        type={modalType}
        onClose={() => {
          setModalVisible(false);
          swipeableRef.current?.close();
        }}
        data={{ price: summary.totalPrice.toFixed(2) }}
      />
    </>
  );
};

export default SalesScreenSummaryBox;

const styles = StyleSheet.create({
  summaryBox: {
    width: screenWidth * 0.99,
    height: screenHeight * 0.15,
    backgroundColor: "#003aa6",
    paddingHorizontal: 16,
    paddingVertical: 5,
    elevation: 3,
    alignSelf: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "stretch",
    height: "100%",
  },
  leftColumn: {
    flex: 1,
    position: "relative",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    position: "relative",
  },
  summaryItemInline: {
    paddingTop: 8,
  },

  // Müşteri container'ı en alta sabitlendi
  customerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "flex-start",
  },
  customerBox: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  customerLabel: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "500",
  },

  summaryLabel: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 13,
    color: "#ffff",
    fontWeight: "600",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#rgba(255,255,255,0.3)",
    height: "80%",
    alignSelf: "center",
    marginHorizontal: 16,
  },
  rightColumn: {
    minWidth: 150,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingVertical: 4,
  },

  // Yeni stiller - Sağ kısım için
  generalTotalLabel: {
    fontSize: 16,
    color: "#B3E5FC",
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "center",
  },

  // 1. Tutar - Üst
  topPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },

  // 2. Tutar - Orta (İndirim ile birlikte)
  middlePriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  discountAmount: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    marginRight: 8,
    // backgroundColor: "#ff4d4d",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  middlePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffd54f",
    textAlign: "center",
  },

  // 3. Tutar - Alt (Ana/Büyük)
  bottomPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
  },

  // Diğer stiller aynı kalıyor
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    gap: 4,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    alignItems: "center",
    justifyContent: "center",
    minHeight: vs(125),
    minWidth: vs(50),
    backgroundColor: "#f0f0f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
