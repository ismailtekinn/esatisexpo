import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import BarCodeScanResult from "./BarcodeScannerPage";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useSelectedProduct } from "../contex/selectedProductContext";
import { ScrollView } from "react-native-gesture-handler";
import { MinimalProduct } from "../types/productType";
import { createPurchase } from "../api/purchase";
import { CreatePurchase } from "../types/purchase";
import { suplierList } from "../api/suplier";
import { Suplier } from "../types/suplierType";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { getProductByBarcode } from "../api/product";
import { useUser } from "../contex/useContext";

const PurchaseForm = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { userId } = useUser();
  const userIdNumber = userId ? Number(userId) : 0;
  const userID = userIdNumber;

  const [suppliers, setSuppliers] = useState<Suplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<{
    SupplierID: number;
    SupplierName: string;
    SupplierSurname: string;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState("Nakit");
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  const { selectedProduct, setSelectedProduct } = useSelectedProduct();
  const [products, setProducts] = useState<MinimalProduct[]>([]);
  const isFocused = useIsFocused();

  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("purchaseform.pageTitle"),
    });
  }, [navigation]);

  const [formData, setFormData] = useState<CreatePurchase | CreatePurchase[]>([
    {
      UserID: 1,
      Purchase_date: new Date(),
      ProductID: 0,
      SupplierID: 0,
      Total_amount: 0,
      Quantity: 0,
    },
  ]);

  const genelToplam = products.reduce(
    (toplam, item) => toplam + item.Stok_Quantity * item.SalePrice,
    0
  );

  const handleBarcodeSearch = async (barcodeNumber: string) => {
    try {
      const response = await getProductByBarcode(barcodeNumber);

      if (response.isSuccess && response.data && response.data.ProductID) {
        setProducts((prevProducts) => {
          const newProduct = response.data;
          const existing = prevProducts.find(
            (p) => p.ProductID === newProduct.ProductID
          );

          if (existing) {
            return prevProducts.map((p) =>
              p.ProductID === newProduct.ProductID
                ? {
                    ...p,
                    Stok_Quantity: p.Stok_Quantity + 1,
                  }
                : p
            );
          } else {
            return [...prevProducts, { ...newProduct, Stok_Quantity: 1 }];
          }
        });
      } else {
        alert("Barkod numarasına ait geçerli bir ürün bulunamadı.");
      }
    } catch (error: any) {
      console.error("Ürünleri getirirken hata oluştu:", error);
      alert("Bir hata oluştu: " + error.message);
    }
  };
  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || invoiceDate;
    setShowDatePicker(false);
    setInvoiceDate(currentDate);
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
      // setProducts([]);
      setSelectedProduct(null);
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
    const updatedFormData = products.map((product) => ({
      UserID: 1,
      Purchase_date: invoiceDate,
      ProductID: product.ProductID,
      SupplierID: selectedSupplier?.SupplierID,
      Total_amount: product.Stok_Quantity * product.SalePrice,
      Quantity: product.Stok_Quantity,
    }));

    setFormData(updatedFormData);
  }, [products, invoiceDate, selectedSupplier]);

  useEffect(() => {
    handleSupplierList();
  }, [userID, isFocused]);

  const handleSave = async () => {
    if (Array.isArray(formData)) {
      if (!formData[0]?.SupplierID) {
        alert(`${t("alertMessage.selectSupplier")}`);

        return;
      }
    } else {
      if (!formData.SupplierID) {
        alert(`${t("alertMessage.selectSupplier")}`);

        return;
      }
    }
    try {
      const response = await createPurchase(formData);
      if (response.isSuccess) {
        setSelectedProduct(null);
        alert(`${t("alertMessage.createSuccess")}`);
      } else {
        alert(`${t("alertMessage.createError")}`);
      }
    } catch (error: any) {
      console.error("Registration failed: ", error);
      alert("Bir hata oluştu: " + error.message);
    }
  };
  const handleSupplierList = async () => {
    try {
      const response = await suplierList(userID);
      if (response.isSuccess) {
        setSuppliers(response.data);
      } else {
        alert("Bir hata oluştu: " + response.message);
      }
    } catch (error: any) {
      console.error("Verileri getirirken hata oluştu:", error);
      alert("Bir hata oluştu: " + error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {isScannerVisible && (
          <View style={styles.scannerContainer}>
            <BarCodeScanResult
              onBarcodeScanned={(data) => {
                handleBarcodeSearch(data);
              }}
              onClose={() => setIsScannerVisible(false)}
            />
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                navigation.navigate("AddSuplier");
              }}
            >
              <Text style={styles.addButtonText}>
                {t("purchaseform.addSupplier")}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Picker
              selectedValue={selectedSupplier}
              onValueChange={(itemValue) => setSelectedSupplier(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                label={t("purchaseform.selectSupplier")}
                value={null}
                enabled={false}
                style={{ width: "30%" }}
              />
              {suppliers.map((supplier, index) => (
                <Picker.Item
                  key={index}
                  label={`${supplier.SupplierName} ${supplier.SupplierSurname}`}
                  value={supplier}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.label}>
                {" "}
                {t("purchaseform.payment_method")}
              </Text>
              <Picker
                selectedValue={paymentMethod}
                onValueChange={setPaymentMethod}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label={t("payment.cash")} value="Nakit" />
                <Picker.Item label={t("payment.card")} value="Kart" />
                <Picker.Item label={t("payment.transfer")} value="Havale" />
              </Picker>
            </View>

            <View style={styles.inputGroupHalf}>
              <Text style={styles.label}>{t("purchaseform.invoice_date")}</Text>
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

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("SelectProduct", { source: "purchase" })
              }
            >
              <Text style={styles.actionText}>
                {t("purchaseform.select_product")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsScannerVisible(true)}
            >
              <Text style={styles.actionText}>
                {t("purchaseform.scan_barcode")}
              </Text>
            </TouchableOpacity>
          </View>

          {products.map((item, index) => (
            <View key={item.ProductID || index} style={styles.urunCard}>
              <Text style={styles.urunTitle}>{item.ProductName}</Text>

              <View style={styles.adetRow}>
                <Text style={styles.adetLabel}>
                  {t("purchaseform.quantity")}
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
                    {t("purchaseform.unit_price")}
                  </Text>
                  <TextInput
                    style={styles.birimFiyat}
                    value={item.SalePrice.toString()}
                    editable={false}
                  />
                </View>
              </View>

              <Text style={styles.araToplam}>
                {t("purchaseform.subtotal")}{" "}
                {item.Stok_Quantity * item.SalePrice} ₺
              </Text>

              <TouchableOpacity
                onPress={() => {
                  deleteProduct(item.ProductID);
                }}
              >
                <Text style={styles.sil}>
                  {t("purchaseform.delete_product")}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              {t("purchaseform.order_summary")}
            </Text>
            <Text style={styles.genelTotal}>
              {t("purchaseform.total")} {genelToplam} ₺
            </Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={() => handleSave()}>
        <Text style={styles.saveButtonText}>{t("purchaseform.save")}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default PurchaseForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scannerContainer: {
    height: 40,
    marginTop: 50,
    marginBottom: 90,
  },
  formContainer: {
    flex: 1,
  },

  inputGroup: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputGroupHalf: {
    flex: 1,
    marginRight: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    // fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  picker: {
    height: 50,
    width: "100%",
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignItems: "center",
  },

  actionButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#333",
    margin: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  actionText: {
    color: "white",
    fontSize: 16,
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

  summaryCard: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  summaryTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  genelTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },

  saveButton: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: "#333",

    alignItems: "center",
    borderRadius: 5,

    zIndex: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    top: 0,
    left: 10,
    backgroundColor: "black",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 30,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
  },
});
