import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';

interface BarcodeScannerProps {
  onBarcodeScanned: (data: string) => void; // Dışarıdan gelen fonksiyon
  isModalVisible: boolean; // Modal görünürlüğü kontrol etmek için
  setModalVisible: (visible: boolean) => void; // Modal'ı açıp kapamak için
}

const ModalBarkod: React.FC<BarcodeScannerProps> = ({ onBarcodeScanned, isModalVisible, setModalVisible }) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { type: string; data: string }) => {
    onBarcodeScanned(data); // Tarama sonucunu dışarıya ilet
    setModalVisible(false); // Tarama tamamlandığında modalı kapat
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} onBarcodeScanned={handleBarcodeScanned}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.closeButtonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
  },
  closeButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ModalBarkod;
