// Burası gerçek ürün ekleme addnew sayfamız

import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import BarCodeScanResult from "./BarcodeScannerPage";
import { Product } from "../types/productType";
import { createProduct } from "../api/product";
import { useTranslation } from "react-i18next";
import { useUser } from "../contex/useContext";

export default function AddNew() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { userId } = useUser();
  const userIdNumber = userId ? Number(userId) : 0;
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [paymentType, setPaymentType] = useState("Nakit");
  const stockTypes = ["Adet", "Kg", "Koli", "Paket", "Gram", "Litre", "Ons"];

  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("add_product.title"),
    });
  }, [navigation]);
  const [formData, setFormData] = useState<Product>({
    ProductName: "",
    BarcodeNumber: "",
    Description: "",
    SalePrice: 0,
    PurchasePrice: 0,
    Stok_Quantity: 0,
    UserID: userIdNumber,
    // SupplierID: 5,
    StockType: "",
    Created_At: new Date().toISOString(),
    Update_At: new Date().toISOString(),
  });

  const handleChange = (key: keyof Product, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveProduct = async () => {
    try {
      const response = await createProduct(formData);
      if (response.isSuccess) {
        navigation.goBack();
        alert(`${t("alertMessage.createSuccess")}`);
      } else {
        alert(`${t("alertMessage.createError")}`);
      }
    } catch (error: any) {
      console.error("Registration failed: ", error.message);
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {isScannerVisible && (
            <View style={{ height: 40, marginTop: 50, marginBottom: 90 }}>
              <BarCodeScanResult
                onBarcodeScanned={(data) => {
                  handleChange("BarcodeNumber", data);
                  // setIsScannerVisible(false);
                }}
                onClose={() => setIsScannerVisible(false)}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}> {t("add_product.barcode")}</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={t("add_product.barcode_placeholder")}
                value={formData.BarcodeNumber}
                onChangeText={(text) => handleChange("BarcodeNumber", text)}
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setIsScannerVisible(true)}
              >
                <Text style={styles.scanButtonText}>
                  {t("add_product.scan_barcode")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("add_product.product_name")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("add_product.product_name")}
              value={formData.ProductName}
              onChangeText={(text) => handleChange("ProductName", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("add_product.stock_type")}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.StockType}
                onValueChange={(itemValue) =>
                  handleChange("StockType", itemValue)
                }
              >
                <Picker.Item label={t("stockType.KG")} value="KG" />
                <Picker.Item label={t("stockType.Adet")} value="Adet" />
                <Picker.Item label={t("stockType.Koli")} value="Koli" />
                <Picker.Item label={t("stockType.Paket")} value="Paket" />
                <Picker.Item label={t("stockType.GR")} value="GR" />
                <Picker.Item label={t("stockType.Ons")} value="Ons" />
                <Picker.Item label={t("stockType.Litre")} value="Litre" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("add_product.initial_stock")}</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() =>
                  handleChange(
                    "Stok_Quantity",
                    Math.max((formData.Stok_Quantity ?? 0) - 1, 0)
                  )
                }
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.counterValueInput}
                keyboardType="numeric"
                value={formData.Stok_Quantity.toString()}
                onChangeText={(text) =>
                  handleChange("Stok_Quantity", parseInt(text) || 0)
                }
              />
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() =>
                  handleChange(
                    "Stok_Quantity",
                    Math.max((formData.Stok_Quantity ?? 0) + 1, 0)
                  )
                }
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("add_product.purchase_price")}</Text>
            <TextInput
              style={styles.input}
              placeholder="Alış Fiyatı"
              keyboardType="numeric"
              value={formData.PurchasePrice?.toString() ?? ""}
              onChangeText={(text) =>
                handleChange("PurchasePrice", parseFloat(text) || 0)
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("add_product.sale_price")}</Text>
            <TextInput
              style={styles.input}
              placeholder="Satış Fiyatı"
              keyboardType="numeric"
              value={formData.SalePrice?.toString() ?? ""}
              onChangeText={(text) =>
                handleChange("SalePrice", parseFloat(text) || 0)
              }
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveProduct}>
            <Text style={styles.saveButtonText}>{t("add_product.save")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    fontSize: 24,
    color: "#000",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  icon: {
    fontSize: 24,
    color: "#000",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  counterButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  counterButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  counterValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  counterValueInput: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
    width: 50,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
