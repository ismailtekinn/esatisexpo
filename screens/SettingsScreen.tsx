import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Dimensions,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SettingScreenDropDownModel from "../component/SettingScreenDropDownModel";
import { AutoLoginOption } from "../types/enums/settings";
import { useAutoLogin } from "../contex/settings/autoLoginContext";
import AlertModal from "../component/AlertModal";

const { width } = Dimensions.get("window");

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dropDownMolalVisible, setDropDownModalVisible] = useState(false);
  const { autoLogin, setAutoLogin } = useAutoLogin();
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
    const [allertTtile, setAlertTitle] = useState("");

  const [selectedValue, setSelectedValue] = useState<AutoLoginOption>(
    AutoLoginOption.Hayir
  );

  const [settings, setSettings] = useState({
    storeName: "Mağaza Adı",
    language: "tr",
    currency: "TRY",
    theme: "light",
    serverIP: "192.168.1.1",
    port: "3000",
    dbUser: "admin",
    dbPassword: "",
    autoBackup: true,
    version: "1.0.0",
    autoLogin: selectedValue,
    apiKey: "sk-1234567890abcdef",
    licenseInfo: "Premium License",
  });

  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Admin User", email: "admin@example.com", role: "Admin" },
    {
      id: "2",
      name: "Store Manager",
      email: "manager@example.com",
      role: "Manager",
    },
  ]);

  const tabs = [
    { title: "Genel", icon: "settings-outline" },
    { title: "Bağlantı", icon: "wifi-outline" },
    { title: "Kullanıcı & Yetki", icon: "people-outline" },
    { title: "Yedekleme", icon: "cloud-upload-outline" },
    { title: "Gelişmiş", icon: "code-slash-outline" },
  ];

  const handleSave = () => {
    setAlertTitle("Başarılı")
    setAlertModalVisible(true)
    setAlertMessage("Ayarlar kaydedildi!")
  };

  const testConnection = () => {
    Alert.alert("Test Ediliyor", "Bağlantı test ediliyor...");
  };

  const manualBackup = () => {
    Alert.alert("Yedekleme", "Manuel yedekleme başlatılıyor...");
  };

  const addNewUser = () => {
    Alert.alert("Yeni Kullanıcı", "Yeni kullanıcı ekleme formu açılıyor...");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Genel
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Genel Ayarlar</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mağaza Adı</Text>
              <TextInput
                style={styles.input}
                value={settings.storeName}
                onChangeText={(text) =>
                  setSettings({ ...settings, storeName: text })
                }
                placeholder="Mağaza adınızı girin"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Dil</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>Türkçe</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Otomatik Login</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setDropDownModalVisible(true)}
              >
                <Text style={styles.pickerText}>{autoLogin}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>

              <SettingScreenDropDownModel
                title="Otomatik Login Seçiniz"
                options={[AutoLoginOption.Evet, AutoLoginOption.Hayir]}
                visible={dropDownMolalVisible}
                onClose={() => setDropDownModalVisible(false)}
                onSelect={(value: AutoLoginOption) => {
                  setSelectedValue(value);
                  setDropDownModalVisible(false);
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Para Birimi</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>TRY (₺)</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tema</Text>
              <View style={styles.themeOptions}>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    settings.theme === "light" && styles.themeOptionActive,
                  ]}
                >
                  <Ionicons
                    name="sunny"
                    size={24}
                    color={settings.theme === "light" ? "#007AFF" : "#666"}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      settings.theme === "light" &&
                        styles.themeOptionTextActive,
                    ]}
                  >
                    Açık
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    settings.theme === "dark" && styles.themeOptionActive,
                  ]}
                >
                  <Ionicons
                    name="moon"
                    size={24}
                    color={settings.theme === "dark" ? "#007AFF" : "#666"}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      settings.theme === "dark" && styles.themeOptionTextActive,
                    ]}
                  >
                    Koyu
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 1: // Bağlantı
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Bağlantı Ayarları</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Sunucu IP</Text>
              <TextInput
                style={styles.input}
                value={settings.serverIP}
                onChangeText={(text) =>
                  setSettings({ ...settings, serverIP: text })
                }
                placeholder="192.168.1.1"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Port</Text>
              <TextInput
                style={styles.input}
                value={settings.port}
                onChangeText={(text) =>
                  setSettings({ ...settings, port: text })
                }
                placeholder="3000"
                keyboardType="numeric"
              />
            </View>

            {/* <View style={styles.formGroup}>
              <Text style={styles.label}>Yazıcı Portu</Text>
              <TextInput
                style={styles.input}
                value={settings.dbUser}
                onChangeText={(text) =>
                  setSettings({ ...settings, dbUser: text })
                }
                placeholder="Kullanıcı adı"
              />
            </View> */}

            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Yazıcı Portu</Text>
                <TextInput
                  style={[styles.input, { maxHeight: 55 }]}
                  placeholder="Yazıcı Portunu"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}></Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.testButtonText,
                    {
                      backgroundColor: "#007AFF",
                      color: "white",
                      textAlign: "center",
                    },
                  ]}
                  value={"Yazıcıyı Test Et"}
                  placeholderTextColor="white"
                  editable={false}
                />
              </View>
            </View>

            {/* <View style={styles.formGroup}>
              <Text style={styles.label}>DB Kullanıcı Adı</Text>
              <TextInput
                style={styles.input}
                value={settings.dbUser}
                onChangeText={(text) =>
                  setSettings({ ...settings, dbUser: text })
                }
                placeholder="Kullanıcı adı"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>DB Şifre</Text>
              <TextInput
                style={styles.input}
                value={settings.dbPassword}
                onChangeText={(text) =>
                  setSettings({ ...settings, dbPassword: text })
                }
                placeholder="Şifre"
                secureTextEntry
              />
            </View> */}

            <TouchableOpacity
              style={styles.testButton}
              onPress={testConnection}
            >
              <Ionicons name="flash" size={20} color="white" />
              <Text style={styles.testButtonText}>Bağlantıyı Test Et</Text>
            </TouchableOpacity>
          </View>
        );

      case 2: // Kullanıcı & Yetki
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Kullanıcı & Yetki Yönetimi</Text>

            <TouchableOpacity style={styles.addButton} onPress={addNewUser}>
              <Ionicons name="person-add" size={20} color="white" />
              <Text style={styles.addButtonText}>Yeni Kullanıcı Ekle</Text>
            </TouchableOpacity>

            <Text style={styles.subsectionTitle}>Kullanıcı Listesi</Text>
            {users.map((user) => (
              <View key={user.id} style={styles.userItem}>
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <Ionicons name="person" size={24} color="#666" />
                  </View>
                  <View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="pencil" size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.permissionSection}>
              <Text style={styles.subsectionTitle}>Yetki Yönetimi</Text>
              <View style={styles.permissionItem}>
                <Text style={styles.permissionText}>Ürün Yönetimi</Text>
                <Switch value={true} />
              </View>
              <View style={styles.permissionItem}>
                <Text style={styles.permissionText}>Sipariş Yönetimi</Text>
                <Switch value={true} />
              </View>
              <View style={styles.permissionItem}>
                <Text style={styles.permissionText}>Raporlama</Text>
                <Switch value={false} />
              </View>
            </View>
          </View>
        );

      case 3: // Yedekleme & Güncelleme
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Yedekleme & Güncelleme</Text>

            <TouchableOpacity
              style={styles.backupButton}
              onPress={manualBackup}
            >
              <Ionicons name="download" size={20} color="white" />
              <Text style={styles.backupButtonText}>Manuel Yedekle</Text>
            </TouchableOpacity>

            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.label}>Otomatik Yedekleme</Text>
                <Switch
                  value={settings.autoBackup}
                  onValueChange={(value) =>
                    setSettings({ ...settings, autoBackup: value })
                  }
                />
              </View>
              <Text style={styles.helpText}>
                Günlük otomatik yedekleme yapılır
              </Text>
            </View>

            <View style={styles.versionInfo}>
              <Text style={styles.subsectionTitle}>Versiyon Bilgisi</Text>
              <View style={styles.versionItem}>
                <Text style={styles.versionLabel}>Mevcut Versiyon:</Text>
                <Text style={styles.versionValue}>{settings.version}</Text>
              </View>
              <TouchableOpacity style={styles.updateButton}>
                <Ionicons name="refresh" size={16} color="#007AFF" />
                <Text style={styles.updateButtonText}>
                  Güncelleme Kontrol Et
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 4: // Gelişmiş
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Gelişmiş Ayarlar</Text>

            <TouchableOpacity style={styles.advancedItem}>
              <View style={styles.advancedItemLeft}>
                <Ionicons name="bug" size={24} color="#FF6B6B" />
                <Text style={styles.advancedItemText}>Hata Günlükleri</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <View style={styles.formGroup}>
              <Text style={styles.label}>API Anahtarı</Text>
              <View style={styles.apiKeyContainer}>
                <TextInput
                  style={[styles.input, styles.apiKeyInput]}
                  value={settings.apiKey}
                  onChangeText={(text) =>
                    setSettings({ ...settings, apiKey: text })
                  }
                  placeholder="API Anahtarınız"
                  secureTextEntry
                />
                <TouchableOpacity style={styles.generateButton}>
                  <Ionicons name="key" size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.licenseInfo}>
              <Text style={styles.subsectionTitle}>Lisans Bilgisi</Text>
              <View style={styles.licenseItem}>
                <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
                <View>
                  <Text style={styles.licenseTitle}>
                    {settings.licenseInfo}
                  </Text>
                  <Text style={styles.licenseExpiry}>
                    Geçerlilik: 2025-12-31
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <Text style={styles.headerSubtitle}>Sistem ayarlarınızı yönetin</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={activeTab === index ? "#007AFF" : "#666"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>{renderTabContent()}</ScrollView>
      <AlertModal
        visible={alertModalVisible}
        message={alertMessage}
        title={allertTtile}
        onClose={() => setAlertModalVisible(false)}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={20} color="white" />
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 5,
  },
  tabsContainer: {
    backgroundColor: "white",
    borderBottomWidth: 5,
    height: 60,
    // borderBottomColor: '#E1E8ED',
    borderBottomColor: "#E1E8ED",
  },
  tabsContent: {
    paddingHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    borderRadius: 10,
    minWidth: 100,
  },
  activeTab: {
    backgroundColor: "#F0F8FF",
  },
  tabText: {
    fontSize: 12,
    color: "#666",
    // marginTop: 5,
    textAlign: "center",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    minHeight: 400,
  },
  tabContent: {
    padding: 20,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  fieldHalf: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495E",
    marginTop: 20,
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E1E8ED",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "white",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E1E8ED",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "white",
  },
  pickerText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  themeOptions: {
    flexDirection: "row",
    gap: 15,
  },
  themeOption: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E1E8ED",
    backgroundColor: "white",
  },
  themeOptionActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  themeOptionText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  themeOptionTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  testButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  testButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E1E8ED",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  userEmail: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 2,
  },
  userRole: {
    fontSize: 12,
    color: "#007AFF",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  editButton: {
    padding: 8,
  },
  permissionSection: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  permissionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F4",
  },
  permissionText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helpText: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 5,
  },
  backupButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  backupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  versionInfo: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  versionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  versionLabel: {
    fontSize: 16,
    color: "#2C3E50",
  },
  versionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  updateButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  advancedItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E1E8ED",
  },
  advancedItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  advancedItemText: {
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 12,
  },
  apiKeyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  apiKeyInput: {
    flex: 1,
    marginRight: 10,
  },
  generateButton: {
    padding: 15,
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  licenseInfo: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  licenseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  licenseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginLeft: 15,
  },
  licenseExpiry: {
    fontSize: 14,
    color: "#7F8C8D",
    marginLeft: 15,
    marginTop: 2,
  },
  footer: {
    backgroundColor: "white",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default SettingsScreen;
