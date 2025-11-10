// import React from "react";
// import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { SaleItem, SaleItemDeneme } from "../types/saleType";

// const { width: screenWidth } = Dimensions.get("window");
// type Props = {
//   product: SaleItemDeneme;
//   onPress?: () => void;
//   orderNumber: number;
// };
// const SalesCard: React.FC<Props> = ({ product, onPress,orderNumber }) => {
//   const total = product.Stock * product.Price;
//   const isSmallScreen = screenWidth < 400;

//   return (
//     <Pressable
//       onPress={onPress}
//       style={({ pressed }) => [
//         styles.card,
//         pressed && { opacity: 0.8 },
//       ]}
//     >
//       <View style={styles.content}>
//         <View style={styles.headerRow}>
//           <View style={styles.leftSection}>
//             <View style={styles.indexBadge}>
//               <Text style={[styles.indexText, isSmallScreen && styles.indexTextSmall]}>
//                 {orderNumber}
//               </Text>
//             </View>
//             <View style={styles.productInfo}>
//               <Text
//                 style={[styles.title, isSmallScreen && styles.titleSmall]}
//                 numberOfLines={1}
//               >
//                 {product.ProductName}
//               </Text>
//               <Text
//                 style={[styles.code, isSmallScreen && styles.codeSmall]}
//                 numberOfLines={1}
//               >
//                 #{product.Barcode}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.totalSection}>
//             <Text style={[styles.totalAmount, isSmallScreen && styles.totalAmountSmall]}>
//               {total.toFixed(2)}
//             </Text>
//             <Text style={[styles.currency, isSmallScreen && styles.currencySmall]}>
//               {product.Currency}
//             </Text>
//           </View>
//         </View>

//         {/* Stats row */}
//         <View style={styles.statsRow}>
//           <View style={styles.statItem}>
//             {/* <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>
//               ADET
//             </Text> */}
//             <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>
//               {product.Stock}
//             </Text>
//           </View>

//           <View style={styles.statItem}>
//             {/* <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>
//               KDV
//             </Text> */}
//             <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>
//               %{product.VatRate.toFixed(0)}
//             </Text>
//           </View>

//           <View style={styles.statItem}>
//             {/* <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>
//               BİRİM
//             </Text> */}
//             <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>
//               {product.Price.toFixed(2)}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Bottom border */}
//       <View style={styles.bottomBorder} />

//       {/* Side indicator */}
//       <View style={styles.sideIndicator} />
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     // backgroundColor: "#4A90E2",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     // borderRadius:5,
//     marginVertical: 1,
//     width: "100%",
//     // height: 70, // Çok daha kısa: 100'den 70'e
//     position: "relative",
//     overflow: "hidden",
//   },

//   content: {
//     flex: 1,
//     justifyContent: "space-between",
//   },

//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },

//   leftSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },

//   indexBadge: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     backgroundColor: "#ff6b6b",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },

//   indexText: {
//     fontSize: 9,
//     fontWeight: "900",
//     color: "#ffffff",
//   },

//   indexTextSmall: {
//     fontSize: 8,
//   },

//   productInfo: {
//     flex: 1,
//     marginRight: 10,
//   },

//   title: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#ffffff",
//     marginBottom: 1,
//     lineHeight: 12,
//   },

//   titleSmall: {
//     fontSize: 10,
//     lineHeight: 11,
//   },

//   code: {
//     fontSize: 10,
//     fontWeight: "500",
//     color: "#64ffda",
//     fontFamily: "monospace",
//     opacity: 0.8,
//   },

//   codeSmall: {
//     fontSize: 7,
//   },

//   totalSection: {
//     alignItems: "flex-end",
//   },

//   totalAmount: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: "#ffffff",
//     lineHeight: 16,
//   },

//   totalAmountSmall: {
//     fontSize: 13,
//     lineHeight: 15,
//   },

//   currency: {
//     fontSize: 8,
//     fontWeight: "600",
//     color: "#64ffda",
//     marginTop: 1,
//   },

//   currencySmall: {
//     fontSize: 7,
//   },

//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     // backgroundColor: "rgba(255, 255, 255, 0.03)",
//     // borderRadius: 4,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//   },

//   statItem: {
//     alignItems: "center",
//     minWidth: 40,
//   },

//   statLabel: {
//     fontSize: 6,
//     fontWeight: "600",
//     color: "rgba(255, 255, 255, 0.5)",
//     marginBottom: 1,
//     letterSpacing: 0.2,
//   },

//   statLabelSmall: {
//     fontSize: 5,
//   },

//   statValue: {
//     fontSize: 8,
//     fontWeight: "700",
//     color: "#ffffff",
//   },

//   statValueSmall: {
//     fontSize: 7,
//   },

//   bottomBorder: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 1,
//     backgroundColor: "#e5e7eb",
//   },

//   sideIndicator: {
//     position: "absolute",
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: 3,
//   },
// });

// export default SalesCard;

// import React from "react";
// import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { SaleItem, SaleItemDeneme } from "../types/saleType";

// const { width: screenWidth } = Dimensions.get("window");
// type Props = {
//   product: SaleItemDeneme;
//   onPress?: () => void;
//   orderNumber: number;
// };
// const SalesCard: React.FC<Props> = ({ product, onPress, orderNumber }) => {
//   const total = product.Stock * product.Price;
//   const isSmallScreen = screenWidth < 400;

