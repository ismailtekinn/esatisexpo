import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
  ScrollView,
  Animated,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BarCodeScanResult from "./BarcodeScannerPage";
import { LinearGradient } from "expo-linear-gradient";
import SalesCard from "../component/SalesCard";
import { ProductsJson, SaleItem, SaleProduct } from "../types/saleType";
import SaleScreenModal from "../component/SaleScreenModal";
// import CustomerSelectModal from "../component/CustomerSelectModal";
import { SelectedCustomer } from "../types/customerType";
import { ModalType } from "../types/modalType";
import BaseModalManager from "../component/BaseModalManager";
import { useFileType } from "../contex/fileTypeContext";
import { useSales } from "../contex/SalesContext";
import SalesScreenSummaryBox from "../component/SalesScreenSummaryBox";
import { searchProduct } from "../api/product";
import {
  ProductDataItem,
  SQLDataParsed,
} from "../types/apiresponse/searchProduct";
import SalesScreenSearchArea from "../component/SalesScreenSearchArea";
import { SearchProductFields } from "../types/productType";
import { useSalesCancel } from "../contex/salesCancelContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useSelectedCustomer } from "../contex/selectedCustomerContex";
import { PendingDocument } from "../types/documentsActionType";
import {
  clearPendingDocuments,
  findProductByBarcode,
  getPendingDocumentContent,
  listPendingDocuments,
  savePendingDocument,
  sharePendingDocument,
} from "../services/screensServices/DocumentActionService";
import { useMenuProcess } from "../contex/salesscreen/MenuProccesContext";

