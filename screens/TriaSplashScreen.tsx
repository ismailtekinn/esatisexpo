import React from "react";
import { View, ImageBackground, StyleSheet, Dimensions } from "react-native";

const TriaSplashScreen: React.FC = () => {
  return (
    <ImageBackground
      source={require("../assets/triaslide.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* İstersen burada logo veya yükleniyor animasyonu da ekleyebilirsin */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default TriaSplashScreen;
