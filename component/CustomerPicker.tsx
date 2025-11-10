import React from "react";
import { View, Text,  TouchableOpacity, StyleSheet } from "react-native";

import { Picker } from '@react-native-picker/picker';
import { CustomerPickerProps } from "../interface/ISelectDropDown";

const CustomerPicker: React.FC<CustomerPickerProps> = ({ customers, selectedCustomer, onSelectCustomer, onAddCustomer }) => {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tedarikçi Seç</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedCustomer} onValueChange={onSelectCustomer}>
            {customers.map((customer) => (
              <Picker.Item key={customer} label={customer} value={customer} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAddCustomer}>
          <Text style={styles.addButtonText}>Müşteri Ekle</Text>
        </TouchableOpacity>
      </View>
    );
  };

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CustomerPicker;