// screens/CartScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { BasketType, CartItemProps } from "../types/basketType";
import BasketCardItem from "../component/BasketCardItem";
import BasketEmptyCard from "../component/BasketEmptyCard";
import { deleteBasketItem, getBasketList, updateBasket } from "../api/basket";
import { OrderItemPostDto, OrderPostDto } from "../types/orderType";
import { addOrder } from "../api/order";

const BasketCardScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [cartItems, setCartItems] = useState<BasketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [orderItems, setOrderItems] = useState<OrderItemPostDto[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "CASH" | null>(
    null
  );

  const userId = 3;

  const handleBasketList = async () => {
    try {
      const response = await getBasketList(userId);
      if (response.isSuccess) {
        setCartItems(response.data);
      }
    } catch (error: any) {}
  };
  const handleCreateOrder = async (paymentMethod: "CARD" | "CASH") => {
    try {
      setUpdating(true);
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      const orderDto: OrderPostDto = {
        userId,
        orderNumber: `ORD-${Date.now()}`,
        totalAmount: orderItems.reduce(
          (sum, i) => sum + i.quantity * i.unitPrice,
          0
        ),
        paymentMethod,
        orderItems,
      };

      const response = await addOrder(orderDto);
      await handleDelete();
      if (paymentMethod === "CARD") {
        Alert.alert(
          "Ödeme Başarılı!",
          "Kartınızdan ödeme alınmıştır. Siparişiniz alındı."
        );
      } else {
        Alert.alert(
          "Sipariş Kasaya Gönderildi!",
          "Siparişiniz kasaya gönderildi."
        );
      }
    } catch (error) {
      console.error("Sipariş oluşturulurken hata oluştu:", error);
      Alert.alert("Hata", "Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setUpdating(false); // işlem bitti
    }
  };

  const handleDelete = async () => {
    try {
      console.log("silme methodu çağrıldı");
      await Promise.all(cartItems.map((item) => deleteBasketItem(item.id)));
      setCartItems([]);
    } catch (error) {
      console.error("Sepet temizleme hatası:", error);
      Alert.alert("Hata", "Sepet temizlenirken hata oluştu.");
    }
  };
  const handleItemDelete = async (itemId: number) => {
    try {
      const response = await deleteBasketItem(itemId);
    } catch (error) {
      console.error("Sepet temizleme hatası:", error);
      Alert.alert("Hata", "Sepet temizlenirken hata oluştu.");
    }
  };
  useEffect(() => {
    handleBasketList();
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        // setCartItems(cartItems);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Sepet yüklenirken hata:", error);
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, change: number) => {
    setUpdating(true);
    try {
      // Yeni miktarı bulalım
      let newQuantity = 0;
      const updatedItems = cartItems
        .map((item) => {
          if (item.id === itemId) {
            newQuantity = Math.max(0, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      setCartItems(updatedItems);

      if (newQuantity === 0) {
        // Miktar sıfır ise sil
        await deleteBasketItem(itemId);
      } else {
        // Miktar sıfır değilse güncelle
        await updateBasket({
          id: itemId,
          quantity: newQuantity,
        });
      }

      setUpdating(false);
    } catch (error) {
      console.error("Miktar güncellenirken hata:", error);
      setUpdating(false);
      Alert.alert("Hata", "Miktar güncellenirken bir sorun oluştu.");
    }
  };

  const removeItem = async (itemId: number) => {
    Alert.alert(
      "Ürünü Kaldır",
      "Bu ürünü sepetten kaldırmak istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Kaldır",
          style: "destructive",
          onPress: async () => {
            try {
              await handleItemDelete(itemId);
              const updatedItems = cartItems.filter(
                (item) => item.id !== itemId
              );
              setCartItems(updatedItems);
            } catch (error) {
              console.error("Ürün kaldırılırken hata:", error);
            }
          },
        },
      ]
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.unitPrice * item.quantity;
    }, 0);
  };
  const total = calculateTotal();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Sepet yükleniyor...</Text>
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
          <Text style={styles.headerTitle}>Sepetim</Text>
          <Text style={styles.headerSubtitle}>
            {cartItems.length} ürün • ₺{total.toFixed(2)}
          </Text>
        </View>

        {cartItems.length > 0 && (
          // <TouchableOpacity
          //   style={styles.clearButton}
          //   onPress={() => {
          //     Alert.alert(
          //       "Sepeti Temizle",
          //       "Sepetteki tüm ürünleri kaldırmak istediğinizden emin misiniz?",
          //       [
          //         { text: "İptal", style: "cancel" },
          //         {
          //           text: "Temizle",
          //           style: "destructive",
          //           onPress: () => {
          //             console.log("Temizle seçildi"); // Bu log çalışıyor mu kontrol et
          //             handleDelete();
          //           },
          //         },
          //       ]
          //     );
          //   }}
          // >
          //   <Ionicons name="trash-outline" size={20} color="#FF5722" />
          // </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                marginRight: 6,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Kasa Ekranı
            </Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                navigation.navigate("StaffScreen");
              }}
            >
              <Ionicons
                name="arrow-forward-outline"
                size={20}
                color="#FF5722"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {cartItems.length === 0 ? (
        <BasketEmptyCard />
      ) : (
        <>
          {/* Cart Items */}
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BasketCardItem
                item={item}
                removeItem={removeItem}
                updateQuantity={updateQuantity}
                updating={updating}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Toplam Tutar</Text>
              <Text style={styles.totalAmount}>₺{total.toFixed(2)}</Text>
            </View>

            <View style={styles.paymentButtons}>
              <TouchableOpacity
                style={styles.cardPaymentButton}
                onPress={() => handleCreateOrder("CARD")}
                disabled={updating}
              >
                <Ionicons name="card-outline" size={20} color="#fff" />
                <Text style={styles.cardPaymentText}>Kartla Öde</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cashPaymentButton}
                onPress={() => handleCreateOrder("CASH")}
                disabled={updating}
              >
                <Ionicons name="storefront-outline" size={20} color="#2E7D32" />
                <Text style={styles.cashPaymentText}>Kasaya Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
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
  clearButton: {
    padding: 8,
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
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24,
  },
  continueShoppingButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  continueShoppingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  paymentButtons: {
    flexDirection: "row",
    gap: 10,
  },
  cardPaymentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E7D32",
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
  },
  cardPaymentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cashPaymentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#2E7D32",
    paddingVertical: 13,
    borderRadius: 8,
    gap: 8,
  },
  cashPaymentText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BasketCardScreen;
