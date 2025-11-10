import React from "react";
import { ModalType } from "../types/modalType";
import { Modal, StyleSheet, View } from "react-native";
import ActionModalExample from "./ActionModalExample";
import FileTypeModal from "./FileTypeModal";

type Props = {
  type: ModalType;
  visible: boolean;
  onClose: () => void;
};
export default function BaseModalManager({ type, visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent={true} // istersen false yapabilirsin
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        {type === "action" && <ActionModalExample onClose={onClose} />}
        {/* {type === "fileType" && (
          <FileTypeListModal
            selectedType={selectedFileType}
            onSelect={(file) => setSelectedFileType(file)}
            onClose={onClose}
          />
        )} */}
        {type === "fileType" && <FileTypeModal onClose={onClose} />}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor kaldır ya da tamamen opak yap
    // backgroundColor: "transparent",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
