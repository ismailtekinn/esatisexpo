import React, { useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Platform
} from "react-native";

const { width, height } = Dimensions.get('window');

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  type?: 'success' | 'warning' | 'error' | 'info';
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  title = "Uyarı",
  message,
  confirmText = "Tamam",
  cancelText = "İptal",
  onConfirm,
  showCancel = false,
  type = 'info'
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          gradient: ['#4ade80', '#22c55e', '#16a34a'],
          icon: '✅',
          confirmColor: '#16a34a'
        };
      case 'error':
        return {
          gradient: ['#f87171', '#ef4444', '#dc2626'],
          icon: '❌',
          confirmColor: '#dc2626'
        };
      case 'warning':
        return {
          gradient: ['#facc15', '#eab308', '#ca8a04'],
          icon: '⚠️',
          confirmColor: '#ca8a04'
        };
      default:
        return {
          gradient: ['#60a5fa', '#3b82f6', '#2563eb'],
          icon: 'ℹ️',
          confirmColor: '#2563eb'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="none" 
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        {/* Blur Background */}
        <View style={styles.blurBackground} />
        
        {/* Floating Particles */}
        <View style={styles.particle1} />
        <View style={styles.particle2} />
        <View style={styles.particle3} />
        
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          {/* Header with Icon */}
          <View style={[styles.header, { backgroundColor: typeStyles.gradient[0] }]}>
            <Text style={styles.iconText}>{typeStyles.icon}</Text>
          </View>
          
          {/* Content */}
          <View style={styles.content}>
            {title && (
              <Text style={styles.title}>{title}</Text>
            )}
            <Text style={styles.message}>{message}</Text>
          </View>
          
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button, 
                styles.confirmButton,
                { backgroundColor: typeStyles.confirmColor }
              ]}
              onPress={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  particle1: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: '20%',
    left: '15%',
    transform: [{ rotate: '45deg' }],
  },
  particle2: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    top: '70%',
    right: '20%',
  },
  particle3: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: '40%',
    right: '10%',
    transform: [{ rotate: '30deg' }],
  },
  container: {
    width: width * 0.85,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
      },
      android: {
        elevation: 25,
      },
    }),
  },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  iconText: {
    fontSize: 32,
    zIndex: 2,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: "#1f2937",
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: 'center',
    minHeight: 50,
  },
  confirmButton: {
    backgroundColor: "#3b82f6",
    ...Platform.select({
      ios: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  confirmButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cancelButtonText: {
    color: "#6b7280",
    fontWeight: "600",
    fontSize: 16,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    top: -50,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    bottom: -30,
    left: -20,
  },
});
