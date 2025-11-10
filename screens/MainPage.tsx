import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
  ImageBackground,
} from "react-native";
import { ScrollView } from "react-native";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useKullanici } from "../contex/kullaniciContext";

const { width, height } = Dimensions.get("window");

interface MenuItem {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  gradient: [string, string];
  shadowColor: string;
  route?: string;
}

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

const MainPage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const { userData, handleLogout } = useKullanici();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: "Satış",
      subtitle: "Satışlarınızı yönetin ve takip edin",
      icon: "💰",
      gradient: ["#667eea", "#764ba2"] as const,
      shadowColor: "#667eea",
      route: "SalesScreen",
    },
    {
      id: 2,
      title: "Ayarlar",
      subtitle: "Uygulama ve kullanıcı ayarlarını düzenleyin",
      icon: "⚙️",
      gradient: ["#f093fb", "#f5576c"] as const,
      shadowColor: "#f093fb",
      route: "SettingsScreen",
    },
    {
      id: 3,
      title: "Rapor",
      subtitle: "Satış ve performans raporlarını inceleyin",
      icon: "📊",
      gradient: ["#4facfe", "#00f2fe"] as const,
      shadowColor: "#4facfe",
    },
  ];

  // console.log("userdata main sayfasında  console yazdırılıyor: ", userData)
  const handleMenuPress = (menuId: number, title: string): void => {
    if (menuId === 1) {
      navigation.navigate("SalesScreen");
    } else if (menuId === 2) {
      navigation.navigate("SettingsScreen");
    }
    else if (menuId === 3) {
      handleLogout()
    }
  };

  const MenuCard: React.FC<MenuCardProps> = ({ item, index }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.menuCard,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              {
                scale: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => handleMenuPress(item.id, item.title)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={item.gradient}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              {/* <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>→</Text>
              </View> */}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.backgroundGradient}
      />

      {/* Header Section */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
        <Text style={styles.appTitle}>Satış Yönetim Sistemi</Text>
        <View style={styles.headerDecoration}>
          <View style={styles.decorationDot} />
          <View style={styles.decorationLine} />
          <View style={styles.decorationDot} />
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Menu Section */}
        <Animated.View
          style={[
            styles.menuContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {menuItems.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </Animated.View>
      </ScrollView>

      <Animated.View
        style={[
          styles.bottomDecoration,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.bottomCircle1} />
        <View style={styles.bottomCircle2} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: (StatusBar.currentHeight ?? 0) + 20,
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "#ffffff80",
    fontWeight: "300",
    marginBottom: 5,
  },
  appTitle: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  headerDecoration: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  decorationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4facfe",
    marginHorizontal: 5,
  },
  decorationLine: {
    width: 40,
    height: 2,
    backgroundColor: "#4facfe",
    marginHorizontal: 10,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  menuCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardTouchable: {
    borderRadius: 20,
    overflow: "hidden",
  },
  cardGradient: {
    borderRadius: 20,
    padding: 25,
    minHeight: 100,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  menuIcon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
    minHeight: 50,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "bold",
  },
  bottomDecoration: {
    position: "absolute",
    bottom: -50,
    right: -50,
    zIndex: -1,
  },
  bottomCircle1: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    position: "absolute",
  },
  bottomCircle2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    position: "absolute",
    top: 30,
    left: 30,
  },
});

export default MainPage;
