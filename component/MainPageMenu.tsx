// component/MainPageMenu.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface MenuItem {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;  // icon zorunlu değil, opsiyonel yaptım
}

interface MainPageMenuProps {
  visible: boolean;
  onClose: () => void;
  navigationItems: MenuItem[];
}

const MainPageMenu: React.FC<MainPageMenuProps> = ({
  visible,
  onClose,
  navigationItems,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <TouchableOpacity style={styles.menuContainer} activeOpacity={1}>
          {navigationItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                item.onPress();
                onClose();
              }}
              style={styles.menuItem}
            >
              {item.icon && <View style={styles.iconContainer}>{item.icon}</View>}
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default MainPageMenu;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  menuItem: {
    flexDirection: "row",     // İkon ve metni yan yana hizalamak için
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconContainer: {
    marginRight: 15,          // İkon ile yazı arasında boşluk
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 18,
  },
});
