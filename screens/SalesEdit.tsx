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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useSelectedProduct } from "../contex/selectedProductContext";
import { ScrollView } from "react-native-gesture-handler";
import { MinimalProduct } from "../types/productType";
import { CreateSale, SaleEdit } from "../types/saleType";
import { createSale, updateSale } from "../api/sale";
import { Customer } from "../types/customerType";
import { customerList } from "../api/customer";
import { useTranslation } from "react-i18next";
import { useUser } from "../contex/useContext";

type SaleEditRouteProp = RouteProp<RootStackParamList, "SalesEdit">;
function SalesEdit() {
  const { params } = useRoute<RouteProp<RootStackParamList, "SalesEdit">>();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    ClientID: string;
    ClientName: string;
    ClientSurname: string;
  } | null>(null);
  const { userId } = useUser();
  const userIdNumber = userId ? Number(userId) : 0;
  const userID = userIdNumber;

  const [paymentMethod, setPaymentMethod] = useState("Nakit");
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  const { selectedProduct, setSelectedProduct } = useSelectedProduct();
  const [products, setProducts] = useState<MinimalProduct[]>([]);

  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("edit_sale.title"),
    });
  }, [navigation]);

  const genelToplam = products.reduce(
    (toplam, item) => toplam + item.Quantity * item.SalePrice,
    0
  );

  const [formData, setFormData] = useState<SaleEdit[]>([
    {
      ProductID: 1,
      SaleDate: new Date(),
      SaleID: 0,
      // Stok_Quantity: 0,
      Quantity: 0,
      TotalAmount: 0,
      SaleType: "",
      UserID: 0,
    },
  ]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || invoiceDate;
    setShowDatePicker(false);
    setInvoiceDate(currentDate);
  };
  const adetArttir = (index: number) => {
    const yeniUrunler = [...products];
    yeniUrunler[index].Quantity += 1;
    setProducts(yeniUrunler);
  };

  const adetAzalt = (index: number) => {
    const yeniUrunler = [...products];
    if (yeniUrunler[index].Quantity > 1) {
      yeniUrunler[index].Quantity -= 1;
      setProducts(yeniUrunler);
    }
  };
  const deleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((item) => item.ProductID !== productId));

    if (selectedProduct && selectedProduct.ProductID === productId) {
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    if (params) {
      setProducts([params]);
    }
  }, [params]);

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
      SaleDate: invoiceDate,
      ProductID: product.ProductID,
      SaleID: product.SaleID ?? 0, // burada opsiyonel ibaresi sonradan eklendi burda hata olursa başka bir çözüm yoluna git
      // Stok_Quantity: product.Stok_Quantity,
      Quantity: product.Quantity ?? 0,
      TotalAmount: product.Stok_Quantity * product.SalePrice,
      SaleType: paymentMethod,
    }));
    setFormData(updatedFormData);
  }, [products, invoiceDate, params]);

  useEffect(() => {
    handleList();
  }, [userID, paymentMethod]);

  const handleSave = async () => {
    try {
      const response = await updateSale(formData);
      if (response.isSuccess) {
        alert(`${t("alertMessage.updateSuccess")}`);

        // setSelectedProduct(null);
      } else {
        alert(`${t("alertMessage.updateError")}`);
      }
    } catch (error: any) {
      console.error("Registration failed: ", error);
      alert(error.message);
    }
  };

  const handleList = async () => {
    try {
      if (paymentMethod === "debt") {
        const response = await customerList(userID);
        if (response.isSuccess) {
          setCustomers(response.data);
        } else {
          alert(`${t("alertMessage.fetchError")}`);
        }
      }
    } catch (error: any) {
      console.error("Verileri getirirken hata oluştu:", error);
      alert(error.message);
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
              onBarcodeScanned={(data) => {}}
              onClose={() => setIsScannerVisible(false)}
            />
          </View>
        )}

        <View style={styles.formContainer}>
          {/* {paymentMethod === "debt" && (
            
            <View style={styles.inputGroup}>
              <Picker
                selectedValue={selectedCustomer}
                onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
              >
                {customers.map((customer, index) => (
                  <Picker.Item
                    key={index}
                    label={`${customer.ClientName} ${customer.ClientSurname}`}
                    value={customer}
                  />
                ))}
              </Picker>
            </View>
          )} */}
          {paymentMethod === "debt" && (
            <>
              <View style={{ marginBottom: 20 }}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    navigation.navigate("AddCustomer");
                  }}
                >
                  <Text style={styles.addButtonText}>
                    {t("edit_sale.addCustomer")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t("edit_sale.customerSelect")}
                </Text>
                <Picker
                  selectedValue={selectedCustomer}
                  onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
                >
                  {customers.map((customer, index) => (
                    <Picker.Item
                      key={index}
                      label={`${customer.ClientName} ${customer.ClientSurname}`}
                      value={customer}
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <View style={styles.row}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.label}>{t("edit_sale.payment_method")}</Text>
              <Picker
                selectedValue={paymentMethod}
                onValueChange={setPaymentMethod}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label={t("payment.cash")} value="Nakit" />
                <Picker.Item label={t("payment.card")} value="Kart" />
                <Picker.Item label={t("payment.transfer")} value="Havale" />
                <Picker.Item label={t("payment.debt")} value="debt" />
              </Picker>
            </View>

            <View style={styles.inputGroupHalf}>
              <Text style={styles.label}>{t("edit_sale.invoice_date")}</Text>
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
                navigation.navigate("SelectProduct", { source: "sale" })
              }
            >
              <Text style={styles.actionText}>
                {t("edit_sale.select_product")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsScannerVisible(true)}
            >
              <Text style={styles.actionText}>
                {t("edit_sale.scan_barcode")}
              </Text>
            </TouchableOpacity>
          </View>

          {products.map((item, index) => (
            <View key={item.ProductID || index} style={styles.urunCard}>
              <Text style={styles.urunTitle}>{item.ProductName}</Text>

              <View style={styles.adetRow}>
                <Text style={styles.adetLabel}>{t("edit_sale.quantity")}</Text>

                <TouchableOpacity
                  onPress={() => adetAzalt(index)}
                  style={styles.counterButton}
                >
                  <Text>-</Text>
                </TouchableOpacity>

                <Text style={styles.adet}>{item.Quantity}</Text>

                <TouchableOpacity
                  onPress={() => adetArttir(index)}
                  style={styles.counterButton}
                >
                  <Text>+</Text>
                </TouchableOpacity>

                <View style={styles.birimFiyatContainer}>
                  <Text style={styles.label}>{t("edit_sale.unit_price")}</Text>
                  <TextInput
                    style={styles.birimFiyat}
                    value={item.SalePrice.toString()}
                    editable={false}
                  />
                </View>
              </View>

              <Text style={styles.araToplam}>
                {t("edit_sale.unit_price")} {item.Quantity * item.SalePrice}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  deleteProduct(item.ProductID);
                }}
              >
                <Text style={styles.sil}>{t("edit_sale.delete")}</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              {t("edit_sale.order_summary")}
            </Text>
            <Text style={styles.genelTotal}>
              {t("edit_sale.total")} {genelToplam}
            </Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={() => handleSave()}>
        <Text style={styles.saveButtonText}>{t("edit_sale.save")}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

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
    marginBottom: 15,
  },
  inputGroupHalf: {
    flex: 1,
    marginRight: 10,
    marginBottom: 15,
  },
  label: {
    borderWidth: 1,
    borderColor: "white", // canlı mavi kenarlık
    backgroundColor: "black", // içi boş
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
    color: "white", // yazı rengi kenarlıkla uyumlu
    fontWeight: "600",
    fontSize: 14,
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
  addButton: {
    position: "absolute",
    top: 0,
    right: 0,
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

  // saveButton: {
  //   padding: 15,
  //   backgroundColor: "#ff4d4d",
  //   alignItems: "center",
  //   borderRadius: 5,
  //   marginTop: 20,
  // },

  saveButton: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    padding: 15,
    // backgroundColor: "#ff4d4d",
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
});

export default SalesEdit;
