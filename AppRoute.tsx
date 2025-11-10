import React, { useContext, useEffect, useRef, useState } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Help from "./screens/Help";
import ScrollableListScreen from "./screens/ScrolView";
import LoginScreen from "./screens/Login";
import MainPage from "./screens/MainPage";
import PurchaseForm from "./screens/PurchaseForm";
import NewSale from "./screens/NewSale";
import ReturnProduct from "./screens/ReturnProduct";
import ProductList from "./screens/ProductListScreen";
import AddNew from "./screens/AddNew";
import SelectProduct from "./screens/SelectProduct";
import AddCustomer from "./screens/AddCustomer";
import CustomerSelect from "./screens/CustomerSelect";
import Rapor from "./screens/Rapor";
import SaleProductList from "./screens/SaleProductList";
import AddSupplier from "./screens/AddSupplier";
import SalesEdit from "./screens/SalesEdit";
import AdminPage from "./screens/AdminPage";
import HomeScreen from "./screens/HomeScreen";
import ProductListScreen from "./screens/ProductListScreen";
import BasketCardScreen from "./screens/BasketCardScreen";
import StaffScreen from "./screens/StaffScreen";
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import SalesScreen from "./screens/SalesScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CustomerSearchScreen from "./screens/CustomerSearchScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { useKullanici } from "./contex/kullaniciContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAutoLogin } from "./contex/settings/autoLoginContext";
import { login } from "./api/auth";
import TriaSplashScreen from "./screens/TriaSplashScreen";
import { AutoLoginOption } from "./types/enums/settings";
import { BackendResponse } from "./types/apiresponse/newGenericResponseType";
import BarcodeReadScreen from "./screens/BarcodeReadScreen";
import ProductBarcodeReadList from "./screens/ProductBarcodeReadList";
import ProductBarcodeReadListScreen from "./screens/ProductBarcodeReadListScreen";

const Stack = createStackNavigator();

const AppRoute: React.FC = () => {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const { userData, setUserData } = useKullanici();
  const { handleLogin } = useKullanici();
  const [isReady, setIsReady] = useState(false);
  const [isAutoLogin, setIsAutoLogin] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState(true);
  const [shouldShowMainPages, setShouldShowMainPages] = useState(false);

  const renderCount = useRef(0);

  // const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // const tryAutoLogin = async () => {
  //   setIsCheckingAuth(true);

  //   const storedAutoLogin = await AsyncStorage.getItem("autoLogin");
  //   console.log("autologin console yazdırılıyor:", storedAutoLogin);
  //   setIsAutoLogin(storedAutoLogin === AutoLoginOption.Evet.toString());
  //   if (userData) {
  //     setIsCheckingAuth(false);
  //     setIsReady(true);
  //     return;
  //   }
  //   if (!isAutoLogin) {
  //     setUserData(undefined);
  //     await AsyncStorage.setItem("userData", "");
  //   }

  //   if (isAutoLogin) {
  //     const storedUsername = await AsyncStorage.getItem("username");
  //     const storedPassword = await AsyncStorage.getItem("password");

  //     if (isAutoLogin && storedUsername && storedPassword) {
  //       try {
  //         const response = await login({
  //           KullaniciKodu: storedUsername,
  //           Sifre: storedPassword,
  //         });
  //         await handleLogin(response);
  //         // setUserData(undefined);
  //       } catch (err) {
  //         console.error("Otomatik login hatası:", err);
  //         setUserData(undefined);
  //       }
  //     }
  //   }
  //   setIsCheckingAuth(false);
  //   setIsReady(true);
  // };

  const tryAutoLogin = async () => {
    try {
      const storedAutoLogin = await AsyncStorage.getItem("autoLogin");

      const storedUsername = await AsyncStorage.getItem("username");
      const storedPassword = await AsyncStorage.getItem("password");
      if ((!storedUsername || !storedPassword) && !!userData) {
        console.error("Kullanıcı adı veya şifre bulunamadı!");
        return;
      }

      if (
        storedAutoLogin === AutoLoginOption.Evet.toString() &&
        storedUsername &&
        storedPassword
      ) {
        const response = await login({
          KullaniciKodu: storedUsername,
          Sifre: storedPassword,
        });
        await handleLogin(response);
      } else {
        setUserData(undefined);
        await AsyncStorage.setItem("userData", "");
      }
    } catch (err) {
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    tryAutoLogin();
  }, []); // userData'yı dependency'den kaldırdım

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000); // 2 saniye

    return () => clearTimeout(timer);
  }, []);

  if (!isReady || showSplash) {
    return <TriaSplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
        <Stack.Navigator screenOptions={{ animationEnabled: true }}>
          {/* {userData ? (
            <> */}
          <Stack.Screen
            name="BarcodeReadScreen"
            component={BarcodeReadScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductBarcodeReadList"
            component={ProductBarcodeReadListScreen} // sadece bir “wrapper” component
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SalesScreen"
            component={SalesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainPage"
            component={MainPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StaffScreen"
            component={StaffScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductListScreen"
            component={ProductListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TriaSplashScreen"
            component={TriaSplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BasketCardScreen"
            component={BasketCardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="PurchaseForm" component={PurchaseForm} />
          <Stack.Screen name="NewSale" component={NewSale} />
          <Stack.Screen name="SalesEdit" component={SalesEdit} />
          <Stack.Screen name="ReturnProduct" component={ReturnProduct} />
          <Stack.Screen name="SelectProduct" component={SelectProduct} />
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen name="AddNew" component={AddNew} />
          <Stack.Screen name="AddCustomer" component={AddCustomer} />
          <Stack.Screen name="AddSuplier" component={AddSupplier} />
          <Stack.Screen name="Rapor" component={Rapor} />
          <Stack.Screen name="SaleProductList" component={SaleProductList} />
          <Stack.Screen
            name="ScrollableListScreen"
            component={ScrollableListScreen}
          />
          <Stack.Screen
            name="CustomerSearchScreen"
            component={CustomerSearchScreen}
            options={{ headerShown: false }}
          />
          {/* </> */}
          {/* ) : ( */}
          {/* <>
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
            </> */}
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});

export default AppRoute;
