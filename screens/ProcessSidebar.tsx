import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from "../contex/useContext";

export type RootStackParamList = {
  AccountInfoForm: undefined;
  Clock: undefined;
  Language: undefined;
  Help: undefined;
  Detail: undefined;
  Financial :undefined;
  NewSale :undefined;
  ProductEdit :undefined;
  ProductList :undefined;
 Debt :undefined;
 DeleteDebt:undefined;
 SalesEdit:undefined;
 MainPage:undefined;
 PurchaseForm:undefined;
 AddNew:undefined;
 SelectProduct:undefined;
 BarcodeScannerPage:undefined;

};

export interface ProcessSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ProcessSidebar: React.FC<ProcessSidebarProps> = ({
  isSidebarOpen,
  toggleSidebar,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {handleLogout,userData,userId} = useUser()


  if (!isSidebarOpen) return null;

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "/profilresmi.jpg" }} // Profil resminin doğru yolunu kontrol et
          style={styles.profileImage}
        />
      </View>

      <View style={styles.menu}>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SelectProduct')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>SelectProduct</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProductList')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>ProductList</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AddNew')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>AddNew</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Detail')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>Detail</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Financial')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>Financial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('NewSale')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>NewSale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProductEdit')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>ProductEdit.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProductList')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>ProductList.</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Debt')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>Debt.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DeleteDebt')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>DeleteDebt.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SalesEdit')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>SalesEdit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MainPage')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>MainPage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PurchaseForm')}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text style={styles.menuText}>PurchaseForm</Text>
        </TouchableOpacity>


      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "45%",
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  menu: {
    marginTop: 0,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default ProcessSidebar;
