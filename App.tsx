// App.tsx

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import "./constants/i18n/i18n";

import AppRoute from "./AppRoute";
import { SelectedProductProvider } from "./contex/selectedProductContext";
import { RaporTypeProvider } from "./contex/useRaporTypeContext";
import { FileTypeProvider } from "./contex/fileTypeContext";
import { SalesProvider } from "./contex/SalesContext";
import { SalesCancelProvider } from "./contex/salesCancelContext";
import { AlertProvider } from "./contex/AlertContext";
import { AppProvider } from "./providers/AppProvider";
// import MoneyTransferCard from './screens/MoneyTransferCard';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SalesProvider>
      <SalesCancelProvider>
        <FileTypeProvider>
          <RaporTypeProvider>
            <SelectedProductProvider>
                  <AppProvider>
                    <StatusBar style="auto" />
                    <AppRoute />
                  </AppProvider>
            </SelectedProductProvider>
          </RaporTypeProvider>
        </FileTypeProvider>
      </SalesCancelProvider>
    </SalesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
