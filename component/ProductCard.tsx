import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types/productListType";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <View style={styles.productCard}>
    <Image
      source={{ uri: product.imageUrl }}
      style={styles.productImage}
      resizeMode="cover"
    />

    <View style={styles.productInfo}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>

      <View style={styles.productFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>₺{product.price.toFixed(2)}</Text>
          <Text style={styles.stockInfo}>Stok: {product.stockQuantity}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            product.stockQuantity === 0 && styles.addButtonDisabled,
          ]}
          onPress={() => onAddToCart(product)}
          disabled={product.stockQuantity === 0}
          activeOpacity={0.8}
        >
          <Ionicons
            name="add"
            size={20}
            color={product.stockQuantity === 0 ? "#999" : "#fff"}
          />
          <Text
            style={[
              styles.addButtonText,
              product.stockQuantity === 0 && styles.addButtonTextDisabled,
            ]}
          >
            {product.stockQuantity === 0 ? "Tükendi" : "Sepete Ekle"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
});

export default ProductCard;



