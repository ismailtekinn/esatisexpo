import React from "react";
import { View, Text, Button, StyleSheet, FlatList, TextInput } from "react-native";

const Financial = () => {
  const summary = [
    { title: "Satışlar", amount: "70 TL", color: "green" },
    { title: "Satış İadesi", amount: "0 TL", color: "darkgray" },
    { title: "Alışlar", amount: "0 TL", color: "blue" },
    { title: "Alış İadesi", amount: "0 TL", color: "darkgray" },
    { title: "Masraflar", amount: "0 TL", color: "red" },
    { title: "Net Kar", amount: "10 TL", color: "cyan" },
  ];

  const transactions = [
    { date: "05.12.2024", description: "Ahmet - Satış (Nakit)", amount: "70 TL" },
  ];

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <View style={styles.header}>
        <Button title="←" onPress={() => console.log('Back pressed')} />
        <Text style={styles.title}>Finansal</Text>
        <Button title="🖨️" onPress={() => console.log('Print pressed')} />
      </View>

      {/* Özet Kartlar */}
      <View style={styles.summaryContainer}>
        {summary.map((item, index) => (
          <View key={index} style={[styles.card, { backgroundColor: item.color }]}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardAmount}>{item.amount}</Text>
          </View>
        ))}
      </View>

      {/* Tarih Aralığı Seçimi */}
      <View style={styles.datePickerContainer}>
        <Text>Tarih Aralığı</Text>
        <View style={styles.datePicker}>
          <TextInput
            style={styles.dateInput}
            defaultValue="2024-11-05"
            placeholder="Başlangıç Tarihi"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.dateInput}
            defaultValue="2024-12-05"
            placeholder="Bitiş Tarihi"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* İşlem Tablosu */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>İşlemler</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.date}</Text>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.amount}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "30%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: "white",
  },
  cardAmount: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "48%",
    marginBottom: 10,
    borderRadius: 5,
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    fontSize: 16,
    textAlign: "left",
    flex: 1,
  },
});

export default Financial;
