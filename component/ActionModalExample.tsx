import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMenuProcess } from "../contex/salesscreen/MenuProccesContext";
import { MenuActionType } from "../types/salesscreen/menuActionType"


type Props = { onClose: () => void };
type IconName =
  | "trash-outline"
  | "pause-outline"
  | "download-outline"
  | "pencil-outline";

type MenuItem = {
  title: string;
  action: () => void;
  icon: IconName;
  color: string;
};

export default function ActionModalExample({ onClose }: Props) {
   const { setSelectedAction } = useMenuProcess();
  const menuItems: MenuItem[] = [
    {
      title: "Belge İptali",
      action: () => console.log("Belge İptal"),
      icon: "trash-outline",
      color: "#FF6B6B",
    },
    {
      title: "Belgeyi Beklemeye Al",
      action: () => setSelectedAction("SAVE_PENDING"),
      icon: "pause-outline",
       color: "#F7B731",
    },
    {
      title: "Bekleyen Belgeyi Getir",
      action: () => setSelectedAction("LOAD_PENDING"),
      icon: "download-outline",
      color: "#34C759",
    },
    {
      title: "Belge Paylaş",
      action: () => setSelectedAction("SHARE_DOCUMENT"),
      icon: "pencil-outline",
      color: "#00D4FF",
    },
  ];

  return (
    <View style={styles.modalContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <Ionicons name="apps-outline" size={22} color="#0F172A" />
        </View>
        <Text style={styles.title}>Menü İşlem</Text>
        <Text style={styles.subtitle}>Yapmak istediğiniz işlemi seçin</Text>
      </View>

      {/* Menu Grid */}
      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={item.action}
            android_ripple={{ color: "#E5E7EB", borderless: false }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { borderColor: item.color }]}>
                <View
                  style={[
                    styles.iconBadgeInner,
                    { backgroundColor: item.color + "22" },
                  ]}
                />
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={item.color}
                  style={styles.icon}
                />
              </View>
            </View>
            <Text numberOfLines={2} style={styles.cardTitle}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Close Button */}
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeBtn}
        activeOpacity={0.85}
      >
        <View style={styles.closeBtnContent}>
          <Ionicons name="close" size={20} color="#fff" />
          <Text style={styles.closeBtnText}>Kapat</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    width: "90%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },

  header: {
    alignItems: "center",
    marginBottom: 18,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  card: {
    width: "48%",
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  iconBadge: {
    height: 40,
    width: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  iconBadgeInner: {
    position: "absolute",
    inset: 0,
  },
  icon: {
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    lineHeight: 18,
  },

  closeBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: "#EF4444",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  closeBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  } as any,
  closeBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
