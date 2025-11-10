import { Alert } from "react-native";
import { allTotalAmount, raporList } from "../../api/rapor";
import { useState } from "react";
import { SaleList, TotalSummary } from "../../types/rapor";
import { RaporType, useRaporType } from "../../contex/useRaporTypeContext";

export const useSaleHandlers = () => {
  const { raporType, setRaporType } = useRaporType();

  const [total, setTotal] = useState<TotalSummary>({
    purchaseReturnTotal: 0,
    purchaseTotal: 0,
    saleReturnTotal: 0,
    debtSaleTotal: 0,
    saleTotal: 0,
  });
  const [array, setArray] = useState<SaleList[]>([]);
  const handleList = async (userId: number, type: RaporType) => {
    try {
      const response = await raporList(userId, type);
      if (response.isSuccess) {
        setArray(response.data);
        setRaporType(type);
      } else {
        Alert.alert("Hata", response.message);
      }
    } catch (error: any) {
      console.error("Satış listesi alınamadı: ", error);
      Alert.alert("Hata", error.message);
    }
  };
  const handleTotalAmount = async (userId: number) => {
    try {
      const response = await allTotalAmount(userId);

      if (response.isSuccess) {
        setTotal(response.data);
      } else {
        Alert.alert("Hata", response.message);
      }
    } catch (error: any) {
      console.error("Toplam satış alınamadı: ", error);
      Alert.alert("Hata", error.message);
    }
  };

  return {
    array,
    total,
    handleList,
    handleTotalAmount,
  };
};
