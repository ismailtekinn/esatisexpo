// import React from "react";
// import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { SaleItem, SaleItemDeneme } from "../types/saleType";

// type Props = {
//   product: SaleItemDeneme;
//   onPress?: () => void;
//   orderNumber: number;
// };

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const baseWidth = 375;
// const baseHeight = 812;

// const scale = screenWidth / baseWidth;
// const verticalScale = screenHeight / baseHeight;

// const getFontSize = (size: number) => Math.round(size * scale);
// const getVerticalSize = (size: number) => Math.round(size * verticalScale);

// const SalesCard: React.FC<Props> = ({ product, onPress, orderNumber }) => {
//   const total = product.Stock * product.Price;
//   const isSmallScreen = screenWidth < 400;

//   return (
//     <Pressable
//       onPress={onPress}
//       style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
//     >
//       <View style={styles.content}>
//         {/* Ana Satır */}
//         <View style={styles.mainRow}>
//           <View style={styles.indexBadge}>
//             <Text
//               style={[styles.indexText, isSmallScreen && styles.indexTextSmall]}
//             >
//               {orderNumber}
//             </Text>
//           </View>

//           <View style={styles.productSection}>
//             <Text
//               style={[
//                 styles.productName,
//                 isSmallScreen && styles.productNameSmall,
//               ]}
//               // numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {product.ProductName}
//             </Text>
//             <Text
//               style={[styles.barcode, isSmallScreen && styles.barcodeSmall]}
//               numberOfLines={1}
//               ellipsizeMode="middle"
//             >
//               #{product.Barcode}
//             </Text>
//           </View>

//           <View style={styles.rightSection}>
//             <Text style={[styles.vatRate, isSmallScreen && styles.vatRateSmall]}>
//               %{product.VatRate.toFixed(0)}
//             </Text>

//             <Text
//               style={[
//                 styles.calculation,
//                 isSmallScreen && styles.calculationSmall,
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {product.Stock} × {product.Price.toFixed(2)}
//             </Text>
//           </View>
//         </View>

//         {/* Alt Bilgiler */}
//         <View style={styles.bottomSection}>
//           <View style={styles.leftInfo}>
//             <Text
//               style={[
//                 styles.serialText,
//                 isSmallScreen && styles.serialTextSmall,
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="middle"
//             >
//               {product.Barcode}
//             </Text>
//             <Text
//               style={[styles.discount, isSmallScreen && styles.discountSmall]}
//             >
//               %10 İndirim
//             </Text>
//           </View>

//           <Text
//             style={[
//               styles.totalAmount,
//               isSmallScreen && styles.totalAmountSmall,
//             ]}
//           >
//             {total.toFixed(2)} TL
//           </Text>
//         </View>
//       </View>

//       <View style={styles.bottomBorder} />
//       <View style={styles.sideIndicator} />
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#007AFF",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     marginVertical: 1,
//     width: "100%",
//     height: screenHeight * 0.13,
//     position: "relative",
//     overflow: "hidden",
//   },

//   content: {
//     flex: 1,
//   },

//   mainRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//     flex: 1, // Ana satırın tüm alanı kullanmasını sağlar
//   },

//   indexBadge: {
//     width: 22,
//     height: 22,
//     borderRadius: 4,
//     backgroundColor: "#ff6b6b",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 8, // Gap yerine margin kullan
//   },

//   indexText: {
//     fontSize: getFontSize(10),
//     color: "#ffffff",
//   },
//   indexTextSmall: { fontSize: 9 },

//   productSection: {
//     flex: 1, // Mevcut alanı kullan
//     marginRight: 8,
//     minWidth: 0, // Flex shrinking için gerekli
//   },

//   productName: {
//     fontSize: 12 * scale,
//     fontWeight: "700",
//     color: "#ffffff",
//     marginBottom: 1,
//     lineHeight: 14,
//   },
//   productNameSmall: {
//     fontSize: 11,
//     lineHeight: 13,
//   },

//   barcode: {
//     fontSize: 9,
//     fontWeight: "500",
//     color: "#64ffda",
//     fontFamily: "monospace",
//     opacity: 0.8,
//     lineHeight: 10,
//   },
//   barcodeSmall: {
//     fontSize: 8,
//     lineHeight: 9,
//   },

//   // Sağ taraftaki elementi container'a aldık
//   rightSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexShrink: 0, // Bu bölümün küçülmemesini sağlar
//   },

//   vatRate: {
//     fontSize: 11,
//     fontWeight: "600",
//     color: "#64ffda",
//     minWidth: 35, // Biraz küçülttük
//     marginRight: 8,
//   },
//   vatRateSmall: { fontSize: 10 },

