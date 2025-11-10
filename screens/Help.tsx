// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
//   Linking,
//   Alert,
// } from "react-native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from "../types";
// import { useNavigation } from "@react-navigation/native";
// import { FontAwesome } from "@expo/vector-icons";

// type ContactLink = {
//   appUrl: string;
//   webUrl: string;
//   icon: keyof typeof FontAwesome.glyphMap;
//   color: string;
//   label: string;
// };

// const Help: React.FC = () => {
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

//   const contactLinks: Record<string, ContactLink> = {
//     whatsapp: {
//       appUrl: "whatsapp://send?phone=905357970059",
//       webUrl: "https://wa.me/905357970059",
//       icon: "whatsapp",
//       color: "#25D366",
//       label: "WhatsApp",
//     },
//     email: {
//       appUrl: "mailto:baysoftworks@gmail.com",
//       webUrl: "https://mail.google.com/mail/?view=cm&fs=1&to=baysoftworks@gmail.com",
//       icon: "envelope",
//       color: "#D44638",
//       label: "Email",
//     },
//     linkedin: {
//       appUrl: "linkedin://profile/ismail-tekin-38b40b1a5",
//       webUrl: "https://linkedin.com/in/ismail-tekin-38b40b1a5/",
//       icon: "linkedin",
//       color: "#0077B5",
//       label: "LinkedIn",
//     },
//   };

//   const openLink = async (appUrl: string, webUrl: string) => {
//     try {
//       const canOpen = await Linking.canOpenURL(appUrl);
//       await Linking.openURL(canOpen ? appUrl : webUrl);
//     } catch (error) {
//       console.error("Link açılamadı:", error);
//       Alert.alert(
//         "Hata",
//         "Bağlantı açılamadı. Lütfen daha sonra tekrar deneyin."
//       );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
//       >
//         <View style={styles.box}>
//           <Text style={styles.title}>Yardım</Text>
//           <Text style={styles.subtitle}>Bize Ulaşın</Text>
//           <View style={styles.iconContainer}>
//             {Object.values(contactLinks).map((contact) => (
//               <View key={contact.label} style={styles.iconWrapper}>
//                 <Text style={styles.iconLabel}>{contact.label}</Text>
//                 <TouchableOpacity
//                   onPress={() => openLink(contact.appUrl, contact.webUrl)}
//                 >
//                   <FontAwesome
//                     name={contact.icon}
//                     size={35}
//                     color={contact.color}
//                   />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f4f6fc",
//   },
//   box: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     maxWidth: "90%",
//     width: "100%",
//     padding: 30,
//     marginVertical: 20,
//     alignSelf: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 36,
//     color: "#2755ad",
//     textAlign: "center",
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   iconContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 10,
//   },
//   iconWrapper: {
//     alignItems: "center",
//     backgroundColor: "#ffff",
//     borderRadius: 50,
//     padding: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   iconLabel: {
//     fontSize: 14,
//     color: "#333",
//     marginBottom: 5,
//   },
// });

// export default Help;

import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useNavigation } from "@react-navigation/native";

const Help = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("mainPageMenu.pageTitle"),
    });
  }, [navigation]);

  const handleEmailPress = async () => {
    const emailUrl =
      "mailto:baysoftworks@gmail.com?subject=Destek Talebi&body=Merhaba, yardım için ulaşıyorum.";
    const webUrl =
      "https://mail.google.com/mail/?view=cm&fs=1&to=baysoftworks@gmail.com";

    try {
      const supported = await Linking.canOpenURL(emailUrl).catch(() => false);
      await Linking.openURL(supported ? emailUrl : webUrl);
    } catch {
      Alert.alert(
        "Hata",
        "Mail uygulaması açılamadı. Lütfen baysoftworks@gmail.com adresine manuel yazın."
      );
    }
  };

  const handlePhonePress = async () => {
    const phoneUrl = "tel:+905357970059";
    const whatsappUrl = "whatsapp://send?phone=+905357970059";
    const whatsappWebUrl = "https://wa.me/+905357970059";

    try {
      await Linking.openURL(whatsappUrl).catch(() => null);
      return;

      const phoneSupported = await Linking.canOpenURL(phoneUrl).catch(
        () => false
      );
      if (phoneSupported) {
        await Linking.openURL(phoneUrl);
        return;
      }

      await Linking.openURL(whatsappWebUrl);
    } catch {
      Alert.alert(
        "Hata",
        "WhatsApp veya arama açılamadı. Lütfen WhatsApp'ı yükleyin veya numarayı manuel arayın."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("mainPageMenu.wtihmecontact")}</Text>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="office-building"
          size={24}
          color="#1E88E5"
        />
        <Text style={styles.text}>Baysoftworks</Text>
      </View>

      <TouchableOpacity
        style={styles.inputContainer}
        onPress={handleEmailPress}
      >
        <MaterialIcons name="email" size={24} color="#1E88E5" />
        <Text style={styles.text}>baysoftworks@gmail.com</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.inputContainer}
        onPress={handlePhonePress}
      >
        <FontAwesome
          name="whatsapp"
          size={24}
          color="#25D366"
          style={styles.whatsappIcon}
        />
        <Text style={styles.text}>0535 797 00 59</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  whatsappIcon: {
    marginLeft: 8,
  },
});
