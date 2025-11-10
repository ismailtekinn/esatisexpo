import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Product } from "../types/productListType";
import ProductCard from "../component/ProductCard";
import { getProductList } from "../api/product";
import { addBasket } from "../api/basket";
import { AddBasket } from "../types/basketType";

interface ProductCardProps {
  product: Product;
}

const ProductListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { categoryId, categoryName } = route.params as {
    categoryId: number;
    categoryName: string;
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [basketItem, setBasketItem] = useState<AddBasket>({
    userId: 3,
    productId: 0,
    quantity: 1,
    unitPrice: 0,
  });
  const handleProductList = async () => {
    try {
      const response = await getProductList(categoryId);
      if (response.isSuccess) {
        setProducts(response.data);
      }
    } catch (error: any) {}
  };

  // const handleAddBasket = async () => {
  //   try {
  //     const response = await addBasket(basketItem);
  //     if(response.isSuccess){
  //      Alert.alert("Bilgi", response.message);
  //     }else{
  //       Alert.alert("Bilgi", response.message);
  //     }
  //   } catch (error: any) {

  //   }
  // };
  const handleAddBasket = async (item: AddBasket) => {
    try {
      const response = await addBasket(item);
      if (response.isSuccess) {
        Alert.alert("Bilgi", response.message);
      } else {
        Alert.alert("Bilgi", response.message);
      }
    } catch (error: any) {
      Alert.alert("Hata", "Sepete ekleme sırasında hata oluştu.");
    }
  };

  useEffect(() => {
    loadProducts();
    loadCartItemCount();
    handleProductList();
  }, [categoryId]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Ürünler yüklenirken hata:", error);
      setLoading(false);
    }
  };

  const loadCartItemCount = async () => {
    setCartItemCount(3);
  };

  // const addToCart = async (product: Product) => {
  //   try {
  //     setBasketItem({
  //       userId: 3,
  //       productId: product.id,
  //       quantity: 1,
  //       unitPrice: product.price,
  //     });
  //     handleAddBasket()
  //     setCartItemCount((prev) => prev + 1);
  //   } catch (error) {
  //     Alert.alert("Hata", "Ürün sepete eklenirken bir hata oluştu.");
  //   }
  // };

  const addToCart = async (product: Product) => {
    try {
      const newBasketItem = {
        userId: 3,
        productId: product.id,
        quantity: 1,
        unitPrice: product.price,
      };
      setBasketItem(newBasketItem); // İstersen state'i yine güncelle
      await handleAddBasket(newBasketItem); // Yeni objeyi parametre olarak ver
      setCartItemCount((prev) => prev + 1);
    } catch (error) {
      Alert.alert("Hata", "Ürün sepete eklenirken bir hata oluştu.");
    }
  };
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cafe-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Ürün Bulunamadı</Text>
      <Text style={styles.emptySubtitle}>
        Bu kategoride henüz ürün bulunmuyor.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          {/* <Text style={styles.headerSubtitle}>{products.length} ürün</Text> */}
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("BasketCardScreen")}
        >
          {/* <Ionicons name="basket-outline" size={24} color="#333" /> */}
          {/* {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )} */}
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard product={item} onAddToCart={addToCart} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<EmptyState />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  cartButton: {
    position: "relative",
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF5722",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 20,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: 15,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceContainer: {
    flex: 1,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  stockInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
  },
  addButtonDisabled: {
    backgroundColor: "#e9ecef",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  addButtonTextDisabled: {
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 40,
  },
});

export default ProductListScreen;
