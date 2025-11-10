import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import BarCodeScanResult from "./BarcodeScannerPage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelectedProduct } from "../contex/selectedProductContext";
import { MinimalProduct } from "../types/productType";
import { Customer } from "../types/customerType";
import { customerList } from "../api/customer";
import { suplierList } from "../api/suplier";
import { Suplier } from "../types/suplierType";
import { CreateReturn } from "../types/returnType";
import { createReturn } from "../api/return";
import { useTranslation } from "react-i18next";
import { useUser } from "../contex/useContext";

const ReturnProduct = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { userId } = useUser();
  const userIdNumber = userId ? Number(userId) : 0;
  const userID = userIdNumber;
  const [paymentType, setPaymentType] = useState("customer");
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [totalAmount, setTotalAmount] = useState(0);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { selectedProduct, setSelectedProduct } = useSelectedProduct();
  const [products, setProducts] = useState<MinimalProduct[]>([]);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Suplier[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    ClientID: string;
    ClientName: string;
    ClientSurname: string;
  } | null>(null);

  const [suplierData, setSuplierData] = useState<CreateReturn | CreateReturn[]>(
    [
      {
        ProductID: 0,
        ReturnDate: new Date("2025-08-01T10:30:00.000Z"),
        UserID: 1,
        TotalAmount: 0,
        ReturnDescription: "Paketler kötü.",
        ReturnType: "supplier",
        SaleID: 12,
        ClientID: 1,
        Quantity: 53,
      },
    ]
  );
  const isFocused = useIsFocused();

  const { t } = useTranslation();

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || invoiceDate;
    setShowDatePicker(false);
    setInvoiceDate(currentDate);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("return_product.title"),
    });
  }, [navigation]);

  const handleSave = async () => {
    try {
      const response = await createReturn(suplierData);
      if (response.isSuccess) {
        alert(`${t("alertMessage.createSuccess")}`);
        setSelectedProduct(null);
      } else {
        alert("Bir hata oluştu: " + response.message);
      }
    } catch (error: any) {
      console.error("Registration failed: ", error);
      alert(`${t("alertMessage.createError")}`);
    }
  };
  const adetArttir = (index: number) => {
    const yeniUrunler = [...products];
    yeniUrunler[index].Stok_Quantity += 1;
    setProducts(yeniUrunler);
  };

  const adetAzalt = (index: number) => {
    const yeniUrunler = [...products];
    if (yeniUrunler[index].Stok_Quantity > 1) {
      yeniUrunler[index].Stok_Quantity -= 1;
      setProducts(yeniUrunler);
    }
  };
  const deleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((item) => item.ProductID !== productId));

    if (selectedProduct && selectedProduct.ProductID === productId) {
      setSelectedProduct(null);
    }
  };

  const handleList = async () => {
    try {
      if (paymentType === "customer") {
        const response = await customerList(userID);
        if (response.isSuccess) {
          setCustomers(response.data);
        } else {
          alert(`${t("alertMessage.createError")}`);
        }
      } else {
        const response = await suplierList(userID);
        if (response.isSuccess) {
          setSuppliers(response.data);
        } else {
          alert(`${t("alertMessage.createError")}`);
        }
      }
    } catch (error: any) {
      console.error("Verileri getirirken hata oluştu:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      setProducts((prev) => {
        const existing = prev.find(
          (p) => p.ProductID === selectedProduct.ProductID
        );
        if (existing) {
          return prev.map((p) =>
            p.ProductID === selectedProduct.ProductID
              ? {
                  ...p,
                  Stok_Quantity:
                    p.Stok_Quantity + selectedProduct.Stok_Quantity,
                }
              : p
          );
        } else {
          return [...prev, selectedProduct];
        }
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    const mapped = products.map((product) => ({
      ProductID: product.ProductID,
      ReturnDate: invoiceDate,
      UserID: 1,
      ReturnDescription: "Deneme metni",
      ReturnType: paymentType,
      TotalAmount: product.Stok_Quantity * product.SalePrice,
      SaleID: selectedProduct?.SaleID,
      ClientID: selectedCustomer
        ? Number(selectedCustomer.ClientID)
        : undefined,
      Quantity: product.Stok_Quantity,
    }));
    setSuplierData(mapped);
  }, [products, selectedCustomer]);

  useEffect(() => {
    handleList();
  }, [userID, paymentType, isFocused]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {isScannerVisible && (
          <View style={styles.scannerContainer}>
            <BarCodeScanResult
              onBarcodeScanned={(data) => {}}
              onClose={() => setIsScannerVisible(false)}
            />
          </View>
        )}
        <View style={styles.rowLayout}>
          <View style={[styles.columnLayout, styles.wideColumn]}>
            <Text style={styles.labelText}>
              {t("return_product.return_type")}
            </Text>
            <Picker
              selectedValue={paymentType}
              style={styles.pickerStyle}
              onValueChange={(itemValue: string) => setPaymentType(itemValue)}
            >
              <Picker.Item
                label={t("return_product.customerReturn")}
                value="customer"
              />
              <Picker.Item
                label={t("return_product.supplierReturn")}
                value="supplier"
              />
            </Picker>
          </View>
          <View style={[styles.columnLayout, styles.narrowColumn]}>
            <Text style={styles.labelText}>
              {t("return_product.invoice_date")}
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <Text>{invoiceDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={invoiceDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              paymentType === "customer"
                ? navigation.navigate("AddCustomer")
                : navigation.navigate("AddSuplier");
            }}
          >
            <Text style={styles.addButtonText}>
              {paymentType === "customer"
                ? t("return_product.add_customer")
                : t("return_product.add_supplier")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {paymentType === "customer"
              ? t("return_product.select_customer")
              : t("return_product.select_supplier")}
          </Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCustomer}
              onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
            >
              <Picker.Item
                label={
                  paymentType === "customer"
                    ? t("purchaseform.selectCustomer")
                    : t("purchaseform.selectSupplier")
                }
                value={null}
                enabled={false}
                style={{ width: "30%" }}
              />
              {paymentType === "customer"
                ? customers.map((customer, index) => (
                    <Picker.Item
                      key={index}
                      label={`${customer.ClientName} ${customer.ClientSurname}`}
                      value={customer}
                    />
                  ))
                : suppliers.map((supplier, index) => (
                    <Picker.Item
                      key={index}
                      label={`${supplier.SupplierName} ${supplier.SupplierSurname}`}
                      value={supplier}
                    />
                  ))}
            </Picker>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => navigation.navigate("SaleProductList")}
          >
            <Text style={styles.buttonText}>
              {t("return_product.select_product")}
            </Text>
          </TouchableOpacity>
        </View>

        {products.map((item, index) => (
          <View key={item.ProductID || index} style={styles.urunCard}>
            <Text style={styles.urunTitle}>{item.ProductName}</Text>

            <View style={styles.adetRow}>
              <Text style={styles.adetLabel}>
                {t("return_product.quantity")}
              </Text>

              <TouchableOpacity
                onPress={() => adetAzalt(index)}
                style={styles.counterButton}
              >
                <Text>-</Text>
              </TouchableOpacity>

              <Text style={styles.adet}>{item.Stok_Quantity}</Text>

              <TouchableOpacity
                onPress={() => adetArttir(index)}
                style={styles.counterButton}
              >
                <Text>+</Text>
              </TouchableOpacity>

              <View style={styles.birimFiyatContainer}>
                <Text style={styles.label}>
                  {t("return_product.unit_price")}
                </Text>
                <TextInput
                  style={styles.birimFiyat}
                  value={item.PurchasePrice.toString()}
                  editable={false}
                />
              </View>
            </View>

            <Text style={styles.araToplam}>
              {t("return_product.subtotal")}{" "}
              {item.Stok_Quantity * item.PurchasePrice}
            </Text>

            <TouchableOpacity
              onPress={() => {
                deleteProduct(item.ProductID);
              }}
            >
              <Text style={styles.sil}>
                {t("return_product.delete_product")}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={() => handleSave()}>
        <Text style={styles.saveButtonText}>{t("return_product.save")}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  scannerContainer: {
    height: 40,
    marginTop: 50,
    marginBottom: 90,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  printButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    right: 0,
    borderRadius: 5,
  },
  printButtonText: {
    fontSize: 18,
    color: "#007bff",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignItems: "center",
  },

  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  selectButton: {
    flex: 1,
    backgroundColor: "#343a40",
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  barcodeButton: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  totalAmount: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#343a40",
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },

  rowLayout: {
    flexDirection: "row", // Satır düzeni
    justifyContent: "space-between", // Kolonlar arasında boşluk bırak
    marginBottom: 15, // Alt boşluk
  },
  columnLayout: {
    flex: 1, // Varsayılan olarak her kolon eşit genişlikte olacak
    marginHorizontal: 5, // Kolonlar arasında yatay boşluk
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333", // Yazı rengini belirledik
  },
  pickerStyle: {
    width: "100%", // Picker genişliği
    height: 50, // Yükseklik
    backgroundColor: "#f5f5f5", // Arka plan rengi
    borderRadius: 8, // Köşe yuvarlama
    borderWidth: 1, // Kenarlık
    borderColor: "#ccc", // Kenarlık rengi
    paddingHorizontal: 10, // İç boşluk
  },
  inputStyle: {
    width: "100%", // Input genişliği
    height: 50, // Yükseklik
    backgroundColor: "#f5f5f5", // Arka plan rengi
    borderRadius: 8, // Köşe yuvarlama
    borderWidth: 1, // Kenarlık
    borderColor: "#ccc", // Kenarlık rengi
    paddingHorizontal: 10, // İç boşluk
  },
  wideColumn: {
    flex: 2, // İade Tipi kolonunu genişletmek için flex oranını 2 yaptık
  },
  narrowColumn: {
    flex: 1, // Fatura Tarihi kolonunu daha dar yapmak için flex oranını 1 yaptık
  },
  addButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
  },

  urunCard: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  urunTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  adetRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  adetLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  counterButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  adet: {
    width: 30,
    textAlign: "center",
  },

  birimFiyatContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  birimFiyat: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
    marginLeft: 6,
    textAlign: "right",
  },

  araToplam: {
    marginTop: 8,
    fontWeight: "bold",
  },
  sil: {
    color: "red",
    marginTop: 8,
  },
});

export default ReturnProduct;
