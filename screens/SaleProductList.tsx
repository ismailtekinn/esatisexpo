import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { AddProduct, MinimalProduct, Product } from "../types/productType";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { getProductList } from "../api/product";
import { useSelectedProduct } from "../contex/selectedProductContext";
import { RootStackParamList } from "../types";
import { saleAllList } from "../api/sale";
import { SaleAllList } from "../types/saleType";
import { useUser } from "../contex/useContext";
import { useTranslation } from "react-i18next";


const SaleProductList = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { setSelectedProduct } = useSelectedProduct();
  const { userId } = useUser();
  const userIdNumber = userId ? Number(userId) : 0;
  const userID = userIdNumber;
  const [search, setSearch] = useState("");
  const [saleProduct, setSaleProducts] = useState<SaleAllList[]>([]);
  const filteredProducts = saleProduct.filter((product) =>
    product.ProductName.toLowerCase().includes(search.toLowerCase())
  );

    const { t } = useTranslation();
  
    useLayoutEffect(() => {
      navigation.setOptions({
        title: t("sale_product_list.pageTitle"),
      });
    }, [navigation]);

  useEffect(() => {
    handleSaleAllList();
  }, [userID]);

  const onProductPress = (product: MinimalProduct) => {
    const productWithQuantityOne = { ...product, Stok_Quantity: 1 };
    setSelectedProduct(productWithQuantityOne);
    navigation.navigate("ReturnProduct");
  };
  const handleSaleAllList = async () => {
    try {
      const response = await saleAllList(userID);
      if (response.isSuccess) {
        setSaleProducts(response.data);
      } else {
        alert(`${t("alertMessage.createError")} ${response.message}`);
      }
    } catch (error: any) {
      console.error("Ürünleri getirirken hata oluştu:", error);
     alert(error.message);
    }
  };

  const renderProduct = ({ item }: { item: MinimalProduct }) => (
    <TouchableOpacity onPress={() => onProductPress(item)}>
      <View style={styles.productContainer}>
        <View style={styles.productInfo}>
          <View style={styles.productIcon}>
            <Text>📦</Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.productName}>{item.ProductName}</Text>
            <Text style={styles.saleDate}>
              {t("sale_product_list.sale_date")} {" "}
              {new Date(item.SaleDate).toLocaleDateString("tr-TR")}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.quantityBox,
            {
              backgroundColor: item.Stok_Quantity === 0 ? "#ffcccc" : "#f8f9fa",
            },
          ]}
        >
          <Text
            style={{ color: item.Stok_Quantity === 0 ? "#ff0000" : "#000" }}
          >
            {item.Stok_Quantity}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Ara"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddNew")}
      >
        <Text style={styles.addButtonText}>+ {t("sale_product_list.add_product")}</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => `${item.ProductID}_${index}`}
        renderItem={renderProduct}
        style={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 8,
    fontSize: 16,
  },
  clearText: {
    fontSize: 18,
    color: "#555",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  productList: {
    marginTop: 8,
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  productName: {
    fontSize: 16,
  },
  quantityBox: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saleDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});

export default SaleProductList;