//   calculation: {
//     fontSize: 10,
//     fontWeight: "600",
//     color: "#ffffff",
//     minWidth: 75, // Biraz küçülttük
//     textAlign: "right",
//   },
//   calculationSmall: { fontSize: 9 },

//   bottomSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: "auto", // Alt kısma yapıştır
//   },

//   leftInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     flex: 1, // Mevcut alanı kullan
//     minWidth: 0, // Flex shrinking için
//   },

//   serialText: {
//     fontSize: 10,
//     fontWeight: "500",
//     color: "#ffffff",
//     // flex ve minWidth kaldırıldı
//   },
//   serialTextSmall: { fontSize: 9 },

//   discount: {
//     fontSize: 10,
//     fontWeight: "600",
//     color: "#64ffda",
//     flexShrink: 0, // İndirim texti küçülmesin
//   },
//   discountSmall: { fontSize: 9 },

//   totalAmount: {
//     fontSize: 13,
//     fontWeight: "900",
//     color: "#ffffff",
//     flexShrink: 0, // Total miktar küçülmesin
//   },
//   totalAmountSmall: { fontSize: 12 },

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
// import { SaleItemDeneme } from "../types/saleType";

// type Props = {
//   product: SaleItemDeneme;
//   onPress?: () => void;
//   orderNumber: number;
// };

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const baseWidth = 375;
// const baseHeight = 812;

// const scale = screenWidth / baseWidth;
// const vScale = screenHeight / baseHeight;

// const fs = (size: number) => Math.max(9, Math.round(size * scale)); // font-size
// const vs = (size: number) => Math.max(8, Math.round(size * vScale)); // vertical spacing
// const hs = (size: number) => Math.max(6, Math.round(size * scale)); // horizontal spacing

// const SalesCard: React.FC<Props> = ({ product, onPress, orderNumber }) => {
//   const total = (product.Stock ?? 0) * (product.Price ?? 0);
//   const isSmall = screenWidth < 360; // küçük telefonlar
//   const isLarge = screenWidth > 420; // büyük telefonlar

//   // Dinamik metin: küçük ekranda kısaltma
//   const discountText = "%10 İndirim"; // gerektiğinde prop’a bağlayabilirsin

//   return (
//     <Pressable
//       onPress={onPress}
//       style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
//     >
//       <View style={styles.content}>
//         {/* Ana Satır */}
//         <View style={styles.mainRow}>
//           <View
//             style={[styles.indexBadge, isLarge && { width: 26, height: 26 }]}
//           >
//             <Text style={[styles.indexText, isSmall && { fontSize: fs(9) }]}>
//               {orderNumber}
//             </Text>
//           </View>

//           <View style={styles.productSection}>
//             <Text
//               style={[
//                 styles.productName,
//                 isSmall && { fontSize: fs(11), lineHeight: fs(13) },
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {product.ProductName}
//             </Text>

//             <Text
//               style={[
//                 styles.barcode,
//                 isSmall && { fontSize: fs(8), lineHeight: fs(10) },
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="middle"
//             >
//               #{product.Barcode}
//             </Text>
//           </View>

//           <View style={styles.rightSection}>
//             <Text
//               style={[
//                 styles.vatRate,
//                 isSmall && { fontSize: fs(10), minWidth: 32 },
//               ]}
//             >
//               %{(product.VatRate ?? 0).toFixed(0)}
//             </Text>

//             <Text
//               style={[
//                 styles.calculation,
//                 isSmall && { fontSize: fs(11), minWidth: 70 },
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {product.Stock} × {(product.Price ?? 0).toFixed(2)}
//             </Text>
//           </View>
//         </View>

//         {/* Alt Satır */}
//         <View style={styles.bottomSection}>
//           <View style={styles.leftInfo}>
//             <Text
//               style={[styles.serialText, isSmall && { fontSize: fs(9) }]}
//               numberOfLines={1}
//               ellipsizeMode="middle"
//             >
//               {String(product.Barcode)}
//             </Text>

//             <Text
//               style={[styles.discount, isSmall && { fontSize: fs(9) }]}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {discountText}
//             </Text>
//           </View>

//           <Text
//             style={[styles.totalAmount, isSmall && { fontSize: fs(12) }]}
//             numberOfLines={1}
//           >
//             {total.toFixed(2)} TL
//           </Text>
//         </View>
//       </View>

//       <View style={styles.bottomBorder} />
//       <View style={styles.sideIndicator} />
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     // backgroundColor: "#007AFF",
//   backgroundColor: "#e0e0e0",
//     borderColor: "#007AFF",

