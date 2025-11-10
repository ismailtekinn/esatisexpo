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
import { useTranslation } from "react-i18next";
import { useUser } from "../contex/useContext";

const SelectProduct = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { setSelectedProduct } = useSelectedProduct();
  const route = useRoute();
  const { source } = route.params as { source: string };

  const { userId } = useUser();
  const userIdNumber = userId ? Number(userId) : 0;
  const userID = userIdNumber;
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<AddProduct[]>([]);
  const filteredProducts = products.filter((product) =>
    product.ProductName.toLowerCase().includes(search.toLowerCase())
  );
    const { t } = useTranslation();

    useLayoutEffect(() => {
      navigation.setOptions({
        title: t("select_product.pageTitle"),
      });
    }, [navigation]);
  useEffect(() => {
    handleProductAllList();
  }, [userID]);

  const onProductPress = (product: MinimalProduct) => {
    const productWithQuantityOne = { ...product, Stok_Quantity: 1 };
    setSelectedProduct(productWithQuantityOne);
    // navigation.navigate("NewSale");
    if (source === "sale") {
      navigation.navigate("NewSale");
    } else if (source === "purchase") {
      navigation.navigate("PurchaseForm");
    } else if (source === "return") {
      navigation.navigate("ReturnProduct");
    }
  };
  const handleProductAllList = async () => {
    try {
      const response = await getProductList(userID);
      if (response.isSuccess) {
        setProducts(response.data);
      } else {
        alert("Bir hata oluştu: " + response.message);
      }
    } catch (error: any) {
      console.error("Ürünleri getirirken hata oluştu:", error);
      alert("Bir hata oluştu: " + error.message);
    }
  };

  const renderProduct = ({ item }: { item: MinimalProduct }) => (
    <TouchableOpacity onPress={() => onProductPress(item)}>
      <View style={styles.productContainer}>
        <View style={styles.productInfo}>
          <View style={styles.productIcon}>
            <Text>📦</Text>
          </View>
          <Text style={styles.productName}>{item.ProductName}</Text>
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
      {/* Arama Çubuğu */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t("select_product.search_placeholder")}
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddNew")}
      >
        <Text style={styles.addButtonText}>+ {t("select_product.pageTitle")}</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredProducts}
        // keyExtractor={(item) => item.ProductName.toString()}
        keyExtractor={(item) => item?.ProductName?.toString?.() ?? Math.random().toString()}
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
});

export default SelectProduct;
