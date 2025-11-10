import React, { useRef, useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SaleItem } from "../types/saleType";
import { useSalesCancel } from "../contex/salesCancelContext";
import AlertModal from "./AlertModal";
import { useAlert } from "../contex/AlertContext";

type SalesScreenSearchAreaProps = {
  searchProducts: SaleItem[];
  handleSelectProduct: (item: SaleItem) => void;
  dynamicHeight: number;
  onCloseModal?: () => void;
  loading?: boolean; // Şu anda veri yükleniyor mu
  hasMore?: boolean; // Daha fazla veri var mı
  onLoadMore?: () => void;
};
const SalesScreenSearchArea: React.FC<SalesScreenSearchAreaProps> = ({
  searchProducts,
  handleSelectProduct,
  dynamicHeight,
  onCloseModal,
  loading,
  hasMore,
  onLoadMore,
}) => {
  const { isDiscountApplied, setIsDiscountApplied } = useSalesCancel();
  const {
    alertModalVisible,
    setAlertModalVisible,
    alertMessage,
    setAlertMessage,
  } = useAlert();
  const flatListRef = useRef<FlatList<SaleItem>>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const renderItem: ListRenderItem<SaleItem> = ({ item }) => (
    <View style={styles.customerItem}>
      {/* Ürün adı - full width */}
      <View style={styles.productNameRow}>
        <MaterialCommunityIcons name="cube-outline" size={16} color="#007AFF" />
        <Text style={styles.productName}>{item.ProductName}</Text>
      </View>

      {/* Tablo kısmı */}
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          {/* Kaydırılabilir tablo sütunları */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollableTable}
          >
            <View style={styles.scrollableRow}>
              {/* Barkod */}
              <View style={styles.tableCell}>
                <View style={styles.tableCellHeader}>
                  <MaterialCommunityIcons
                    name="barcode"
                    size={12}
                    color="#007AFF"
                  />
                  <Text style={styles.tableCellHeaderText}>Barkod</Text>
                </View>
                <Text style={styles.tableCellContent} numberOfLines={1}>
                  {item.Barcode}
                </Text>
              </View>

              {/* KDV */}
              <View style={styles.tableCell}>
                <View style={styles.tableCellHeader}>
                  <MaterialCommunityIcons
                    name="percent"
                    size={12}
                    color="#007AFF"
                  />
                  <Text style={styles.tableCellHeaderText}>KDV</Text>
                </View>
                <Text style={styles.tableCellContent}>{item.VatRate}%</Text>
              </View>

              {/* Fiyat */}
              <View style={styles.tableCell}>
                <View style={styles.tableCellHeader}>
                  <MaterialCommunityIcons
                    name="currency-try"
                    size={12}
                    color="#007AFF"
                  />
                  <Text style={styles.tableCellHeaderText}>Fiyat</Text>
                </View>
                <Text style={styles.tableCellContent}>₺{item.Price}</Text>
              </View>
              {/* Stok */}
              <View style={styles.tableCell}>
                <View style={styles.tableCellHeader}>
                  <MaterialCommunityIcons
                    name="layers-outline"
                    size={12}
                    color="#007AFF"
                  />
                  <Text style={styles.tableCellHeaderText}>Stok</Text>
                </View>
                <Text style={styles.tableCellContent}>{item.Stock}</Text>
              </View>

              {/* Reyon */}
              <View style={styles.tableCell}>
                <View style={styles.tableCellHeader}>
                  <MaterialCommunityIcons
                    name="storefront-outline"
                    size={12}
                    color="#007AFF"
                  />
                  <Text style={styles.tableCellHeaderText}>Reyon</Text>
                </View>
                <Text style={styles.tableCellContent} numberOfLines={1}>
                  {item.Rayon}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Seç Butonu - Her zaman görünür */}
          <View style={styles.buttonCell}>
            <TouchableOpacity
              style={styles.selectBtn}
              onPress={() => {
                if (isDiscountApplied) {
                  setAlertMessage(
                    "Dip iskonto yapıldıktan sonra yeni ürün ekleyemezsiniz. Yeni ürün eklemek için lütfen dip isconto işlemini iptal edin."
                  );
                  setAlertModalVisible(true);
                  return;
                }
                handleSelectProduct(item);
                onCloseModal?.();
              }}
            >
              <Text style={styles.selectBtnText}>Seç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* <AlertModal
        visible={alertModalVisible}
        message={alertMessage}
        onClose={() => setAlertModalVisible(false)}
      /> */}
    </View>
  );

  return (
    <FlatList
      data={searchProducts}
      keyExtractor={(item) => `${item.UrunId}-${Date.now()}-${Math.random()}`}
      renderItem={renderItem}
      style={{ maxHeight: dynamicHeight }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onEndReached={() => {
        if (!loading && hasMore) {
          onLoadMore?.(); // parent'tan gelen method çağrılıyor
        }
      }}
      onEndReachedThreshold={0.3}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
    />
  );
};

const styles = StyleSheet.create({
  customerItem: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
    flex: 1,
  },
  tableContainer: {
    backgroundColor: "#fafafa",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  scrollableTable: {
    flex: 1,
  },
  scrollableRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  tableCell: {
    minWidth: 80,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: "#e8e8e8",
    justifyContent: "space-between",
  },
  tableCellHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  tableCellHeaderText: {
    fontSize: 9,
    color: "#666",
    marginLeft: 2,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  tableCellContent: {
    fontSize: 11,
    color: "#333",
    fontWeight: "500",
  },
  buttonCell: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderLeftColor: "#e8e8e8",
  },
  selectBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  selectBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 10,
  },
});

export default SalesScreenSearchArea;
