import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  AddCustomerDropDownOption,
  AddCustomerDropDownProps,
  AddCustomerDropDownType,
} from "../types/addCustomerDropDownType";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useAddCustomerForm } from "../contex/customer/addCustomerFormContext";
import { useBussinessContext } from "../contex/addCustomerModal/bussinessContext";

const getOptionsByType = (
  type: AddCustomerDropDownType,
  bussinessData?: ReturnType<typeof useBussinessContext>["bussinessData"],
  customerData?: ReturnType<typeof useBussinessContext>["customerData"]
): {
  options: AddCustomerDropDownOption[];
  title: string;
  subtitle?: string;
} => {
  switch (type) {
    case "kanGrubu":
      return {
        title: "Kan Grubu Seçimi",
        subtitle: "Lütfen kan grubunu seçin",
        options: [
          { id: "1", title: "A Rh+", icon: "heart" },
          { id: "2", title: "A Rh-", icon: "heart" },
          { id: "3", title: "B Rh+", icon: "heart" },
          { id: "4", title: "B Rh-", icon: "heart" },
          { id: "5", title: "AB Rh+", icon: "heart" },
          { id: "6", title: "AB Rh-", icon: "heart" },
          { id: "7", title: "O Rh+", icon: "heart" },
          { id: "8", title: "O Rh-", icon: "heart" },
        ],
      };
    case "cinsiyet":
      return {
        title: "Cinsiyet Seçimi",
        options: [
          { id: "1", title: "Erkek", icon: "man" },
          { id: "2", title: "Kadın", icon: "woman" },
        ],
      };
    case "musteriGrubu":
      return {
        title: "Müşteri Grubu Seçimi",
        options:
          customerData?.map((c) => ({
            id: c.GRUP_NO,
            title: c.GRUP_ADI,
            icon: "medicinebox",
          })) || [],
      };
    case "dogumTarihi":
      return {
        title: "Doğum Tarihi Seçimi",
        options: [],
      };
    case "meslek":
      return {
        title: "Meslek Seçimi",
        options:
          bussinessData?.map((d) => ({
            id: d.KOD,
            title: d.ACIKLAMA,
            icon: "idcard", // ikon sabit, istersen dinamik yapabilirsin
          })) || [],
      };

    default:
      return { title: "Seçenekler", options: [] };
  }
};

const CustomerSelectDropDownModal: React.FC<AddCustomerDropDownProps> = ({
  modalVisible,
  onClose,
  type,
}) => {
  const { bussinessData, customerData } = useBussinessContext();
  const { options, title, subtitle } = getOptionsByType(
    type,
    bussinessData,
    customerData
  );
  const { addCustomForm, setAddCustomForm } = useAddCustomerForm();

  //   console.log("meslek bilgisi console yazdırılıyor :", bussinessData);

  const handleSelectOption = (option: AddCustomerDropDownOption) => {
    switch (type) {
      case "kanGrubu":
        setAddCustomForm({ ...addCustomForm, KAN_GRUBU: option.title });
        break;
      case "cinsiyet":
        setAddCustomForm({ ...addCustomForm, M_CINSIYETI: (option.id) });
        break;
      case "musteriGrubu":
        setAddCustomForm({ ...addCustomForm, GRUP_NO: option.id });
        break;
      case "meslek":
        setAddCustomForm({ ...addCustomForm, MESLEK: option.title });
    }
    onClose(); // seçince modal kapanacak
  };

  const renderOption = ({
    item,
    index,
  }: {
    item: AddCustomerDropDownOption;
    index: number;
  }) => {
    const isLast = index === options.length - 1;

    return (
      <TouchableOpacity
        style={[styles.optionItem, isLast && styles.lastItem]}
        activeOpacity={0.7}
        onPress={() => handleSelectOption(item)}
      >
        <View style={styles.optionContent}>
          <View style={styles.iconContainer}>
            <AntDesign name={item.icon as any} size={16} color="#e74c3c" />
          </View>
          <Text style={styles.optionText}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDatePick = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, date) => {
        if (date) {
          setAddCustomForm({
            ...addCustomForm,
            M_DOGUM_TARIHI: date.toDateString(),
          });
          onClose();
        }
      },
      mode: "date",
    });
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <AntDesign name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.modalContent}>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {type === "dogumTarihi" ? (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleDatePick}
              >
                <Text style={{ color: "#000", padding: 12 }}>
                  {addCustomForm.M_DOGUM_TARIHI
                    ? addCustomForm.M_DOGUM_TARIHI
                    : "Şehir / GG.AA.YYYY"}
                </Text>
              </TouchableOpacity>
            ) : (
              <FlatList
                data={options}
                keyExtractor={(item) => item.id}
                renderItem={renderOption}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(44, 62, 80, 0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    maxHeight: "65%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  closeButton: {
    backgroundColor: "#ff4d4d",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 12,
    lineHeight: 18,
  },
  optionItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    paddingVertical: 0,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#ebf3fd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: "#2c3e50",
    fontWeight: "500",
  },
});

export default CustomerSelectDropDownModal;
