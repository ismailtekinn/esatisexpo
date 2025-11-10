import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ListRenderItem,
  Keyboard,
  Alert,
} from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomerSelect from "./CustomerSelect";
import { SearchCustomerFields, SelectedCustomer } from "../types/customerType";
import {
  CustomerItem,
  DATum,
  SQLDataResponse,
} from "../types/apiresponse/searchCustomers";
import { searchCustomers } from "../api/customer";
import { useSelectedCustomer } from "../contex/selectedCustomerContex";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import {
  MüşteriAramaTipi,
  SearchOptionTitles,
  SearchOptionValues,
} from "../types/enums/tria";
import AlertModal from "../component/AlertModal";
import CustomerSelectModal from "../component/CustomerAddModal";
import { use } from "i18next";
import { fetchSearchMethot } from "../api/generic";
import CustomerAddModal from "../component/CustomerAddModal";
import { BussinessProvider } from "../contex/addCustomerModal/bussinessContext";
import { MUSTERI_SORGULA_URL } from "../constants/constant";

const screenWidth = Dimensions.get("window").width;
const CustomerSearchScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [search, setSearch] = useState<string>("");
  // const [filtered, setFiltered] = useState<CustomerItem[]>([]);
  const [filtered, setFiltered] = useState<DATum[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  // const [selectedOption, setSelectedOption] = useState("Müşteri Adına Göre");
  const [selectedOption, setSelectedOption] = useState<{
    title: string;
    value: SearchOptionValues;
  }>({
    title: "Müşteri Adına Göre",
    value: SearchOptionValues.MusteriAdi,
  });
  const { selectedCustomer, setSelectedCustomer } = useSelectedCustomer();
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [addCustomerModalVisible, setAddCustomerModalVisible] = useState(false);

  const [isBlinking, setIsBlinking] = useState(true);

  const [searchData, setSearchData] = useState<SearchCustomerFields>({
    WebErisimKullanici: "TRIA_TEST",
    WebErisimSifre: "SFR57220",
    Aranan: "A%%",
    AramaTipi: 0,
    Baslangic: 0,
    Adet: 100,
    DetayDataGetir: true,
  });
  const handleSelectCustomer = (customer: CustomerItem) => {
    Keyboard.dismiss();

    setSelectedCustomer({
      id: customer.ID,
      firstName: customer.MUSTERI_ADI,
      lastName: customer.MUSTERI_SOYADI,
      phone: customer.TELEFON_1,
    });
    navigation.goBack();
  };
  const handleSelectOption = async () => {
    let aramaTipi = 0; // default

    if (selectedOption.value === 7) {
      // Ad & T.C & Kart No özel kontrolleri
      if (searchData.Aranan.length === 11) {
        aramaTipi = 3;
      } else if (searchData.Aranan.length === 10) {
        aramaTipi = 2;
      } else if (isNaN(Number(searchData.Aranan))) {
        aramaTipi = 0;
      } else {
        setAlertMessage("Girilen ifade hiçbir arama parametresiyle uyuşmuyor");
        setAlertModalVisible(true);
        return; // hata durumunda state güncelleme yapma
      }
    } else {
      // Diğer seçeneklerde direkt enum değerini kullan
      aramaTipi = selectedOption.value;
    }

    // Tek bir yerde state güncelle
    setSearchData((prev) => ({
      ...prev,
      AramaTipi: aramaTipi,
    }));
  };
  useEffect(() => {
    handleSelectOption();
  }, [selectedOption, searchData.Aranan]);

  const handleCustomerSearch = async () => {
    try {
      if (!search || search.trim() === "") {
        setAlertMessage("Lütfen arama parametresi giriniz");
        setAlertModalVisible(true);
        return;
      }
      // const url = "http://192.168.0.162:44342/MusteriSorgula";
      const response = await fetchSearchMethot<DATum, typeof searchData>(
        MUSTERI_SORGULA_URL,
        searchData
      );
      setFiltered(response.main.DATA ?? []);
    } catch (error: any) {
      console.error("Müşteri arama hatası:", error);
    }
  };

  const renderItem: ListRenderItem<DATum> = ({ item }) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled" // Burayı ekle
      keyboardDismissMode="on-drag"
    >
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => {
          handleSelectCustomer(item);
        }}
      >
        {item?.UYARI_BILGI &&
          item.UYARI_BILGI.trim() !== "" &&
          item.UYARI_BILGI !== "null" && (
            <View style={styles.warningStrip}>
              <MaterialIcons
                name="warning"
                size={26}
                color="white"
                style={{ opacity: isBlinking ? 1 : 0 }}
              />
            </View>
          )}
        <View style={[styles.cell, { width: 120 }]}>
          <Text style={styles.cellLabel}>M.Kodu</Text>
          <Text style={styles.cellValue}>{item.MUSTERI_KODU}</Text>
        </View>
        <View style={[styles.cell, { width: 160 }]}>
          <Text style={styles.cellLabel}>Müşteri Adı</Text>
          <Text style={[styles.cellValue, styles.nameText]}>
            {item.MUSTERI_ADI_SOYADI}
          </Text>
        </View>
        <View style={[styles.cell, { width: 140 }]}>
          <Text style={styles.cellLabel}>T.C. No</Text>
          <Text style={styles.cellValue}>{item.TC_KIMLIK_NO || "-"}</Text>
        </View>
        <View style={[styles.cell, { width: 120 }]}>
          <Text style={styles.cellLabel}>K.Limit</Text>
          <Text style={[styles.cellValue, styles.limitText]}>
            {item.KREDI_LIMITI}
          </Text>
        </View>
        <View style={[styles.cell, { width: 120 }]}>
          <Text style={styles.cellLabel}>Kart No</Text>
          <Text style={styles.cellValue}>{item.KART_NO}</Text>
        </View>
        <View style={[styles.cell, { width: 120 }]}>
          <Text style={styles.cellLabel}>V.Dairesi</Text>
          <Text style={styles.cellValue}>{item.VERGI_DAIRESI}</Text>
        </View>
        <View style={[styles.cell, { width: 120 }]}>
          <Text style={styles.cellLabel}>V.Numarası</Text>
          <Text style={styles.cellValue}>{item.VERGI_NUMARASI}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Müşteri Arama Listesi</Text>
        <View style={styles.headerLine} />
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <AntDesign
            name="search1"
            size={18}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setSearchData((prev) => ({
                ...prev,
                Aranan: text,
              }));
              if (!text) {
                setFiltered([]);
              }
            }}
            placeholder="Müşteri adı veya T.C. ara..."
            style={styles.input}
            placeholderTextColor="#999"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                setFiltered([]);
              }}
              style={styles.clearButton}
            >
              <AntDesign name="closecircle" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.findButton]}
            onPress={handleCustomerSearch}
          >
            <AntDesign name="search1" size={16} color="#fff" />
            <Text style={styles.buttonText}>Bul</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.tcButton]}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <AntDesign name="idcard" size={16} color="#fff" />
            <Text
              style={[styles.buttonText, { fontSize: 11 }]}
              numberOfLines={2}
            >
              {selectedOption.title}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, styles.formButton]}
            onPress={() => {
              setAddCustomerModalVisible(true);
            }}
          >
            <Ionicons name="person-add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {filtered.length} müşteri bulundu
        </Text>
        <Text style={styles.swipeHint}>← Detay için sağa kaydırın →</Text>
      </View>
      {search.length > 0 && (
        <View style={styles.tableContainer}>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.ID}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
      <View>
        <CustomerSelect
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </View>
      <AlertModal
        visible={alertModalVisible}
        message={alertMessage}
        onClose={() => setAlertModalVisible(false)}
      />
      <BussinessProvider>
        <CustomerAddModal
          visible={addCustomerModalVisible}
          onClose={() => setAddCustomerModalVisible(false)}
        />
      </BussinessProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  headerContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
  },
  headerLine: {
    height: 3,
    backgroundColor: "#3498db",
    marginTop: 10,
    borderRadius: 2,
  },
  searchContainer: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f4",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#2c3e50" },
  clearButton: { padding: 5 },
  buttonRow: { flexDirection: "row", gap: 10 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  findButton: { backgroundColor: "#3498db" },
  tcButton: { backgroundColor: "#27ae60" },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  formButton: { backgroundColor: "#e67e22" },
  checkButton: { backgroundColor: "#27ae60" },
  buttonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  resultsInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultsText: { fontSize: 14, color: "#7f8c8d", fontWeight: "500" },
  swipeHint: { fontSize: 12, color: "#95a5a6", fontStyle: "italic" },
  tableContainer: { flex: 1, paddingHorizontal: 15 },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  warningStrip: {
    width: screenWidth * 0.07, // ekran genişliğinin %3'ü kadar
    backgroundColor: "orange",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    flexDirection: "row",
  },
  cell: { paddingHorizontal: 8 },
  cellLabel: {
    fontSize: 11,
    color: "#7f8c8d",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  cellValue: { fontSize: 14, color: "#2c3e50", fontWeight: "600" },
  nameText: { color: "#2980b9", fontWeight: "700" },
  limitText: { color: "#e74c3c", fontWeight: "700" },
  separator: { height: 8 },
});

export default CustomerSearchScreen;
