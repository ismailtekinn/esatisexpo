import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../types";
import { SaleEditProdcut } from "../types/saleType";

export const saleList = ({
  item,
}: {
  item: {
    ProductName: string;
    StockType: string;
    SalePrice: number;
    Quantity: number;
    SaleDate: string | Date;
  };
}) => (
  <View style={styles.itemRow}>
    <Text style={styles.dateCell}>
      {new Date(item.SaleDate).toLocaleString("tr-TR")}
    </Text>

    <Text style={styles.productCell} numberOfLines={1} ellipsizeMode="tail">
      {item.ProductName}
    </Text>

    <Text style={styles.quantityCell}>
      {item.Quantity} {item.StockType}
    </Text>

    <Text style={styles.priceCell}>{item.SalePrice}</Text>
  </View>
);
export const purchaseList = ({
  item,
}: {
  item: {
    ProductName: string;
    SalePrice: number;
    Quantity: number;
    StockType: string;
    Purchase_date: string | Date;
  };
}) => (
  <View style={styles.itemRow}>
    <Text style={styles.dateCell}>
      {new Date(item.Purchase_date).toLocaleString("tr-TR")}
    </Text>

    <Text style={styles.productCell} numberOfLines={1} ellipsizeMode="tail">
      {item.ProductName}
    </Text>

    <Text style={styles.quantityCell}>
      {item.Quantity} {item.StockType}
    </Text>

    <Text style={styles.priceCell}>{item.SalePrice}</Text>
  </View>
);

const supplierReturnList = ({
  item,
}: {
  item: {
    ProductID: number;
    ProductName: string;
    SalePrice: number;
    StockType: string;
    Quantity: number;
    ReturnDate: string | Date;
    SupplierName: string;
    SupplierSurname: string;
  };
}) => (
  <View style={styles.itemRow}>
    <Text style={styles.dateCell}>
      {new Date(item.ReturnDate).toLocaleString("tr-TR")}
    </Text>

    <View style={styles.productCell}>
      <Text style={styles.productCell} numberOfLines={1} ellipsizeMode="tail">
        {item.ProductName}
      </Text>
      <Text style={styles.supplierInfo}>
        {item.SupplierName} {item.SupplierSurname}
      </Text>
    </View>

    <Text style={styles.quantityCell}>
      {item.Quantity} {item.StockType}
    </Text>

    <Text style={styles.priceCell}>{item.SalePrice}</Text>
  </View>
);

const customerReturnList = ({
  item,
}: {
  item: {
    ProductID: number;
    ProductName: string;
    SalePrice: number;
    Quantity: number;
    StockType: string;
    ReturnDate: string | Date;
    ClientName: string;
    ClientSurname: string;
  };
}) => (
  <View style={styles.itemRow}>
    <Text style={styles.dateCell}>
      {new Date(item.ReturnDate).toLocaleString("tr-TR")}
    </Text>

    <View style={styles.productCell}>
      <Text style={styles.productCell} numberOfLines={1} ellipsizeMode="tail">
        {item.ProductName}
      </Text>
      <Text style={styles.supplierInfo}>
        {item.ClientName} {item.ClientSurname}
      </Text>
    </View>

    <Text style={styles.quantityCell}>
      {item.Quantity} {item.StockType}
    </Text>

    <Text style={styles.priceCell}>{item.SalePrice}</Text>
  </View>
);

export const DebtList = ({ item }: { item: SaleEditProdcut }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate("SalesEdit", item);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.itemRow}>
        <Text style={styles.dateCell}>
          {new Date(item.SaleDate).toLocaleString("tr-TR")}
        </Text>

        <View style={styles.productCell}>
          <Text
            style={styles.productCell}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.ProductName}
          </Text>
          <Text style={styles.supplierInfo}>
            {item.ClientName} {item.ClientSurname}
          </Text>
        </View>
        <Text style={styles.quantityCell}>
          {item.Quantity} {item.StockType}
        </Text>

        <Text style={styles.priceCell}>{item.SalePrice}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center", // istersen ortalayabilirsin: 'center'
    fontSize: 12,
    color: "#333",
  },

  productName: {
    fontSize: 14,
    fontWeight: "bold",
  },

  supplierInfo: {
    fontSize: 10,
    textAlign: "center",

    color: "gray",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  dateCell: {
    flex: 2,
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },

  productCell: {
    flex: 4,
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    paddingHorizontal: 5,
  },

  quantityCell: {
    flex: 2,
    fontSize: 13,
    color: "#333",
    textAlign: "left",
  },

  priceCell: {
    flex: 2,
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
});

export const renderComponentMap: Record<
  string,
  ({ item }: any) => JSX.Element
> = {
  standard: saleList,
  purchase: purchaseList,
  supplier: supplierReturnList,
  customer: customerReturnList,
  debt: DebtList,
};
