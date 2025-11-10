import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BasketType } from "../types/basketType";

interface BasketCardItemProps {
  item: BasketType;
  updating: boolean;
  updateQuantity: (itemId: number, change: number) => void;
  removeItem: (itemId: number) => void;
}

const BasketCardItem: React.FC<BasketCardItemProps> = ({
  item,
  updating,
  updateQuantity,
  removeItem,
}) => {
  return (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.product.imageUrl }}
        style={styles.itemImage}
        resizeMode="cover"
      />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemDescription}>{item.product.description}</Text>
        <Text style={styles.itemPrice}>₺{item.unitPrice.toFixed(2)}</Text>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#FF5722" />
        </TouchableOpacity>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, -1)}
            disabled={updating}
          >
            <Ionicons name="remove" size={16} color="#666" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, 1)}
            disabled={updating}
          >
            <Ionicons name="add" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.itemTotal}>
          ₺{(item.unitPrice * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
    marginTop: 8,
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: 10,
  },
  removeButton: {
    padding: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default BasketCardItem;
