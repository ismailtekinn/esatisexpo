import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addCustomer } from "../api/customer";
import { addSupplier } from "../api/suplier";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useTranslation } from "react-i18next";

type FormField = keyof typeof initialFormData;

const initialFormData = {
  SupplierName: "",
  SupplierSurname: "",
  Phone: "",
  Address: "",
  UserID: 1,
};

const AddSupplier = () => {
  const [formData, setFormData] = useState(initialFormData);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("addSupplier.pageTitle"),
    });
  }, [navigation]);

  const handleSave = async () => {
    try {
      const response = await addSupplier(formData);
      if (response.isSuccess) {
        navigation.goBack();
      } else {
        alert(`${t("alertMessage.createError")}`);
      }
    } catch (error: any) {
      console.error("Registration failed: ", error);
      alert(error.message);
    }
  };

  const handleChange = (key: FormField, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}> {t("addSupplier.SupplierName")}</Text>
        <TextInput
          style={styles.input}
          value={formData.SupplierName}
          onChangeText={(text) => handleChange("SupplierName", text)}
          placeholder={t("addSupplier.SupplierName")}
        />
        <Text style={styles.label}>{t("addSupplier.SupplierSurname")}</Text>
        <TextInput
          style={styles.input}
          value={formData.SupplierSurname}
          onChangeText={(text) => handleChange("SupplierSurname", text)}
          placeholder={t("addSupplier.SupplierSurname")}
        />

        <Text style={styles.label}>{t("addSupplier.Phone")}</Text>
        <TextInput
          style={styles.input}
          value={formData.Phone}
          onChangeText={(text) => handleChange("Phone", text)}
          placeholder={t("addSupplier.Phone")}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>{t("addSupplier.Address")}</Text>
        <TextInput
          style={styles.input}
          value={formData.Address}
          onChangeText={(text) => handleChange("Address", text)}
          placeholder={t("addSupplier.Address")}
        />
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t("addSupplier.saveButton")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddSupplier;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  contactButton: {
    backgroundColor: "#2C3E50",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  contactButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#2C3E50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
