import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Order } from "../types/staffType";

interface StaffOrderCardProps {
  order: Order;
  onDeliver: (orderId: number) => void;
}

const StaffOrderCard: React.FC<StaffOrderCardProps> = ({ order, onDeliver }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderTime}>{formatTime(order.createdAt)}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: "#FF9800" }]}>
          <Text style={styles.statusText}>Bekliyor</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.orderItems.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>
              {item.quantity}x {item.productName}
            </Text>
            <Text style={styles.itemPrice}>
              ₺{(item.quantity * item.unitPrice).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>
          Toplam: ₺{order.totalAmount.toFixed(2)}
        </Text>
        <Text style={styles.paymentMethod}>
          {order.paymentMethod === "CASH" ? "NAKİT" : "KART"}
        </Text>
      </View>

      <View style={styles.orderActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDeliver(order.id)}
        >
          <Text style={styles.actionButtonText}>Teslim Et</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#2E7D32",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  orderItems: {
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  itemName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    marginBottom: 15,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  paymentMethod: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  orderActions: {
    flexDirection: "row",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default StaffOrderCard;
