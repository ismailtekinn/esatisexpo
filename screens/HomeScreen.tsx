import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { Category } from "../types/categoryType";
import { getProductList } from "../api/product";
import { getCategoryList } from "../api/category";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<Category[]>([]);
  const handleCategoryList = async () => {
    try {
      const response = await getCategoryList();
      if(response.isSuccess){
        setCategories(response.data)
      }
    } catch (error: any) {}
  };
  useEffect(() => {
    handleCategoryList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>Café Menu</Text>
          <Text style={styles.appSubtitle}>Lezzetli anlar</Text>
        </View>

        {/* <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("BasketCardScreen")}
        >
          <Ionicons name="basket-outline" size={24} color="#333" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
        </TouchableOpacity> */}
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Kategoriler</Text>
        <Text style={styles.welcomeSubtitle}>Sevdiğiniz kategoriyi seçin</Text>
      </View>

      {/* Categories Grid */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              activeOpacity={0.8}
              //   onPress={() => handleCategoryPress(category)}
              onPress={() =>
                navigation.navigate("ProductListScreen", {
                  categoryId: category.id,
                  categoryName: category.name,
                })
              }
            >
              <Image
                source={{ uri: category.image }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <View style={styles.categoryOverlay}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
                <View style={styles.productCountBadge}>
                  <Text style={styles.productCountText}>
                    {category.productCount} ürün
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("BasketCardScreen")}
        >
          <Ionicons name="basket" size={20} color="#fff" />
          <Text style={styles.quickActionText}>Sepetim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickActionButton, styles.quickActionSecondary]}
        >
          <Ionicons name="receipt" size={20} color="#2E7D32" />
          <Text
            style={[styles.quickActionText, styles.quickActionTextSecondary]}
          >
            Siparişlerim
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  appSubtitle: {
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
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: (width - 50) / 2,
    height: 180,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryImage: {
    width: "100%",
    height: "70%",
  },
  categoryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
  },
  categoryName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryDescription: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  productCountBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 5,
  },
  productCountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quickActionSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  quickActionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  quickActionTextSecondary: {
    color: "#2E7D32",
  },
});

export default HomeScreen;
