import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

const BasketEmptyCard: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="basket-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Sepetiniz Boş</Text>
      <Text style={styles.emptySubtitle}>
        Kategorilerden ürün seçerek sepetinizi doldurun.
      </Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.continueShoppingText}>Alışverişe Devam Et</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default BasketEmptyCard;
