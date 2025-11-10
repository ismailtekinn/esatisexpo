import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { OrderStatus } from "../types/enums/staff";
import { Order, OrderCardProps } from "../types/staffType";
import StaffOrderCard from "../component/StaffOrderCard";
import { getOrderList } from "../api/order";

const StaffScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // const handleOrderList = async () => {
  //   try {
  //     const response = await getOrderList();
  //     console.log("Sipariş Listesi:", JSON.stringify(response.data, null, 2));
  //   } catch (error: any) {}
  // };

  const handleOrderList = async () => {
    try {
      const response = await getOrderList();

      const orders: Order[] = response.data.map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt), // string → Date
      }));

      setOrders(orders); // şimdi tip hatası olmaz
    } catch (error: any) {
      console.error("Sipariş listesi alınamadı", error);
    }
  };


  // console.log("Order ekrana yazdırılıyor: ",orders)
  const mockOrders: Order[] = [
    {
      id: 1,
      orderNumber: "ORD-1640995200000",
      totalAmount: 63.0,
      paymentMethod: "CASH",
      status: "PENDING",
      createdAt: new Date(),
      orderItems: [
        { productName: "Türk Kahvesi", quantity: 2, unitPrice: 15.0 },
        { productName: "Cappuccino", quantity: 1, unitPrice: 22.0 },
        { productName: "Mocha", quantity: 1, unitPrice: 26.0 },
      ],
    },
    {
      id: 2,
      orderNumber: "ORD-1640995260000",
      totalAmount: 40.0,
      paymentMethod: "CASH",
      status: "PREPARING",
      createdAt: new Date(Date.now() - 5 * 60000), // 5 dakika önce
      orderItems: [
        { productName: "Americano", quantity: 1, unitPrice: 18.0 },
        { productName: "Latte", quantity: 1, unitPrice: 22.0 },
      ],
    },
    {
      id: 3,
      orderNumber: "ORD-1640995320000",
      totalAmount: 89.0,
      paymentMethod: "CARD",
      status: "READY",
      createdAt: new Date(Date.now() - 10 * 60000), // 10 dakika önce
      orderItems: [
        { productName: "Hamburger Menü", quantity: 2, unitPrice: 35.0 },
        { productName: "Cola", quantity: 1, unitPrice: 8.0 },
        { productName: "Patates Kızartması", quantity: 1, unitPrice: 11.0 },
      ],
    },
  ];

  const deliverOrder = (orderId: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };
  useEffect(() => {
    loadOrders();
    handleOrderList();

    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      // setOrders(mockOrders);
      setRefreshing(false);
    } catch (error) {
      console.error("Siparişler yüklenirken hata:", error);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      Alert.alert("Hata", "Sipariş durumu güncellenirken hata oluştu.");
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //   const OrderCard: React.FC<OrderCardProps> = ({ order }) => (
  //     <View style={styles.orderCard}>
  //       <View style={styles.orderHeader}>
  //         <View style={styles.orderInfo}>
  //           <Text style={styles.orderNumber}>{order.orderNumber}</Text>
  //           <Text style={styles.orderTime}>{formatTime(order.createdAt)}</Text>
  //         </View>

  //         <View style={[styles.statusBadge, { backgroundColor: "#FF9800" }]}>
  //           <Text style={styles.statusText}>Bekliyor</Text>
  //         </View>
  //       </View>

  //       <View style={styles.orderItems}>
  //         {order.orderItems.map((item, index) => (
  //           <View key={index} style={styles.orderItem}>
  //             <Text style={styles.itemName}>
  //               {item.quantity}x {item.productName}
  //             </Text>
  //             <Text style={styles.itemPrice}>
  //               ₺{(item.quantity * item.unitPrice).toFixed(2)}
  //             </Text>
  //           </View>
  //         ))}
  //       </View>

  //       <View style={styles.orderFooter}>
  //         <Text style={styles.orderTotal}>
  //           Toplam: ₺{order.totalAmount.toFixed(2)}
  //         </Text>
  //         <Text style={styles.paymentMethod}>
  //           {order.paymentMethod === "CASH" ? "NAKİT" : "KART"}
  //         </Text>
  //       </View>

  //       <View style={styles.orderActions}>
  //         <TouchableOpacity
  //           style={styles.actionButton}
  //           onPress={() =>
  //             setOrders((prev) => prev.filter((o) => o.id !== order.id))
  //           }
  //         >
  //           <Text style={styles.actionButtonText}>Teslim Et</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );

  const EmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Sipariş Yok</Text>
      <Text style={styles.emptySubtitle}>
        Henüz bekleyen sipariş bulunmuyor.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Kasa Paneli</Text>
          <Text style={styles.headerSubtitle}>
            {orders.length} aktif sipariş
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => {
            setRefreshing(true);
            loadOrders();
          }}
        >
          <Ionicons name="refresh" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StaffOrderCard order={item} onDeliver={deliverOrder} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<EmptyOrders />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadOrders();
            }}
            colors={["#2E7D32"]}
          />
        }
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  listContainer: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  readyButton: {
    backgroundColor: "#4CAF50",
  },
  completeButton: {
    backgroundColor: "#FF9800",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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

export default StaffScreen;