//     borderRadius: hs(10),
//     paddingHorizontal: hs(10),
//     paddingVertical: vs(8),
//     marginVertical: vs(2),
//     width: "100%",
//     minHeight: vs(100), // sabit yükseklik yerine min-height
//     position: "relative",
//     overflow: "hidden",
//   },
//   content: {
//     flex: 1,
//   },
//   mainRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: vs(6),
//     minHeight: vs(26),
//   },
//   indexBadge: {
//     width: 22,
//     height: 22,
//     borderRadius: 4,
//     backgroundColor: "#ff6b6b",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: hs(8),
//   },
//   indexText: {
//     fontSize: fs(10),
//     color: "#ffffff",
//     lineHeight: fs(12),
//   },
//   productSection: {
//     flex: 1,
//     marginRight: hs(8),
//     minWidth: 0,
//   },
//   productName: {
//     fontSize: fs(12),
//     // fontWeight: "700",
//     fontWeight: "bold",
//     // color: "#ffffff",
//     color: "#333",
//     marginBottom: vs(1),
//     lineHeight: fs(14),
//   },
//   barcode: {
//     fontSize: fs(11),
//     padding: 2,
//     fontWeight: "500",
//     // color: "#64ffda",
//     color: "#333",
//     fontFamily: "monospace",
//     opacity: 0.85,
//     lineHeight: fs(10),
//   },
//   rightSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexShrink: 0,
//     gap: hs(6),
//   },
//   vatRate: {
//     fontSize: fs(12),
//     fontWeight: "600",
//     // color: "#64ffda",
//     color: "#333",
//     minWidth: 36,
//     textAlign: "right",
//   },
//   calculation: {
//     fontSize: fs(10),
//     fontWeight: "600",
//     // color: "#ffffff",
//     color: "#333",
//     minWidth: 78,
//     textAlign: "right",
//   },
//   bottomSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: "auto",
//     minHeight: vs(22),
//   },
//   leftInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: hs(8),
//     flex: 1,
//     minWidth: 0,
//   },
//   serialText: {
//     fontSize: fs(10),
//     fontWeight: "500",
//     // color: "#ffffff",
//     color: "#333",
//     lineHeight: fs(12),
//     flexShrink: 1,
//   },
//   discount: {
//     fontSize: fs(10),
//     fontWeight: "700",
//     // color: "#64ffda",
//     color: "#333",
//     lineHeight: fs(12),
//     flexShrink: 1,
//   },
//   totalAmount: {
//     fontSize: fs(13),
//     fontWeight: "900",
//     // color: "#ffffff",
//     color: "#333",
//     textAlign: "right",
//   },
//   bottomBorder: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 1,
//     backgroundColor: "rgba(255,255,255,0.25)",
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

////////////////////////////////////////////////////////////////// Container sınırlarının Mavi olduğu hali

// import React from "react";
// import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
// import { SaleItemDeneme } from "../types/saleType";

// type Props = {
//   product: SaleItemDeneme;
//   onPress?: () => void;
//   orderNumber: number;
// };

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const baseWidth = 375;
// const baseHeight = 812;

// const scale = screenWidth / baseWidth;
// const vScale = screenHeight / baseHeight;

// const fs = (size: number) => Math.max(9, Math.round(size * scale)); // font-size
// const vs = (size: number) => Math.max(8, Math.round(size * vScale)); // vertical spacing
// const hs = (size: number) => Math.max(6, Math.round(size * scale)); // horizontal spacing

// const SalesCard: React.FC<Props> = ({ product, onPress, orderNumber }) => {
//   const total = (product.Stock ?? 0) * (product.Price ?? 0);
//   const isSmall = screenWidth < 360; // küçük telefonlar
//   const isLarge = screenWidth > 420; // büyük telefonlar

//   // Dinamik metin: küçük ekranda kısaltma
//   const discountText = "%10 İndirim"; // gerektiğinde prop'a bağlayabilirsin

//   return (
//     <Pressable
//       onPress={onPress}
//       style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
//     >
//       <View style={styles.content}>
//         {/* Ana Satır */}
//         <View style={styles.mainRow}>
//           <View
//             style={[styles.indexBadge, isLarge && { width: 26, height: 26 }]}
//           >
//             <Text style={[styles.indexText, isSmall && { fontSize: fs(9) }]}>
//               {orderNumber}
//             </Text>
//           </View>

//           <View style={styles.productSection}>
//             <Text
//               style={[
//                 styles.productName,
//                 isSmall && { fontSize: fs(11), lineHeight: fs(13) },
//               ]}
//               // numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {product.ProductName}
//             </Text>