//   return (
//     <Pressable
//       onPress={onPress}
//       style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
//     >
//       <View style={styles.content}>
//         <View style={styles.headerRow}>
//           <View style={styles.leftSection}>
//             <View style={styles.indexBadge}>
//               <Text
//                 style={[
//                   styles.indexText,
//                   isSmallScreen && styles.indexTextSmall,
//                 ]}
//               >
//                 {orderNumber}
//               </Text>
//             </View>
//             <View style={styles.productInfo}>
//               <Text
//                 style={[styles.title, isSmallScreen && styles.titleSmall]}
//                 numberOfLines={1}
//               >
//                 {product.ProductName}
//               </Text>
//               <Text
//                 style={[styles.code, isSmallScreen && styles.codeSmall]}
//                 numberOfLines={1}
//               >
//                 #{product.Barcode}
//               </Text>
//             </View>
//           </View>

//           {/* <View style={styles.totalSection}>
//             <Text style={[styles.totalAmount, isSmallScreen && styles.totalAmountSmall]}>
//               {product.Stock}*{product.Price}
//             </Text>
//             <Text style={[styles.currency, isSmallScreen && styles.currencySmall]}>
//             </Text>
//           </View> */}
//           <View
//             style={[styles.totalSection, { flexDirection: "row", gap: 15 }]}
//           >
//             <Text
//               style={[
//                 styles.totalAmount,
//                 isSmallScreen && styles.totalAmountSmall,
//               ]}
//             >
//               {product.VatRate}
//             </Text>
//             <Text
//               style={[
//                 styles.totalAmount,
//                 isSmallScreen && styles.totalAmountSmall,
//               ]}
//             >
//               {product.Stock}*{product.Price}
//             </Text>

//             <Text
//               style={[styles.currency, isSmallScreen && styles.currencySmall]}
//             ></Text>
//           </View>
//         </View>

//         {/* Stats row */}
//         <View style={styles.statsRow}>
//           <Text
//             style={[
//               styles.totalAmount,
//               isSmallScreen && styles.totalAmountSmall,
//             ]}
//           >
//             {total.toFixed(2)}
//           </Text>
//           {/* <View style={styles.statItem}>
//             <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>
//               ADET
//             </Text>
//             <Text
//               style={[styles.statValue, isSmallScreen && styles.statValueSmall]}
//             >
//               {product.Stock}
//             </Text>
//           </View> */}

//           {/* <View style={styles.statItem}>
//             <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>
//               KDV
//             </Text>
//             <Text
//               style={[styles.statValue, isSmallScreen && styles.statValueSmall]}
//             >
//               %{product.VatRate.toFixed(0)}
//             </Text>
//           </View> */}

//           {/* <View style={styles.statItem}>
//             <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>
//               BİRİM
//             </Text>
//             <Text
//               style={[styles.statValue, isSmallScreen && styles.statValueSmall]}
//             >
//               {product.Price.toFixed(2)}
//             </Text>
//           </View> */}
//         </View>
//       </View>

//       {/* Bottom border */}
//       <View style={styles.bottomBorder} />

//       {/* Side indicator */}
//       <View style={styles.sideIndicator} />
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     // backgroundColor: "#4A90E2",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     // borderRadius:5,
//     marginVertical: 1,
//     width: "100%",
//     // height: 70, // Çok daha kısa: 100'den 70'e
//     position: "relative",
//     overflow: "hidden",
//   },

//   content: {
//     flex: 1,
//     justifyContent: "space-between",
//   },

//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },

//   leftSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },

//   indexBadge: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     backgroundColor: "#ff6b6b",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },

//   indexText: {
//     fontSize: 9,
//     fontWeight: "900",
//     color: "#ffffff",
//   },

//   indexTextSmall: {
//     fontSize: 8,
//   },

//   productInfo: {
//     flex: 1,
//     marginRight: 10,
//   },

//   title: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#ffffff",
//     marginBottom: 1,
//     lineHeight: 12,
//   },

//   titleSmall: {
//     fontSize: 10,
//     lineHeight: 11,
//   },

//   code: {
//     fontSize: 10,
//     fontWeight: "500",
//     color: "#64ffda",
//     fontFamily: "monospace",
//     opacity: 0.8,
//   },

//   codeSmall: {
//     fontSize: 7,
//   },

//   totalSection: {
//     alignItems: "flex-end",
//   },

//   totalAmount: {
//     fontSize: 10,
//     fontWeight: "900",
//     color: "#ffffff",
//     lineHeight: 16,
//   },

//   totalAmountSmall: {
//     fontSize: 13,
//     lineHeight: 15,
//   },

//   currency: {
//     fontSize: 8,
//     fontWeight: "600",
//     color: "#64ffda",
//     marginTop: 1,
//   },

//   currencySmall: {
//     fontSize: 7,
//   },

//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     // backgroundColor: "rgba(255, 255, 255, 0.03)",
//     // borderRadius: 4,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//   },

//   statItem: {
//     alignItems: "center",
//     minWidth: 40,
//   },

//   statLabel: {
//     fontSize: 6,
//     fontWeight: "600",
//     color: "rgba(255, 255, 255, 0.5)",
//     marginBottom: 1,
//     letterSpacing: 0.2,
//   },

//   statLabelSmall: {
//     fontSize: 5,
//   },

//   statValue: {
//     fontSize: 9,
//     fontWeight: "700",
//     color: "#ffffff",
//   },

//   statValueSmall: {
//     fontSize: 7,
//   },

//   bottomBorder: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 1,
//     backgroundColor: "#e5e7eb",
//   },

//   sideIndicator: {
//     position: "absolute",
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: 3,
//   },
// });

// export default SalesCard;
