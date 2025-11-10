import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AutoLoginOption } from "../types/enums/settings";
import { useAutoLogin } from "../contex/settings/autoLoginContext";

type SettingScreenDropDownModalProps<T extends string> = {
  title: string;
  options: T[];
  visible: boolean;
  onClose: () => void;
  onSelect: (value: T) => void; // generic tip
};

const SettingScreenDropDownModel = <T extends string>({
  title,
  options,
  visible,
  onClose,
  onSelect,
}: SettingScreenDropDownModalProps<T>) => {
  const { autoLogin, setAutoLogin } = useAutoLogin();
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  onSelect(item);
                  setAutoLogin(item as AutoLoginOption); 
                  onClose();
                }}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  optionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default SettingScreenDropDownModel;
