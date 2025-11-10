import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { SignIn } from "../types/authType";
import { login } from "../api/auth";
import { RootStackParamList } from "../types";
import { useKullanici } from "../contex/kullaniciContext";
import { useAutoLogin } from "../contex/settings/autoLoginContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertModal from "../component/AlertModal";

// import { useKullanici } from "../contex/kullaniciContext";

const { width } = Dimensions.get("window");
const LoginScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<SignIn>({
    KullaniciKodu: "ADMIN",
    Sifre: "ADMIN",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const { handleLogin } = useKullanici();
  const { autoLogin, setAutoLogin } = useAutoLogin();
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [allertTtile, setAlertTitle] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await login(formData);

      await handleLogin(response);
      await AsyncStorage.setItem("username", formData.KullaniciKodu);
      await AsyncStorage.setItem("password", formData.Sifre);
      navigation.navigate("MainPage");
    } catch (err: any) {
      // console.error("Login hatası:", err?.message);
      // Alert.alert("Login Failed", "Giriş sırasında bir hata oluştu.");
      setAlertTitle(err.title);
      setAlertMessage(err.message);
      setAlertModalVisible(true);
    }
  };
  const handleChange = (name: keyof SignIn, value: string): void => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFocus = (inputName: string): void => {
    setFocusedInput(inputName);
  };

  const handleBlur = (): void => {
    setFocusedInput("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={styles.background}
      >
        <View style={styles.gridPattern} />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Right Side - Login Form */}
            <View style={styles.formPanel}>
              <View style={styles.formCard}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Giriş Yap</Text>
                  <Text style={styles.formSubtitle}>
                    Hesabınıza erişim sağlayın
                  </Text>
                </View>

                {/* Username Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Kullanıcı Adı</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "username" &&
                        styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={18}
                      color="#64748b"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={formData.KullaniciKodu}
                      onChangeText={(value) =>
                        handleChange("KullaniciKodu", value)
                      }
                      onFocus={() => handleFocus("username")}
                      onBlur={handleBlur}
                      placeholder="Kullanıcı adınızı girin"
                      placeholderTextColor="#64748b"
                      autoCapitalize="none"
                    />
                    {formData.KullaniciKodu.length > 0 && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#10b981"
                      />
                    )}
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Şifre</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.forgotText}>Şifremi Unuttum?</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "password" &&
                        styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={18}
                      color="#64748b"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={formData.Sifre}
                      onChangeText={(value) => handleChange("Sifre", value)}
                      onFocus={() => handleFocus("password")}
                      onBlur={handleBlur}
                      placeholder="En az 8 karakter"
                      placeholderTextColor="#64748b"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={showPassword ? "eye" : "eye-off"}
                        size={20}
                        color="#64748b"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Remember Me */}
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxActive,
                    ]}
                  >
                    {rememberMe && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                  <Text style={styles.rememberText}>Beni hatırla</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  // disabled={isLoading || !formData.username || !formData.password}
                  style={[styles.loginButton]}
                  activeOpacity={0.9}
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  <LinearGradient
                    colors={["#3b82f6", "#2563eb"]}
                    style={styles.loginButtonGradient}
                  >
                    <Text style={styles.buttonText}>Giriş Yap</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Help Section */}
                <View style={styles.helpSection}>
                  <Ionicons
                    name="help-circle-outline"
                    size={16}
                    color="#64748b"
                  />
                  <Text style={styles.helpText}>Hesabınız yok mu</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate("RegisterScreen")}
                  >
                    <Text style={styles.helpLink}>Kayıt Ol</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <View style={styles.footerLinks}>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.footerLink}>Gizlilik</Text>
                  </TouchableOpacity>
                  <Text style={styles.footerDot}>•</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.footerLink}>Koşullar</Text>
                  </TouchableOpacity>
                  <Text style={styles.footerDot}>•</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.footerLink}>Yardım</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.copyright}>
                  Tercih Bilişim Tüm Hakları Saklıdır
                </Text>
              </View>

              <AlertModal
                visible={alertModalVisible}
                message={alertMessage}
                title={allertTtile}
                onClose={() => setAlertModalVisible(false)}
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  gridPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundColor: "transparent",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    flexDirection: width > 768 ? "row" : "column",
    alignItems: "stretch",
    paddingHorizontal: 20,
    gap: 32,
  },
  formPanel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  formCard: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 24,
    padding: 40,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 10,
  },
  formHeader: {
    marginBottom: 32,
    alignItems: "center",
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 15,
    color: "#94a3b8",
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e2e8f0",
  },
  forgotText: {
    fontSize: 13,
    color: "#60a5fa",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.2)",
    paddingHorizontal: 16,
    height: 54,
    gap: 12,
  },
  inputContainerFocused: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderColor: "#3b82f6",
  },
  inputIcon: {
    marginRight: 0,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "500",
  },
  eyeButton: {
    padding: 4,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(148, 163, 184, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  rememberText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  loginButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  helpSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  helpText: {
    fontSize: 13,
    color: "#64748b",
  },
  helpLink: {
    fontSize: 13,
    color: "#60a5fa",
    fontWeight: "600",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
    gap: 12,
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerLink: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  footerDot: {
    fontSize: 13,
    color: "#475569",
  },
  copyright: {
    fontSize: 12,
    color: "#475569",
  },
});

export default LoginScreen;
