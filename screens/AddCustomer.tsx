import React, { useLayoutEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addCustomer } from "../api/customer";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

type FormField = keyof typeof initialFormData;

const initialFormData = {
  ClientName: "",
  ClientSurname: "",
  Address: "",
  Phone: "",
  UserID: 1,
};

const AddCustomer = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState(initialFormData);

  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("add_customer.title"),
    });
  }, [navigation]);
  const handleSave = async () => {
    try {
      const response = await addCustomer(formData);
      if (response.isSuccess) {
        alert(`${t("alertMessage.createSuccess")}`);
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
        <Text style={styles.label}>{t("add_customer.first_name")}</Text>
        <TextInput
          style={styles.input}
          value={formData.ClientName}
          onChangeText={(text) => handleChange("ClientName", text)}
          placeholder={t("add_customer.first_name")}
        />
        <Text style={styles.label}>{t("add_customer.last_name")}</Text>
        <TextInput
          style={styles.input}
          value={formData.ClientSurname}
          onChangeText={(text) => handleChange("ClientSurname", text)}
          placeholder={t("add_customer.last_name")}
        />

        <Text style={styles.label}>{t("add_customer.phone")}</Text>
        <TextInput
          style={styles.input}
          value={formData.Phone}
          onChangeText={(text) => handleChange("Phone", text)}
          placeholder={t("add_customer.phone")}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>{t("add_customer.address")}</Text>
        <TextInput
          style={styles.input}
          value={formData.Address}
          onChangeText={(text) => handleChange("Address", text)}
          placeholder={t("add_customer.address")}
        />
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t("add_customer.save")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddCustomer;

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
