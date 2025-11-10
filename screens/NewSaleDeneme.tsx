// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import BarCodeScanResult from "./BarcodeScannerPage";
// import { RootStackParamList } from "../types";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { useNavigation } from "@react-navigation/native";
// import { useSelectedProduct } from "../contex/selectedProductContext";

// function NewSale() {
//   const [customer, setCustomer] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Nakit");
//   const [invoiceDate, setInvoiceDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [total, setTotal] = useState(0);
//   const [isScannerVisible, setIsScannerVisible] = useState(false);
//   const { selectedProduct } = useSelectedProduct();

//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

//   const onChangeDate = (event: any, selectedDate?: Date) => {
//     const currentDate = selectedDate || invoiceDate;
//     setShowDatePicker(false);
//     setInvoiceDate(currentDate);
//   };

//   useEffect(() => {
//   if (selectedProduct) {
//     console.log("Seçilen ürün:", selectedProduct);
//   }
// }, [selectedProduct]);

//   return (
//     <View style={styles.container}>
//       {isScannerVisible && (
//         <View style={{ height: 40, marginTop: 50, marginBottom: 90 }}>
//           <BarCodeScanResult
//             onBarcodeScanned={(data) => {
//               // setIsScannerVisible(false);
//             }}
//             onClose={() => setIsScannerVisible(false)}
//           />
//         </View>
//       )}

//       <View style={styles.formContainer}>
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Müşteri</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Müşteri Seçin"
//             value={customer}
//             onChangeText={setCustomer}
//           />
//         </View>

//         <View style={styles.row}>
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Tahsilat Şekli</Text>
//             <Picker
//               selectedValue={paymentMethod}
//               onValueChange={(itemValue: string) => setPaymentMethod(itemValue)}
//               style={styles.picker}
//             >
//               <Picker.Item label="Nakit" value="Nakit" />
//               <Picker.Item label="Kart" value="Kart" />
//               <Picker.Item label="Havale" value="Havale" />
//             </Picker>
//           </View>
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Fatura Tarihi</Text>
//             <TouchableOpacity
//               onPress={() => setShowDatePicker(true)}
//               style={styles.datePickerButton}
//             >
//               <Text>{invoiceDate.toLocaleDateString()}</Text>
//             </TouchableOpacity>
//             {showDatePicker && (
//               <DateTimePicker
//                 value={invoiceDate}
//                 mode="date"
//                 display="default"
//                 onChange={onChangeDate}
//               />
//             )}
//           </View>
//         </View>

//         <View style={styles.row}>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => navigation.navigate("SelectProduct")}
//           >
//             <Text style={styles.actionText}>Ürün Seç</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => setIsScannerVisible(true)}
//           >
//             <Text style={styles.actionText}>Barkod Oku</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.totalContainer}>
//           <Text style={styles.label}>Genel Toplam:</Text>
//           <Text style={styles.total}>{total} ₺</Text>
//         </View>

//         {/* Kaydet Butonu */}
//         <TouchableOpacity style={styles.saveButton}>
//           <Text style={styles.saveButtonText}>Kaydet</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   button: {
//     padding: 10,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   formContainer: {
//     flex: 1,
//   },
//   inputGroup: {
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   input: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   picker: {
//     height: 40,
//     width: "100%",
//   },
//   datePickerButton: {
//     padding: 10,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 5,
//     textAlign: "center",
//   },
//   actionButton: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: "#333",
//     margin: 5,
//     alignItems: "center",
//     borderRadius: 5,
//   },
//   actionText: {
//     color: "white",
//     fontSize: 16,
//   },
//   totalContainer: {
//     marginVertical: 20,
//   },
//   total: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   saveButton: {
//     padding: 15,
//     backgroundColor: "#ff4d4d",
//     alignItems: "center",
//     borderRadius: 5,
//   },
//   saveButtonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

// export default NewSale;