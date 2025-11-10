import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

interface SaleScreenModalProps {
  visible: boolean;
  onClose: () => void;
}

const SaleScreenModal: React.FC<SaleScreenModalProps> = ({
  visible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(0);

const tabs = [
  {
    id: 0,
    title: "1",
    content: "Satış işlemleri ve ödeme seçenekleri burada yer alır"
  },
  {
    id: 1,
    title: "2",
    content: "Ürün iade işlemleri ve iade koşulları bu bölümde bulunur."
  },
  {
    id: 2,
    title: "3",
    content: "Günlük satış raporları ve analitik veriler burada gösterilir."
  },
  {
    id: 3,
    title: "4",
    content: "Sistem ayarları ve konfigürasyon seçenekleri bu sekmededir."
  }
] as const;
  const renderContent = () => {
    const currentTab = tabs[activeTab];
    return (
      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>{currentTab.title}</Text>
        <Text style={styles.contentText}>{currentTab.content}</Text>

        {/* Tab'a özel içerikler */}
        {activeTab === 0 && (
          <View style={styles.saleContent}>
            <View style={styles.actionCard}>
              <Ionicons name="cash-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Nakit Ödeme</Text>
                <Text style={styles.actionDescription}>Nakit ile ödeme al</Text>
              </View>
            </View>

            <View style={styles.actionCard}>
              <Ionicons name="card-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Kart Ödeme</Text>
                <Text style={styles.actionDescription}>POS ile kart ödemesi</Text>
              </View>
            </View>
            <View style={styles.actionCard}>
              <Ionicons name="cash-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Nakit Ödeme</Text>
                <Text style={styles.actionDescription}>Nakit ile ödeme al</Text>
              </View>
            </View>

            <View style={styles.actionCard}>
              <Ionicons name="card-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Kart Ödeme</Text>
                <Text style={styles.actionDescription}>POS ile kart ödemesi</Text>
              </View>
            </View>
            <View style={styles.actionCard}>
              <Ionicons name="cash-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Nakit Ödeme</Text>
                <Text style={styles.actionDescription}>Nakit ile ödeme al</Text>
              </View>
            </View>

            <View style={styles.actionCard}>
              <Ionicons name="card-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Kart Ödeme</Text>
                <Text style={styles.actionDescription}>POS ile kart ödemesi</Text>
              </View>
            </View>
            <View style={styles.actionCard}>
              <Ionicons name="cash-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Nakit Ödeme</Text>
                <Text style={styles.actionDescription}>Nakit ile ödeme al</Text>
              </View>
            </View>

            <View style={styles.actionCard}>
              <Ionicons name="card-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Kart Ödeme</Text>
                <Text style={styles.actionDescription}>POS ile kart ödemesi</Text>
              </View>
            </View>
            <View style={styles.actionCard}>
              <Ionicons name="cash-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Nakit Ödeme</Text>
                <Text style={styles.actionDescription}>Nakit ile ödeme al</Text>
              </View>
            </View>

            <View style={styles.actionCard}>
              <Ionicons name="card-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Kart Ödeme</Text>
                <Text style={styles.actionDescription}>POS ile kart ödemesi</Text>
              </View>
            </View>
            <View style={styles.actionCard}>
              <Ionicons name="cash-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Nakit Ödeme</Text>
                <Text style={styles.actionDescription}>Nakit ile ödeme al</Text>
              </View>
            </View>

            <View style={styles.actionCard}>
              <Ionicons name="card-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Kart Ödeme</Text>
                <Text style={styles.actionDescription}>POS ile kart ödemesi</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 1 && (
          <View style={styles.returnContent}>
            <View style={styles.actionCard}>
              <Ionicons name="scan-outline" size={24} color="#FF6B6B" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Barkod Tarama</Text>
                <Text style={styles.actionDescription}>İade edilecek ürünü tara</Text>
              </View>
            </View>

            <View style={styles.actionCard}>
              <Ionicons name="receipt-outline" size={24} color="#FF6B6B" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Fiş ile İade</Text>
                <Text style={styles.actionDescription}>Fiş numarası ile iade</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 2 && (
          <View style={styles.reportContent}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₺2,450</Text>
              <Text style={styles.statLabel}>Günlük Satış</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Toplam İşlem</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>₺54.40</Text>
              <Text style={styles.statLabel}>Ortalama Sepet</Text>
            </View>
          </View>
        )}

        {activeTab === 3 && (
          <View style={styles.settingsContent}>
            <View style={styles.settingItem}>
              <Ionicons name="print-outline" size={20} color="#666" />
              <Text style={styles.settingText}>Yazıcı Ayarları</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </View>

            <View style={styles.settingItem}>
              <Ionicons name="wifi-outline" size={20} color="#666" />
              <Text style={styles.settingText}>Bağlantı Ayarları</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </View>

            <View style={styles.settingItem}>
              <Ionicons name="people-outline" size={20} color="#666" />
              <Text style={styles.settingText}>Kullanıcı Yönetimi</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabScrollContainer}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tabButton,
                    activeTab === tab.id && styles.activeTabButton
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.id && styles.activeTabText
                    ]}
                  >
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.contentScrollView}>
            {renderContent()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    height: height * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    // justifyContent: "space-between",
     justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    // color: "#333",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    // backgroundColor: "#f8f9fa",
    // borderBottomWidth: 1,
    // borderBottomColor: "#e0e0e0",
  },
  tabScrollContainer: {
    paddingHorizontal: 4,
  },
tabButton: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  justifyContent:"center",
  paddingVertical: 12,
  marginHorizontal: 2,
  backgroundColor: "transparent",
  borderWidth: 1,        // border kalınlığı
  borderColor: "#007AFF", // border rengi, aynı mavi
  borderRadius: 8,        // köşeleri yuvarlatmak istersen
},
  activeTabButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    // marginLeft: 6,
  },
  activeTabText: {
    color: "#fff",
  },
  contentScrollView: {
    flex: 1,
  },
  contentSection: {
    padding: 16,
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },

  // Satış içeriği
  saleContent: {
    gap: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  actionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: "#666",
  },

  // İade içeriği
  returnContent: {
    gap: 12,
  },

  // Rapor içeriği
  reportContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    minWidth: "30%",
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.9,
  },

  // Ayarlar içeriği
  settingsContent: {
    gap: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
});

export default SaleScreenModal;
