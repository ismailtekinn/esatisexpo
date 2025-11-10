import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSaleHandlers } from "../hooks/rapor/useSaleHandlers";
import { renderComponentMap, saleList } from "../component/RaporList";
import { useRaporType } from "../contex/useRaporTypeContext";
import { ReportType } from "../types/enums/rapor";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useTranslation } from "react-i18next";
import { useUser } from "../contex/useContext";

const Rapor = () => {
  const { userId } = useUser();
  const userIdNumber = userId ? Number(userId) : 0;
  const userID = userIdNumber;
  const { array, total, handleList, handleTotalAmount } = useSaleHandlers();
  const { raporType, setRaporType } = useRaporType();
  const [selected, setSelected] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("report.pageTitle"),
    });
  }, [navigation]);

  const summaryItems = [
    {
      key: ReportType.standard,
      label: t("report.sale"),
      value: total?.saleTotal,
      bgColor: "#28a745",
    },
    {
      key: ReportType.customer,
      label: t("report.customer_return"),
      value: total?.saleReturnTotal,
      bgColor: "#343a40",
    },
    {
      key: ReportType.debt,
      label: t("report.debt"),
      value: total?.debtSaleTotal,
      bgColor: "#dc3545",
    },
    {
      key: ReportType.purchase,
      label: t("report.purchase"),
      value: total?.purchaseTotal,
      bgColor: "#007bff",
    },
    {
      key: ReportType.supplier,
      label: t("report.supplier_return"),
      value: total?.purchaseReturnTotal,
      bgColor: "#343a40",
    },
  ];

  useEffect(() => {
    handleTotalAmount(userID);
    handleList(userID, "standard");
  }, [userID]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity></TouchableOpacity>
        <Text style={styles.title}>{t("report.all_transactions")}</Text>
        <Ionicons name="print-outline" size={24} color="black" />
      </View>
      <View style={styles.summaryContainer}>
        {summaryItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => {
              handleList(userID, item.key);
              setSelected(item.key);
            }}
            style={[
              styles.summaryBox,
              { backgroundColor: item.bgColor },
              selected === item.key && { borderWidth: 2, borderColor: "#fff" }, 
            ]}
          >
            <Text style={styles.summaryLabel}>{item.label}</Text>
            <Text style={styles.summaryValue}>{item.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.listHeader}>
        <Text style={[styles.columnHeader, styles.columnLeft]}>
          {t("report.date")}
        </Text>
        <Text style={[styles.columnHeader, styles.columnCenter]}>
          {t("report.transaction")}
        </Text>
        <Text style={[styles.columnHeader, styles.columnCenter]}>
             {t("report.stokType")}
        </Text>
        <Text style={[styles.columnHeader, styles.columnRight]}>
          {t("report.price")}
        </Text>
      </View>
      <FlatList
        data={array}
        renderItem={({ item }) => {
          const Component = renderComponentMap[raporType];
          return <Component item={item} />;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  summaryBox: {
    width: "32%",
    padding: 12,
    borderRadius: 8,
    marginLeft: "1%",
    marginVertical: 5,
  },
  selectedSummaryBox: {
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  summaryLabel: { color: "#fff", fontWeight: "bold" },
  summaryValue: { color: "#fff", fontSize: 16, marginTop: 5 },

  listHeader: {
    flexDirection: "row",
    backgroundColor: "#dee2e6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  columnHeader: {
    fontWeight: "bold",
    fontSize: 16,
  },

  columnLeft: {
    flex: 1,
    textAlign: "left",
  },

  columnCenter: {
    flex: 1,
    textAlign: "center",
  },

  columnRight: {
    flex: 1,
    textAlign: "right",
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  listText: { flex: 1 },
  listTextBold: { fontWeight: "bold" },
  listTextSmall: { color: "#6c757d", fontSize: 12 },
});

export default Rapor;
