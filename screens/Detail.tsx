import React from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";

const Detail = () => {
  const product = {
    name: "Tatlı",
    code: "8699118053156",
    purchasePrice: 30,
    salePrice: 35,
    startingStock: 5,
    remainingStock: 3,
    transactions: [
      { type: "Satış", customer: "Ahmet", amount: 2, date: "05.12.2024" },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <Text style={styles.title}>Ürün Detay</Text>

      {/* Ürün Bilgileri */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Ürün Bilgileri</Text>
        <View style={styles.row}>
          <Text style={styles.cell}>Ürün Adı:</Text>
          <Text style={styles.cell}>{product.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Ürün Kodu:</Text>
          <Text style={styles.cell}>{product.code}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Alış Fiyatı:</Text>
          <Text style={styles.cell}>{product.purchasePrice} ₺</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Satış Fiyatı:</Text>
          <Text style={styles.cell}>{product.salePrice} ₺</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Başlangıç Stoğu:</Text>
          <Text style={styles.cell}>{product.startingStock} KG</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Kalan Stok:</Text>
          <Text style={styles.cell}>{product.remainingStock} KG</Text>
        </View>
      </View>

      {/* Ürün Hareketleri */}
      <Text style={styles.sectionTitle}>Ürün Hareketleri</Text>
      <FlatList
        data={product.transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.type}</Text>
            <Text style={styles.cell}>{item.customer}</Text>
            <Text style={styles.cell}>{item.amount} KG</Text>
            <Text style={styles.cell}>{item.date}</Text>
          </View>
        )}
      />

      {/* İşlem Butonları */}
      <View style={styles.buttonContainer}>
        <Button title="Alış" onPress={() => console.log('Alış işlemi')} color="green" />
        <Button title="Satış" onPress={() => console.log('Satış işlemi')} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default Detail;
