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
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types";

const { width, height } = Dimensions.get("window");

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<string>("");
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Kayıt Ol",
    });
  }, [navigation]);

  const handleChange = (name: keyof RegisterFormData, value: string): void => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatPhoneNumber = (text: string): string => {
    const cleaned = text.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);

    if (limited.length <= 3) return limited;
    if (limited.length <= 6)
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    if (limited.length <= 8)
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(
        6
      )}`;
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(
      6,
      8
    )} ${limited.slice(8)}`;
  };

  const handlePhoneChange = (value: string): void => {
    const formatted = formatPhoneNumber(value);
    handleChange("phone", formatted);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleSubmit = async (): Promise<void> => {
    const { firstName, lastName, email, phone, password, confirmPassword } =
      formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Hata", "Geçerli bir email adresi girin");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert("Hata", "Şifre en az 8 karakter olmalıdır");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor");
      return;
    }

    setIsLoading(true);
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

        <View style={styles.content}>
          <View style={styles.formPanel}>
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Kayıt Ol</Text>
                <Text style={styles.formSubtitle}>Yeni hesap oluşturun</Text>
              </View>

              {/* Row 1: Name & Email */}
              <View style={styles.rowInputs}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Ad Soyad</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "firstName" &&
                        styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons name="person" size={16} color="#64748b" />
                    <TextInput
                      style={styles.input}
                      value={formData.firstName}
                      onChangeText={(value) => handleChange("firstName", value)}
                      onFocus={() => handleFocus("firstName")}
                      onBlur={handleBlur}
                      placeholder="Ad"
                      placeholderTextColor="#64748b"
                    />
                  </View>
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>E-posta</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "email" && styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons name="mail" size={16} color="#64748b" />
                    <TextInput
                      style={styles.input}
                      value={formData.email}
                      onChangeText={(value) => handleChange("email", value)}
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      placeholder="email@ornek.com"
                      placeholderTextColor="#64748b"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </View>

              {/* Row 2: Surname & Phone */}
              <View style={styles.rowInputs}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Soyad</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "lastName" &&
                        styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons name="person-outline" size={16} color="#64748b" />
                    <TextInput
                      style={styles.input}
                      value={formData.lastName}
                      onChangeText={(value) => handleChange("lastName", value)}
                      onFocus={() => handleFocus("lastName")}
                      onBlur={handleBlur}
                      placeholder="Soyad"
                      placeholderTextColor="#64748b"
                    />
                  </View>
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Telefon</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "phone" && styles.inputContainerFocused,
                    ]}
                  >
                    <Text style={styles.phonePrefix}>+90</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.phone}
                      onChangeText={handlePhoneChange}
                      onFocus={() => handleFocus("phone")}
                      onBlur={handleBlur}
                      placeholder="5XX XXX XX XX"
                      placeholderTextColor="#64748b"
                      keyboardType="phone-pad"
                      maxLength={13}
                    />
                  </View>
                </View>
              </View>

              {/* Row 3: Password & Confirm Password */}
              <View style={styles.rowInputs}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Şifre</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "password" &&
                        styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons name="lock-closed" size={16} color="#64748b" />
                    <TextInput
                      style={styles.input}
                      value={formData.password}
                      onChangeText={(value) => handleChange("password", value)}
                      onFocus={() => handleFocus("password")}
                      onBlur={handleBlur}
                      placeholder="Min 8 karakter"
                      placeholderTextColor="#64748b"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={showPassword ? "eye" : "eye-off"}
                        size={18}
                        color="#64748b"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Şifre Tekrar</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "confirmPassword" &&
                        styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons name="lock-closed" size={16} color="#64748b" />
                    <TextInput
                      style={styles.input}
                      value={formData.confirmPassword}
                      onChangeText={(value) =>
                        handleChange("confirmPassword", value)
                      }
                      onFocus={() => handleFocus("confirmPassword")}
                      onBlur={handleBlur}
                      placeholder="Şifre tekrar"
                      placeholderTextColor="#64748b"
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye" : "eye-off"}
                        size={18}
                        color="#64748b"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                activeOpacity={0.7}
              ></TouchableOpacity>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.registerButton]}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#3b82f6", "#2563eb"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.registerButtonGradient}
                >
                  <Text style={styles.buttonText}>Kayıt Ol</Text>
                  <Ionicons name="arrow-forward" size={18} color="white" />
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <TouchableOpacity
                style={styles.loginSection}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
                <Text style={styles.loginLink}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  formPanel: {
    width: "100%",
    maxWidth: 600,
    alignItems: "center",
  },
  formCard: {
    width: "100%",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 10,
  },
  formHeader: {
    marginBottom: 24,
    alignItems: "center",
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.2)",
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  inputContainerFocused: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderColor: "#3b82f6",
  },
  phonePrefix: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e2e8f0",
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: "rgba(148, 163, 184, 0.2)",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "rgba(148, 163, 184, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "#94a3b8",
  },
  termsLink: {
    color: "#60a5fa",
    fontWeight: "600",
  },
  registerButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 12,
  },
  registerButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  registerButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
  loginSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 13,
    color: "#64748b",
  },
  loginLink: {
    fontSize: 13,
    color: "#60a5fa",
    fontWeight: "600",
  },
});

export default RegisterScreen;