import productsDataJson from "../assets/products_20000.json";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const SalesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { selectedAction, setSelectedAction } = useMenuProcess();

  const PAGE_SIZE = 100;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState<SearchProductFields>({
    Aranan: searchText,
    AramaTipi: 0,
    Baslangic: 0,
    Adet: PAGE_SIZE,
  });
  const [searchQuantity, setSearchQuantity] = useState<number>(1);
  // const [searchProducts, setSearchProducts] = useState(sampleProductsDeneme);
  const [searchProducts, setSearchProducts] = useState<SaleItem[]>([]);

  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  // const [selectedSale, setSelectedSales] = useState<SaleItemDeneme[]>([]);
  // const [selectedSale, setSelectedSales] =
  //   useState<SaleItemDeneme[]>(sampleProductsDeneme);
  const { selectedSale, setSelectedSales, summary, setSummary } = useSales();
  const { selectedCustomer, setSelectedCustomer } = useSelectedCustomer();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    selectedSale.length > 0 ? selectedSale.length - 1 : null
  );
  const flatListRef = useRef<FlatList<any>>(null);

  const [searchBoxY, setSearchBoxY] = useState(0);
  const [searchBoxHeight, setSearchBoxHeight] = useState(0);
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  // const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer>();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { selectedFileType, setSelectedFileType } = useFileType();
  const { isDiscountApplied } = useSalesCancel();
  const KEYBOARD_HEIGHT = screenHeight * 0.3;

  const newSectionMaxHeight =
    screenHeight - searchBoxHeight - KEYBOARD_HEIGHT - screenHeight * 0.01;
  const closeSearchModal = () => {
    setSearchProducts([]);
    setSearchData({ Aranan: "", AramaTipi: 0 });
  };

  // const pendingDoc: PendingDocument = {
  //   customer: selectedCustomer,
  //   products: selectedSale,
  //   documentType: selectedFileType,
  //   timestamp: new Date().toISOString(),
  // };

  const data = productsDataJson as ProductsJson; // tip ataması

  const pendingDoc: PendingDocument = {
    customer: selectedCustomer,
    products: data.products,
    documentType: selectedFileType,
    timestamp: new Date().toISOString(),
  };
  const saveDoc = async () => {
    try {
      // console.log("json dosyasından okunan değerler konsole yazdırılıyor:",pendingDoc)
      await savePendingDocument(pendingDoc);
      alert("Belge beklemeye alındı!");
    } catch (error) {
      console.error("Belge kaydedilemedi:", error);
      alert("Belge kaydedilemedi!");
    }
  };
  const searchDocument = async () => {
    try {
      const aranan = 1000000000001;
      const result = await findProductByBarcode(aranan);
      const saleItems: SaleItem[] = [result as SaleItem];

      setSearchProducts((prev) =>
        currentPage === 0 ? saleItems : [...prev, ...saleItems]
      );
    } catch (error) {
      console.log("Aranan ürün bulunamadı: ", error);
    }
  };
  const listAndReadDocs = async () => {
    const files = await listPendingDocuments(); // dosya isimlerini al
    for (const file of files) {
      const content = await getPendingDocumentContent(file);
      if (content?.products) {
        const newItems = content.products.map((product: any) => ({
          Index: product.Index,
          ProductName: product.ProductName,
          Barcode: product.Barcode,
          Stock: product.Stock,
          Price: product.Price,
          VatRate: product.VatRate,
          Rayon: product.Rayon,
          Currency: product.Currency,
          Tutar: product.Tutar,
        }));

        setSelectedSales((prev) => [...prev, ...newItems]); // direkt ekle
      }
    }
    await clearPendingDocuments();
  };
  // Ürün seçme methodu
  const handleSelectProduct = (item: SaleItem) => {
    const newItem = new SaleItem({
      ...item,
      Stock: searchQuantity, // sepete eklenen miktar
    });
    setSelectedSales((prev) => [...prev, newItem]); // her zaman yeni satır eklenir
    setSearchText(""); // arama kutusunu temizle
  };
  // Ürün arama methodu
  const handleSearch = async () => {
    try {
      setLoading(true);
      let isNumber = false;
      let searchValue = searchData.Aranan;
      let quantity = 1;
      if (searchValue.includes("*")) {
        const parts = searchValue.split("*");
        quantity = parseInt(parts[0], 10) || 1;
        searchValue = parts[1] || ""; // ürün kodu kısmı
      }
      isNumber = /^\d+$/.test(searchValue);
      const searchPayload = {
        ...searchData,
        AramaTipi: isNumber ? 1 : 0,
        Aranan: searchValue,
        Baslangic: currentPage * (searchData.Adet || 100),
        Adet: searchData.Adet || 100,
      };

      setSearchQuantity(quantity);
      const response: ProductDataItem[] = await searchProduct(searchPayload);
      if (response) {
        setLoading(false);
      }
      const startIndex = searchProducts.length;
      const saleItems: SaleItem[] = response.map(
        (item, index) =>
          new SaleItem({
            Index: startIndex + index + 1,
            ProductName: item.MAL_ADI,
            Barcode: Number(item.BARKOD),
            Stock: Math.abs(Number(item.BAKIYE)),
            Price: Number(item.SATIS_FIYATI_1.replace(",", ".")),
            VatRate: Number(item.SATIS_KDV),
            Rayon: item.REYON_ADI,
            Currency: "TL",
            UrunId: Number(item.ID),
          })
      );
      // setSearchProducts(saleItems);
      setSearchProducts((prev) =>
        currentPage === 0 ? saleItems : [...prev, ...saleItems]
      );
      setHasMore(saleItems.length > 0);
      setLoading(false);
      setCurrentPage((prev) => prev + 1);

      if (saleItems.length < (searchData.Adet || 100)) setHasMore(false);
    } catch (error: any) {
      console.error("Arama hatası: ", error);
    }
  };

  useEffect(() => {
    // handleSearch();
    searchDocument();
  }, [searchData]);

  useEffect(() => {
    const handleAction = async () => {
      if (selectedAction === "SAVE_PENDING") {
        await saveDoc(); // belgeyi kaydet
        setSelectedSales([]); // seçili ürünleri temizle
        setSelectedAction(undefined); // tekrar tetiklememek için reset
      } else if (selectedAction === "LOAD_PENDING") {
        await listAndReadDocs(); // bekleyen belgeleri yükle
        setSelectedAction(undefined);
      } else if (selectedAction === "SHARE_DOCUMENT") {
        await sharePendingDocument(); // belgeyi paylaş
        setSelectedAction(undefined);
      } else {
        setSelectedAction(undefined);
      }
    };

    handleAction();
  }, [selectedAction]);

  useEffect(() => {
    if (selectedSale.length > 0) {
      setSelectedIndex(selectedSale.length - 1);
    }
  }, [selectedSale]);
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <LinearGradient
          colors={["#fefefe", "#fefefe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.backgroundGradient}
        />
        <View style={styles.customerHeader}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>
              {selectedCustomer
                ? `${selectedCustomer.firstName} ${selectedCustomer.lastName} ${selectedCustomer.phone}`
                : "Müşteri Seçilmedi"}
            </Text>
            <Text
              style={[
                styles.selectedFileText,
                {
                  color: selectedFileType ? "#1f2937" : "#6b7280",
                  fontFamily: "Inter",
                },
              ]}
            >
              {selectedFileType
                ? `Belge Türü: ${selectedFileType}`
                : "Belge Türü Seçilmedi"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.selectCustomerBtn}
            // onPress={() => {
            //   setCustomerModalVisible(true);
            //   navigation.navigate("CustomerSearchScreen");
            // }}
            // onPress={() => navigation.navigate("CustomerSearchScreen")}
            onPress={() => searchDocument()}
          >
            <Text style={styles.selectCustomerBtnText}>Müşteri Seç</Text>
          </TouchableOpacity>
        </View>
        {/* arama textboxının */}
        <View style={styles.searchRow}>
          <View
            style={styles.searchBox}
            onLayout={(event) => {
              const { y, height } = event.nativeEvent.layout;
              setSearchBoxY(y);
              setSearchBoxHeight(height);
            }}
          >
            <Ionicons
              name="search"
              size={20}
              color="#777"
              style={{ marginHorizontal: 6 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Ürün ara"
              value={searchData.Aranan}
              onChangeText={(text) => {
                setSearchData((prev) => ({
                  ...prev,
                  Aranan: text.toLocaleUpperCase(),
                }));
                setCurrentPage(0);
                setSearchProducts([]);
              }}
            />

            {searchData.Aranan.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchData({ Aranan: "", AramaTipi: 0 })}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#999"
                  style={{ marginHorizontal: 6 }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={[
              styles.newSection,
              {
                top: searchBoxY + searchBoxHeight,
                maxHeight: newSectionMaxHeight,
                display: searchData.Aranan.trim() ? "flex" : "none", // görünürlüğü kontrol ediyoruz
              },
            ]}
          >
            {searchData.Aranan.trim().length < 3 && (
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={styles.noDataText}>
                  Lütfen en az 3 karakter giriniz
                </Text>
              </View>
            )}

            {searchData.Aranan.trim().length >= 3 && (
              <>
                <SalesScreenSearchArea
                  searchProducts={searchProducts} // Tek ürünü array olarak gönder
                  handleSelectProduct={handleSelectProduct}
                  dynamicHeight={newSectionMaxHeight} // her satırın yüksekliği
                  onCloseModal={closeSearchModal}
                  loading={loading}
                  hasMore={hasMore}
                  // onLoadMore={handleSearch}
                />

                {loading && (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text>Ürünler yükleniyor...</Text>
                  </View>
                )}

                {!loading && searchProducts.length === 0 && (
                  <Text style={styles.noDataText}>Ürün bulunamadı</Text>
                )}
              </>
            )}
          </View>
          <TouchableOpacity
            style={styles.barcodeBtn}
            onPress={() => setIsScannerVisible(true)}
          >
            <Ionicons name="barcode-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {isScannerVisible && (
          <BarCodeScanResult
            onBarcodeScanned={(data) => {
              setIsScannerVisible(false);
              setSearchData((prev) => ({
                ...prev, // önceki alanları koru
                Aranan: data, // sadece Aranan alanını güncelle
              }));
            }}
            onClose={() => setIsScannerVisible(false)}
          />
        )}

        {/* seçilen ürünlerin listelendiği kısım */}
        <View
          style={{
            position: "absolute",
            top: 2.5 * (searchBoxY + searchBoxHeight) + 10, // Arama kutusunun hemen altından başlar
            left: 0,
            right: 0,
            borderRadius: 10,
            bottom: screenHeight * 0.14 + 10, // Klavyenin üstüne kadar biter
          }}
        >
          <FlatList
            ref={flatListRef}
            data={selectedSale}
            keyExtractor={(item, index) => `${item.Barcode}-${index}`}
            renderItem={({ item, index }) => (
              <SalesCard
                product={item}
                orderNumber={index + 1}
                isSelected={index === selectedIndex}
                onPress={() => setSelectedIndex(index)}
                // isSelected={index === selectedSale.length - 1}
              />
            )}
            contentContainerStyle={{ paddingRight: 63 }}
          />
        </View>

        {/* sağdaki menü butonların ayarlandığı kısım */}
        <View
          style={[
            styles.fabContainer,
            {
              top: 2.6 * (searchBoxY + searchBoxHeight),
              maxHeight: keyboardVisible
                ? Dimensions.get("window").height * 0.4
                : undefined,
              bottom: screenHeight * 0.14 + 10,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 12 }}
          >
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: "#ff7f50" }]}
              onPress={() => setActiveModal("action")}
            >
              <Ionicons name="apps" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.fab, { backgroundColor: "#20b2aa" }]}
              onPress={() => setActiveModal("fileType")}
            >
              <Ionicons name="document-text" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.fab, { backgroundColor: "#4CAF50" }]}
              onPress={() => setSaleModalVisible(true)}
            >
              <Ionicons name="pricetag" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: "#2196F3" }]}
              onPress={() => setSaleModalVisible(true)}
            >
              <Ionicons name="person" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: "#FFB74D" }]}
              onPress={() => setSaleModalVisible(true)}
            >
              <Ionicons name="document-text-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: "#9370db" }]}
              onPress={() => setSaleModalVisible(true)}
            >
              <Ionicons
                name="ellipsis-horizontal-outline"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: "#1E90FF" }]}
              onPress={() => setSaleModalVisible(true)}
            >
              <Ionicons name="flash-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: "#FF3B30" }]}
              onPress={() => setSaleModalVisible(true)}
            >
              <Ionicons name="stop-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* Klavye componentinin eklendiği kısım */}
        {/* <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          <OnScreenKeyboard
            height={KEYBOARD_HEIGHT}
            onKey={(char) => setSearchText((prev) => prev + char)}
            onBackspace={() => setSearchText((prev) => prev.slice(0, -1))}
          />
        </View> */}

        <SaleScreenModal
          visible={saleModalVisible}
          onClose={() => setSaleModalVisible(false)}
        />
        {/* <CustomerSelectModal
          visible={customerModalVisible}
          onClose={() => setCustomerModalVisible(false)}
          onSelect={(customer: SelectedCustomer) =>
            setSelectedCustomer(customer)
          }
        /> */}
        <BaseModalManager
          type={activeModal}
          visible={activeModal !== null}
          onClose={() => setActiveModal(null)}
        />
        <View style={styles.summaryContainer}>
          <SalesScreenSummaryBox />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 8 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 16,
  },

  customerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  customerInfo: {
    flexDirection: "column", // alt alta yazmak için
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    // color: "#fff",
    color: "#333",
  },
  selectedFileText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  selectCustomerBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  selectCustomerBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  searchInput: {
    flex: 1,
    height: screenHeight * 0.06,
    fontSize: 16,
    color: "#333",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingRight: 6,
  },

  barcodeBtn: {
    marginLeft: 10,
    backgroundColor: "#2b6ef2",
    padding: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  searchResultsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  productName: { fontSize: 16, fontWeight: "600", color: "#222" },
  productId: { fontSize: 12, color: "#888" },
  addBtn: { padding: 4 },

  separator: { height: 1, backgroundColor: "#eee", marginLeft: 38 },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 14,
  },

  fabContainer: {
    position: "absolute",
    right: 6,
    borderRadius: 10,
    flexDirection: "column",
    gap: 12,
  },
  fab: {
    // width: 56,
    width: screenWidth * 0.13,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  leftFabContainer: {
    position: "absolute",
    right: 56 + 12,
    top: 70 + 4.8 * 68, // 70 + 340 = 410
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { fontSize: 16, color: "#333" },
  closeBtn: {
    marginTop: 16,
    backgroundColor: "#2b6ef2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeBtnText: { color: "#fff", fontWeight: "700" },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  newSection: {
    position: "absolute", // SearchBox’un hemen altında açılır gibi
    top: 50, // SearchBox yüksekliğine göre ayarlayın
    left: 0, // container padding ile aynı
    right: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    zIndex: 10,
    maxHeight: 500,
  },

  customerItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    padding: 4,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginLeft: 2,
  },
  clientPhone: {
    fontSize: 10,
    color: "#555",
    marginLeft: 2,
  },
  selectBtn: {
    backgroundColor: "#2b6ef2",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    alignItems: "center",
    marginTop: 2,
    alignSelf: "flex-start",
  },
  selectBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 10,
  },
  noDataText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginVertical: 12,
  },
  summaryBox: {
    position: "absolute",
    width: screenWidth * 0.99,
    height: screenHeight * 0.12,
    bottom: screenHeight * 0.01,
    backgroundColor: "#003aa6",
    marginLeft: screenWidth * 0.01,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 3,
    alignSelf: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    flex: 1,
  },
  leftColumn: {
    flex: 1,
    justifyContent: "space-around",
    // paddingRight: 8,
  },
  verticalDivider: {
    width: 1, // çizgi kalınlığı
    backgroundColor: "#black", // çizgi rengi
    marginHorizontal: 12, // sol ve sağ boşluk
  },
  rightColumn: {
    alignItems: "center",
    // backgroundColor: "#64748B",
    borderRadius: 7,
    paddingHorizontal: 3,
    // paddingVertical: 8,
  },
  summaryItemLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  generalTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  generalTotalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  summaryContainer: {
    // bottom: screenHeight * 0.01,
    bottom: 0,

    position: "absolute",
    // bottom:0,
  },
});

export default SalesScreen;
