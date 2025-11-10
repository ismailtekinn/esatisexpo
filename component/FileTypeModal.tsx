import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useFileType } from "../contex/fileTypeContext";

const FILE_TYPES = ["Fiş", "Fatura", "Tahsilat", "Ödeme", "Gider Pusulası"];

const { width } = Dimensions.get("window");

type Props = {
  onClose: () => void;
};

export default function FileTypeModal({ onClose }: Props) {
  const { selectedFileType, setSelectedFileType } = useFileType();
  const renderItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedFileType;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => {
          setSelectedFileType(item);
          //   onClose();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <View style={styles.itemLeft}>
            <View
              style={[
                styles.radioButton,
                isSelected && styles.radioButtonSelected,
              ]}
            >
              {isSelected && <View style={styles.radioButtonInner} />}
            </View>
            <Text
              style={[styles.itemText, isSelected && styles.itemTextSelected]}
            >
              {item}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.statusIndicator}>
              <Text style={styles.statusText}>SEÇİLDİ</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>BELGE TÜRLERİ</Text>
            <Text style={styles.subtitle}>Lütfen belge türünü seçiniz</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={FILE_TYPES}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <View style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            { fontSize: width * 0.03, color: "#6b7280" },
          ]}
        >
          Seçilen Belge Türü:{" "}
          <Text
            style={{
              fontSize: width * 0.05,
              color: selectedFileType ? "#0" : "#6b7280",
            }}
          >
            {selectedFileType || "Henüz seçim yapılmadı"}
          </Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>KAYDET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    maxWidth: 500,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#1f2937",
    borderBottomWidth: 2,
    borderBottomColor: "#c41e3a",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 13,
    color: "#d1d5db",
    marginTop: 2,
    fontWeight: "400",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  closeText: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "300",
    lineHeight: 20,
  },
  listContainer: {
    backgroundColor: "#f9fafb",
  },
  listContent: {
    paddingVertical: 12,
  },
  item: {
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  itemSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#2563eb",
    borderWidth: 2,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#9ca3af",
    backgroundColor: "#ffffff",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#ffffff",
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563eb",
  },
  itemText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },
  itemTextSelected: {
    color: "#1e40af",
    fontWeight: "600",
  },
  statusIndicator: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#16a34a",
  },
  statusText: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  separator: {
    height: 8,
  },
  footer: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  footerText: {
    fontSize: width * 0.05,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "bold",
  },

  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
  },
  saveButton: {
    backgroundColor: "#c41e3a",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
