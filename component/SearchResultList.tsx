import React from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AddProduct } from "../types/productType";

type Props = {
  data: AddProduct[];
  onSelect: (item: AddProduct) => void;
};

const SearchResultsList: React.FC<Props> = ({ data, onSelect }) => {
  const renderItem = ({ item }: { item: AddProduct }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => onSelect(item)}
    >
      <Ionicons name="cube-outline" size={22} color="#555" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.productName}>{item.ProductName}</Text>
        <Text style={styles.productId}>ID: {item.ProductID}</Text>
      </View>
      <Ionicons name="add-circle" size={26} color="#2b6ef2" />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.ProductID)}
      renderItem={renderItem}
      style={styles.list}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const styles = StyleSheet.create({
  list: { maxHeight: 250, marginTop: 8 }, // arama açılır alan boyutu
  listItem: { flexDirection: "row", alignItems: "center", padding: 8, backgroundColor: "#fff" },
  productName: { fontSize: 16, fontWeight: "600", color: "#222" },
  productId: { fontSize: 12, color: "#888" },
});

export default SearchResultsList;