//             <Text
//               style={[
//                 styles.barcode,
//                 isSmall && { fontSize: fs(8), lineHeight: fs(10) },
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="middle"
//             >
//               #{product.Barcode}
//             </Text>
//           </View>

//           <View style={styles.rightSection}>
//             <Text
//               style={[
//                 styles.vatRate,
//                 isSmall && { fontSize: fs(10), minWidth: 32 },
//               ]}
//             >
//               %{(product.VatRate ?? 0).toFixed(0)}
//             </Text>

//             <Text
//               style={[
//                 styles.calculation,
//                 isSmall && { fontSize: fs(11), minWidth: 70 },
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {product.Stock} × {(product.Price ?? 0).toFixed(2)}
//             </Text>
//           </View>
//         </View>

//         {/* Alt Satır */}
//         <View style={styles.bottomSection}>
//           <View style={styles.leftInfo}>
//             <Text
//               style={[styles.serialText, isSmall && { fontSize: fs(9) }]}
//               numberOfLines={1}
//               ellipsizeMode="middle"
//             >
//               {String(product.Barcode)}
//             </Text>

//             <Text
//               style={[styles.discount, isSmall && { fontSize: fs(9) }]}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {discountText}
//             </Text>
//           </View>

//           <Text
//             style={[styles.totalAmount, isSmall && { fontSize: fs(12) }]}
//             numberOfLines={1}
//           >
//             {total.toFixed(2)} TL
//           </Text>
//         </View>
//       </View>

//       <View style={styles.bottomBorder} />
//       <View style={styles.sideIndicator} />
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#f8f9fa", // Açık gri arka plan
//     borderColor: "#007AFF",
//     borderWidth: 1,
//     borderRadius: hs(10),
//     paddingHorizontal: hs(10),
//     paddingVertical: vs(8),
//     // marginVertical: vs(2),
//     width: "100%",
//     minHeight: vs(110),
//     position: "relative",
//     overflow: "hidden",
//     elevation: 2, // Android shadow
//     shadowColor: "#2c3e50", // iOS shadow
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   content: {
//     flex: 1,
//   },
//   mainRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: vs(6),
//     minHeight: vs(26),
//   },
//   indexBadge: {
//     width: 22,
//     height: 22,
//     borderRadius: 4,
//     // backgroundColor: "#3498db", // Profesyonel mavi
//     backgroundColor: "#007AFF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: hs(8),
//   },
//   indexText: {
//     fontSize: fs(10),
//     color: "#ffffff",
//     lineHeight: fs(12),
//     fontWeight: "600",
//   },
//   productSection: {
//     flex: 1,
//     marginRight: hs(8),
//     minWidth: 0,
//   },
//   productName: {
//     fontSize: fs(12),
//     fontWeight: "bold",
//     color: "#2c3e50", // Koyu gri
//     marginBottom: vs(1),
//     lineHeight: fs(14),
//   },
//   barcode: {
//     fontSize: fs(11),
//     padding: 2,
//     fontWeight: "500",
//     color: "#5a6c7d", // Orta gri
//     fontFamily: "monospace",
//     opacity: 0.85,
//     lineHeight: fs(10),
//   },
//   rightSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexShrink: 0,
//     gap: hs(6),
//   },
//   vatRate: {
//     fontSize: fs(12),
//     fontWeight: "600",
//     color: "#3498db", // Mavi vurgu
//     minWidth: 36,
//     textAlign: "right",
//   },
//   calculation: {
//     fontSize: fs(10),
//     fontWeight: "600",
//     color: "#5a6c7d", // Orta gri
//     minWidth: 78,
//     textAlign: "right",
//   },
//   bottomSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: "auto",
//     minHeight: vs(22),
//   },
//   leftInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: hs(8),
//     flex: 1,
//     minWidth: 0,
//   },
//   serialText: {
//     fontSize: fs(10),
//     fontWeight: "500",
//     color: "#5a6c7d", // Orta gri
//     lineHeight: fs(12),
//     flexShrink: 1,
//   },
//   discount: {
//     fontSize: fs(10),
//     fontWeight: "700",
//     color: "#2980b9", // Koyu mavi
//     lineHeight: fs(12),
//     flexShrink: 1,
//   },
//   totalAmount: {
//     fontSize: fs(13),
//     fontWeight: "900",
//     color: "#2c3e50", // Koyu gri
//     textAlign: "right",
//   },
//   bottomBorder: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 1,
//     backgroundColor: "#bdc3c7", // Açık gri border
//     opacity: 0.3,
//   },
//   sideIndicator: {
//     position: "absolute",
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: 3,
//     // backgroundColor: "#3498db",
//   },
// });

// export default SalesCard;
