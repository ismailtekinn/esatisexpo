// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Vibration,
//   Platform,
//   Dimensions,
// } from "react-native";

// type Props = {
//   onKey?: (text: string) => void;
//   onBackspace?: () => void;
//   onClear?: () => void;
//   onEnter?: () => void;
//   onKeyPress?: (char: string) => void; // tuşa basılınca dönecek
//   decimal?: "." | ",";
//   height?: number;
//   defaultMode?: "number" | "letter";
//   enableHapticFeedback?: boolean;
//   theme?: "dark" | "light";
//   compact?: boolean; // Sıkışık mod
// };

// const LETTER_ROWS_TR = [
//   "Q W E R T Y U I O P Ğ Ü",
//   "A S D F G H J K L Ş İ",
//   "Z X C V B N M Ö Ç",
// ];

// const TURKISH_LETTER_ROWS = [
//   "Q W E R T Y U I O P Ğ Ü",
//   "A S D F G H J K L Ş İ",
//   "Z X C V B N M Ö Ç",
// ];

// const OnScreenKeyboard: React.FC<Props> = ({
//   onKey,
//   onBackspace,
//   onClear,
//   onEnter,
//   onKeyPress,
//   decimal = ",",
//   height = 280,
//   defaultMode = "number",
//   enableHapticFeedback = true,
//   theme = "dark",
//   compact = false,
// }) => {
//   const [mode, setMode] = useState<"number" | "letter">(defaultMode);
//   const [isShift, setIsShift] = useState(false);
//   const [pressedKey, setPressedKey] = useState<string | null>(null);

//   const screenWidth = Dimensions.get("window").width;

//   // Dinamik boyutları hesapla
//   const getDimensions = () => {
//     const padding = compact ? 8 : 12;
//     const gap = compact ? 3 : 5;
//     const baseKeyHeight = compact ? 38 : 42;
//     const ctrlHeight = compact ? 36 : 40;

//     const availableHeight = height - padding * 2;
//     const numberOfMainRows = mode === "number" ? 4 : 3;
//     const totalGaps = (numberOfMainRows - 1) * gap + gap; // ana satırlar arası + ctrl gap
//     const remainingHeight = availableHeight - totalGaps - ctrlHeight;
//     const calculatedKeyHeight = Math.max(
//       Math.min(remainingHeight / numberOfMainRows, baseKeyHeight),
//       32 // minimum yükseklik
//     );

//     return {
//       padding,
//       gap,
//       keyHeight: calculatedKeyHeight,
//       ctrlHeight,
//       fontSize: calculatedKeyHeight < 38 ? 14 : 16,
//       ctrlFontSize: calculatedKeyHeight < 38 ? 12 : 14,
//     };
//   };

//   const dims = React.useMemo(() => getDimensions(), [height, compact, mode]);

//   // Haptic feedback fonksiyonu
//   const triggerHaptic = () => {
//     if (enableHapticFeedback && Platform.OS === "ios") {
//       // iOS için haptic feedback
//     } else if (enableHapticFeedback && Platform.OS === "android") {
//       // Vibration.vibrate(30);
//     }
//   };

//   // Tema stilleri
//   const getThemeStyles = () => {
//     if (theme === "light") {
//       return {
//         wrap: { backgroundColor: "#f8f9fa", borderColor: "#e9ecef" },
//         keyNum: { backgroundColor: "#ffffff", shadowColor: "#333" },
//         keyNumText: { color: "#212529" },
//         keyAction: { backgroundColor: "#6c757d" },
//         keyActionText: { color: "#ffffff" },
//         keyActionAlt: { backgroundColor: "#ffc107" },
//         keyActionAltText: { color: "#000" },
//         keyConfirm: { backgroundColor: "#0d6efd" },
//         keyConfirmText: { color: "#ffffff" },
//         ctrlKey: { backgroundColor: "#6c757d" },
//         spaceKey: { backgroundColor: "#6c757d" },
//         keyText: { color: "#ffffff" },
//       };
//     }
//     return {
//       wrap: { backgroundColor: "#0f1116", borderColor: "#1f2430" },
//       keyNum: { backgroundColor: "#1e2533", shadowColor: "#000" },
//       keyNumText: { color: "#ffffff" },
//       keyAction: { backgroundColor: "#2a3142" },
//       keyActionText: { color: "#ff7f50" },
//       keyActionAlt: { backgroundColor: "#2a3142" },
//       keyActionAltText: { color: "#ffd166" },
//       keyConfirm: { backgroundColor: "#2b6ef2" },
//       keyConfirmText: { color: "#ffffff" },
//       ctrlKey: { backgroundColor: "#2a3142" },
//       spaceKey: { backgroundColor: "#2a3142" },
//       keyText: { color: "#e6ebf5" },
//     };
//   };

//   const themeStyles = getThemeStyles();

//   // Number pad düzeni
//   const numberRows: (
//     | string
//     | { type: "backspace" | "clear" | "enter" | "ok" }
//   )[][] = useMemo(
//     () => [
//       ["7", "8", "9", { type: "backspace" }],
//       ["4", "5", "6", { type: "clear" }],
//       ["1", "2", "3", { type: "enter" }],
//       [decimal, "0", "00", { type: "ok" }],
//     ],
//     [decimal]
//   );

//   // const letterRows = useMemo(() => LETTER_ROWS_TR.map((r) => r.split(" ")), []);
//   const letterRows = useMemo(
//     () => TURKISH_LETTER_ROWS.map((r) => r.split(" ")),
//     []
//   );

//   // Key press animasyonu
//   const handleKeyPress = (key: string, callback?: () => void) => {
//     triggerHaptic();
//     setPressedKey(key);
//     // setTimeout(() => setPressedKey(null), 10);
//     callback?.();
//   };

//   // Number cell render
//   const renderNumCell = (
//     cell: string | { type: "backspace" | "clear" | "enter" | "ok" }
//   ) => {
//     if (typeof cell === "string") {
//       const isPressed = pressedKey === cell;
//       return (
//         <TouchableOpacity
//           key={cell}
//           style={[
//             styles.key,
//             {
//               backgroundColor: themeStyles.keyNum.backgroundColor,
//               height: dims.keyHeight,
//             },
//             isPressed && styles.keyPressed,
//             styles.keyWithShadow,
//           ]}
//           onPress={() => handleKeyPress(cell, () => onKey?.(cell))}
//           activeOpacity={0.85}
//         >
//           <Text
//             style={[
//               styles.keyNumText,
//               {
//                 color: themeStyles.keyNumText.color,
//                 fontSize: dims.fontSize,
//               },
//             ]}
//           >
//             {cell}
//           </Text>
//         </TouchableOpacity>
//       );
//     }

//     const getSpecialKeyContent = () => {
//       switch (cell.type) {
//         case "backspace":
//           return {
//             key: "backspace",
//             style: [
//               styles.key,
//               {
//                 backgroundColor: themeStyles.keyAction.backgroundColor,
//                 height: dims.keyHeight,
//               },
//               styles.keyWithShadow,
//             ],
//             onPress: () => handleKeyPress("backspace", onBackspace),
//             text: "⌫",
//             textStyle: [
//               styles.keyActionText,
//               {
//                 color: themeStyles.keyActionText.color,
//                 fontSize: dims.fontSize + 2,
//               },
//             ],
//           };
//         case "clear":
//           return {
//             key: "clear",
//             style: [
//               styles.key,
//               {
//                 backgroundColor: themeStyles.keyActionAlt.backgroundColor,
//                 height: dims.keyHeight,
//               },
//               styles.keyWithShadow,
//             ],
//             onPress: () => handleKeyPress("clear", onClear),
//             text: "C",
//             textStyle: [
//               styles.keyActionAltText,
//               {
//                 color: themeStyles.keyActionAltText.color,
//                 fontSize: dims.fontSize,
//               },
//             ],
//           };
//         case "enter":
//           return {
//             key: "enter",
//             style: [
//               styles.key,
//               {
//                 backgroundColor: themeStyles.keyConfirm.backgroundColor,
//                 height: dims.keyHeight,
//               },
//               styles.keyWithShadow,
//             ],
//             onPress: () => handleKeyPress("enter", onEnter),
//             text: "↵",
//             textStyle: [
//               styles.keyConfirmText,
//               {
//                 color: themeStyles.keyConfirmText.color,
//                 fontSize: dims.fontSize,
//               },
//             ],
//           };
//         default:
//           return {
//             key: "ok",
//             style: [
//               styles.key,
//               {
//                 backgroundColor: themeStyles.keyConfirm.backgroundColor,
//                 height: dims.keyHeight,
//               },
//               styles.keyWithShadow,
//             ],
//             onPress: () => handleKeyPress("ok", onEnter),
//             text: "OK",
//             textStyle: [
//               styles.keyConfirmText,
//               {
//                 color: themeStyles.keyConfirmText.color,
//                 fontSize: dims.fontSize - 2,
//               },
//             ],
//           };
//       }
//     };

//     const keyConfig = getSpecialKeyContent();
//     const isPressed = pressedKey === keyConfig.key;

//     return (
//       <TouchableOpacity
//         key={keyConfig.key}
//         style={[keyConfig.style, isPressed && styles.keyPressed]}
//         onPress={keyConfig.onPress}
//         activeOpacity={0.85}
//       >
//         <Text style={keyConfig.textStyle}>{keyConfig.text}</Text>
//       </TouchableOpacity>
//     );
//   };

//   // Letter key render
//   const renderLetterKey = (k: string, rowLength: number) => {
//     const label = isShift ? k.toUpperCase() : k.toLowerCase();
//     const isPressed = pressedKey === label;

//     const flexValue = 1 / rowLength;
//     return (
//       <TouchableOpacity
//         key={k}
//         style={[
//           styles.key,
//           {
//             backgroundColor: themeStyles.keyNum.backgroundColor,
//             height: dims.keyHeight,
//             // flex: flexValue,
//             // minWidth: 30, // minimum genişlik
//             // maxWidth: 60, // maksimum genişlik
//             flex:1,
//           },
//           isPressed && styles.keyPressed,
//           styles.keyWithShadow,
//         ]}
//         onPress={() =>
//           handleKeyPress(label, () => {
//             onKey?.(label);
//             setIsShift(false);
//           })
//         }
//         activeOpacity={0.85}
//       >
//         <Text
//           style={[
//             styles.keyNumText,
//             {
//               color: themeStyles.keyNumText.color,
//               fontSize: dims.fontSize,
//             },
//           ]}
//         >
//           {label}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View
//       style={[
//         styles.wrap,
//         themeStyles.wrap,
//         {
//           height,
//           padding: dims.padding,
//         },
//       ]}
//     >
//       {mode === "number" ? (
//         <>
//           {/* Number rows */}
//           {numberRows.map((row, i) => (
//             <View
//               key={`nr-${i}`}
//               style={[
//                 styles.row,
//                 {
//                   gap: dims.gap,
//                   marginBottom:
//                     i === numberRows.length - 1 ? dims.gap : dims.gap,
//                 },
//               ]}
//             >
//               {row.map(renderNumCell)}
//             </View>
//           ))}

//           {/* Number kontrol satırı */}
//           <View
//             style={[
//               styles.ctrlRow,
//               {
//                 gap: dims.gap,
//                 height: dims.ctrlHeight,
//               },
//             ]}
//           >
//             <TouchableOpacity
//               style={[
//                 styles.ctrlKey,
//                 {
//                   backgroundColor: themeStyles.ctrlKey.backgroundColor,
//                   height: dims.ctrlHeight,
//                 },
//               ]}
//               onPress={() => handleKeyPress("abc", () => setMode("letter"))}
//               activeOpacity={0.85}
//             >
//               <Text
//                 style={[
//                   styles.keyTextStrong,
//                   {
//                     color: themeStyles.keyText.color,
//                     fontSize: dims.ctrlFontSize,
//                   },
//                 ]}
//               >
//                 ABC
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.spaceKey,
//                 {
//                   backgroundColor: themeStyles.spaceKey.backgroundColor,
//                   height: dims.ctrlHeight,
//                 },
//               ]}
//               onPress={() => handleKeyPress("space", () => onKey?.(" "))}
//               activeOpacity={0.85}
//             >
//               <Text
//                 style={[
//                   styles.keyText,
//                   {
//                     color: themeStyles.keyText.color,
//                     fontSize: dims.ctrlFontSize,
//                   },
//                 ]}
//               >
//                 Boşluk
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.ctrlKey,
//                 {
//                   backgroundColor: themeStyles.keyConfirm.backgroundColor,
//                   height: dims.ctrlHeight,
//                 },
//               ]}
//               onPress={() => handleKeyPress("enter-ctrl", onEnter)}
//               activeOpacity={0.85}
//             >
//               <Text
//                 style={[
//                   styles.keyTextStrong,
//                   {
//                     color: themeStyles.keyConfirmText.color,
//                     fontSize: dims.ctrlFontSize,
//                   },
//                 ]}
//               >
//                 Enter
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       ) : (
//         <>
//           {/* Letter rows */}
//           {letterRows.map((row, i) => (
//             <View
//               key={`lr-${i}`}
//               style={[
//                 styles.row,
//                 {
//                   gap: dims.gap,
//                   marginBottom:
//                     i === letterRows.length - 1 ? dims.gap : dims.gap,
//                 },
//               ]}
//             >
//               {row.map(renderLetterKey)}
//               {/* Son satıra backspace */}
//               {i === letterRows.length - 1 && (
//                 <TouchableOpacity
//                   style={[
//                     styles.key,
//                     styles.wideKey,
//                     {
//                       backgroundColor: themeStyles.keyAction.backgroundColor,
//                       height: dims.keyHeight,
//                     },
//                     styles.keyWithShadow,
//                   ]}
//                   onPress={() =>
//                     handleKeyPress("backspace-letter", onBackspace)
//                   }
//                   activeOpacity={0.85}
//                 >
//                   <Text
//                     style={[
//                       styles.keyActionText,
//                       {
//                         color: themeStyles.keyActionText.color,
//                         fontSize: dims.fontSize + 2,
//                       },
//                     ]}
//                   >
//                     ⌫
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           ))}

//           {/* Letter kontrol satırı */}
//           <View
//             style={[
//               styles.ctrlRow,
//               {
//                 gap: dims.gap,
//                 height: dims.ctrlHeight,
//               },
//             ]}
//           >
//             <TouchableOpacity
//               style={[
//                 styles.ctrlKey,
//                 {
//                   backgroundColor: themeStyles.ctrlKey.backgroundColor,
//                   height: dims.ctrlHeight,
//                 },
//               ]}
//               onPress={() => handleKeyPress("123", () => setMode("number"))}
//               activeOpacity={0.85}
//             >
//               <Text
//                 style={[
//                   styles.keyTextStrong,
//                   {
//                     color: themeStyles.keyText.color,
//                     fontSize: dims.ctrlFontSize,
//                   },
//                 ]}
//               >
//                 123
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.ctrlKey,
//                 {
//                   backgroundColor: isShift
//                     ? themeStyles.keyConfirm.backgroundColor
//                     : themeStyles.ctrlKey.backgroundColor,
//                   height: dims.ctrlHeight,
//                 },
//               ]}
//               onPress={() =>
//                 handleKeyPress("shift", () => setIsShift((s) => !s))
//               }
//               activeOpacity={0.85}
//             >
//               <Text
//                 style={[
//                   styles.keyTextStrong,
//                   {
//                     color: isShift
//                       ? themeStyles.keyConfirmText.color
//                       : themeStyles.keyText.color,
//                     fontSize: dims.ctrlFontSize + 2,
//                   },
//                 ]}
//               >
//                 ⇧
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.spaceKey,
//                 {
//                   backgroundColor: themeStyles.spaceKey.backgroundColor,
//                   height: dims.ctrlHeight,
//                 },
//               ]}
//               onPress={() => handleKeyPress("space-letter", () => onKey?.(" "))}
//               activeOpacity={0.85}
//             >
//               <Text
//                 style={[
//                   styles.keyText,
//                   {
//                     color: themeStyles.keyText.color,
//                     fontSize: dims.ctrlFontSize,
//                   },
//                 ]}
//               >
//                 Boşluk
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.ctrlKey,
//                 {
//                   backgroundColor: themeStyles.keyConfirm.backgroundColor,
//                   height: dims.ctrlHeight,
//                 },
//               ]}
//               onPress={() => handleKeyPress("enter-letter", onEnter)}
//               activeOpacity={0.85}
//             >
//               <Text
//                 style={[
//                   styles.keyTextStrong,
//                   {
//                     color: themeStyles.keyConfirmText.color,
//                     fontSize: dims.ctrlFontSize,
//                   },
//                 ]}
//               >
//                 Enter
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.ctrlKey,
//                 {
//                   backgroundColor: themeStyles.keyActionAlt.backgroundColor,
//                   height: dims.ctrlHeight,
//                 },
//               ]}
//               onPress={() => handleKeyPress("clear-letter", onClear)}
//               activeOpacity={0.85}
//             >
//               <Text
//                 style={[
//                   styles.keyTextStrong,
//                   {
//                     color: themeStyles.keyActionAltText.color,
//                     fontSize: dims.ctrlFontSize - 1,
//                   },
//                 ]}
//               >
//                 Temizle
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrap: {
//     width: "100%",
//     borderTopWidth: 1,
//     position: "absolute", // ekledik
//     bottom: 0, // ekranın altına sabitle
//     left: 0,
//     zIndex: 9999, // yüksek zIndex
//     elevation: 10,
//   },
//   row: {
//     flexDirection: "row",
//     flex: 1,
//   },
//   key: {
//     flex: 1,
//     borderRadius: 6,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   keyWithShadow: {
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.12,
//     shadowRadius: 2,
//     shadowOffset: { width: 0, height: 1 },
//   },
//   keyPressed: {
//     transform: [{ scale: 0.96 }],
//     opacity: 0.85,
//   },
//   wideKey: {
//     flex: 1.3,
//   },
//   keyNum: {},
//   keyNumText: {
//     fontWeight: "600",
//     fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
//   },
//   keyAction: {},
//   keyActionText: {
//     fontWeight: "700",
//   },
//   keyActionAlt: {},
//   keyActionAltText: {
//     fontWeight: "700",
//   },
//   keyConfirm: {},
//   keyConfirmText: {
//     fontWeight: "700",
//   },
//   ctrlRow: {
//     flexDirection: "row",
//   },
//   ctrlKey: {
//     flex: 1,
//     borderRadius: 6,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 1,
//     shadowOffset: { width: 0, height: 1 },
//   },
//   spaceKey: {
//     flex: 2,
//     borderRadius: 6,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 1,
//     shadowOffset: { width: 1, height: 1 },
//   },
//   keyText: {
//     fontWeight: "400",
//     fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
//   },
//   keyTextStrong: {
//     fontWeight: "700",
//     fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
//   },
// });

// export default React.memo(OnScreenKeyboard);

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Platform,
  Dimensions,
} from "react-native";

type Props = {
  onKey?: (text: string) => void;
  onBackspace?: () => void;
  onClear?: () => void;
  onEnter?: () => void;
  onKeyPress?: (char: string) => void;
  decimal?: "." | ",";
  height?: number;
  defaultMode?: "number" | "letter";
  enableHapticFeedback?: boolean;
  theme?: "dark" | "light";
  compact?: boolean;
};

const TURKISH_LETTER_ROWS = [
  "Q W E R T Y U I O P Ğ Ü",
  "A S D F G H J K L Ş İ",
  "Z X C V B N M Ö Ç",
];

const OnScreenKeyboard: React.FC<Props> = ({
  onKey,
  onBackspace,
  onClear,
  onEnter,
  onKeyPress,
  decimal = ",",
  height,
  defaultMode = "number",
  enableHapticFeedback = true,
  theme = "dark",
  compact = false,
}) => {
  const [mode, setMode] = useState<"number" | "letter">(defaultMode);
  const [isShift, setIsShift] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const screenDimensions = Dimensions.get("window");
  
  // Responsive boyutları hesapla
  const getDimensions = () => {
    const isTablet = screenDimensions.width > 768;
    const isLargeScreen = screenDimensions.width > 480;
    
    // Ekran boyutuna göre dinamik yükseklik
    const maxHeight = screenDimensions.height * 0.4; // Ekranın max %40'ı
    const minHeight = isTablet ? 320 : 240;
    const calculatedHeight = height || Math.min(Math.max(
      screenDimensions.height * (isTablet ? 0.25 : 0.32),
      minHeight
    ), maxHeight);
    
    // Gap için maksimum değer belirleme - büyük ekranlarda fazla açılmaması için
    const baseGap = isTablet ? 8 : (isLargeScreen ? 6 : 4);
    const maxGap = isTablet ? 10 : 6; // Maksimum gap değeri
    const finalGap = Math.min(baseGap, maxGap);
    
    // Padding için de sınır
    const basePadding = isTablet ? 16 : (isLargeScreen ? 12 : 8);
    const maxPadding = isTablet ? 20 : 14;
    const finalPadding = Math.min(basePadding, maxPadding);
    
    const numberOfMainRows = mode === "number" ? 4 : 3;
    const ctrlRowHeight = isTablet ? 50 : (isLargeScreen ? 45 : 40);
    
    // Kullanılabilir alan hesaplaması
    const availableHeight = calculatedHeight - (finalPadding * 2);
    const totalGaps = numberOfMainRows * finalGap;
    const remainingHeight = availableHeight - totalGaps - ctrlRowHeight;
    
    // Tuş yüksekliği hesaplama
    const maxKeyHeight = isTablet ? 65 : (isLargeScreen ? 55 : 45);
    const minKeyHeight = isTablet ? 45 : (isLargeScreen ? 35 : 30);
    const calculatedKeyHeight = Math.max(
      Math.min(remainingHeight / numberOfMainRows, maxKeyHeight),
      minKeyHeight
    );

    // Font boyutları
    const baseFontSize = isTablet ? 20 : (isLargeScreen ? 16 : 14);
    const ctrlFontSize = isTablet ? 16 : (isLargeScreen ? 14 : 12);

    return {
      totalHeight: calculatedHeight,
      padding: finalPadding,
      gap: finalGap,
      keyHeight: calculatedKeyHeight,
      ctrlHeight: ctrlRowHeight,
      fontSize: baseFontSize,
      ctrlFontSize,
      isTablet,
      isLargeScreen,
      // Klavye maksimum genişlik
      maxKeyboardWidth: isTablet ? 700 : 500,
    };
  };

  const dims = React.useMemo(() => getDimensions(), [
    screenDimensions.width, 
    screenDimensions.height, 
    height, 
    compact, 
    mode
  ]);

  // Haptic feedback
  const triggerHaptic = () => {
    if (enableHapticFeedback && Platform.OS === "android") {
      Vibration.vibrate(30);
    }
  };

  // Tema stilleri
  const getThemeStyles = () => {
    if (theme === "light") {
      return {
        wrap: { backgroundColor: "#f8f9fa", borderColor: "#e9ecef" },
        keyNum: { backgroundColor: "#ffffff", shadowColor: "#333" },
        keyNumText: { color: "#212529" },
        keyAction: { backgroundColor: "#6c757d" },
        keyActionText: { color: "#ffffff" },
        keyActionAlt: { backgroundColor: "#ffc107" },
        keyActionAltText: { color: "#000" },
        keyConfirm: { backgroundColor: "#0d6efd" },
        keyConfirmText: { color: "#ffffff" },
        ctrlKey: { backgroundColor: "#6c757d" },
        spaceKey: { backgroundColor: "#6c757d" },
        keyText: { color: "#ffffff" },
      };
    }
    return {
      wrap: { backgroundColor: "#0f1116", borderColor: "#1f2430" },
      keyNum: { backgroundColor: "#1e2533", shadowColor: "#000" },
      keyNumText: { color: "#ffffff" },
      keyAction: { backgroundColor: "#2a3142" },
      keyActionText: { color: "#ff7f50" },
      keyActionAlt: { backgroundColor: "#2a3142" },
      keyActionAltText: { color: "#ffd166" },
      keyConfirm: { backgroundColor: "#2b6ef2" },
      keyConfirmText: { color: "#ffffff" },
      ctrlKey: { backgroundColor: "#2a3142" },
      spaceKey: { backgroundColor: "#2a3142" },
      keyText: { color: "#e6ebf5" },
    };
  };

  const themeStyles = getThemeStyles();

  // Number pad düzeni
  const numberRows: (string | { type: "backspace" | "clear" | "enter" | "ok" })[][] = useMemo(
    () => [
      ["7", "8", "9", { type: "backspace" }],
      ["4", "5", "6", { type: "clear" }],
      ["1", "2", "3", { type: "enter" }],
      [decimal, "0", "00", { type: "ok" }],
    ],
    [decimal]
  );

  const letterRows = useMemo(
    () => TURKISH_LETTER_ROWS.map((r) => r.split(" ")),
    []
  );

  // Key press handler
  const handleKeyPress = (key: string, callback?: () => void) => {
    triggerHaptic();
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 100);
    callback?.();
  };

  // Number cell render
  const renderNumCell = (
    cell: string | { type: "backspace" | "clear" | "enter" | "ok" }
  ) => {
    if (typeof cell === "string") {
      const isPressed = pressedKey === cell;
      return (
        <TouchableOpacity
          key={cell}
          style={[
            styles.key,
            {
              backgroundColor: themeStyles.keyNum.backgroundColor,
              height: dims.keyHeight,
              borderRadius: dims.isTablet ? 10 : 6,
            },
            isPressed && styles.keyPressed,
            styles.keyWithShadow,
          ]}
          onPress={() => handleKeyPress(cell, () => onKey?.(cell))}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.keyNumText,
              {
                color: themeStyles.keyNumText.color,
                fontSize: dims.fontSize,
              },
            ]}
          >
            {cell}
          </Text>
        </TouchableOpacity>
      );
    }

    const getSpecialKeyContent = () => {
      const baseStyle = [
        styles.key,
        {
          height: dims.keyHeight,
          borderRadius: dims.isTablet ? 10 : 6,
        },
        styles.keyWithShadow,
      ];

      switch (cell.type) {
        case "backspace":
          return {
            key: "backspace",
            style: [...baseStyle, { backgroundColor: themeStyles.keyAction.backgroundColor }],
            onPress: () => handleKeyPress("backspace", onBackspace),
            text: "⌫",
            textStyle: {
              color: themeStyles.keyActionText.color,
              fontSize: dims.fontSize + (dims.isTablet ? 4 : 2),
              fontWeight: "700" as const,
            },
          };
        case "clear":
          return {
            key: "clear",
            style: [...baseStyle, { backgroundColor: themeStyles.keyActionAlt.backgroundColor }],
            onPress: () => handleKeyPress("clear", onClear),
            text: "C",
            textStyle: {
              color: themeStyles.keyActionAltText.color,
              fontSize: dims.fontSize,
              fontWeight: "700" as const,
            },
          };
        case "enter":
          return {
            key: "enter",
            style: [...baseStyle, { backgroundColor: themeStyles.keyConfirm.backgroundColor }],
            onPress: () => handleKeyPress("enter", onEnter),
            text: "↵",
            textStyle: {
              color: themeStyles.keyConfirmText.color,
              fontSize: dims.fontSize,
              fontWeight: "700" as const,
            },
          };
        default:
          return {
            key: "ok",
            style: [...baseStyle, { backgroundColor: themeStyles.keyConfirm.backgroundColor }],
            onPress: () => handleKeyPress("ok", onEnter),
            text: "OK",
            textStyle: {
              color: themeStyles.keyConfirmText.color,
              fontSize: dims.fontSize - 2,
              fontWeight: "700" as const,
            },
          };
      }
    };

    const keyConfig = getSpecialKeyContent();
    const isPressed = pressedKey === keyConfig.key;

    return (
      <TouchableOpacity
        key={keyConfig.key}
        style={[keyConfig.style, isPressed && styles.keyPressed]}
        onPress={keyConfig.onPress}
        activeOpacity={0.85}
      >
        <Text style={keyConfig.textStyle}>{keyConfig.text}</Text>
      </TouchableOpacity>
    );
  };

  // Letter key render
  const renderLetterKey = (k: string, rowIndex: number) => {
    const label = isShift ? k.toUpperCase() : k.toLowerCase();
    const isPressed = pressedKey === label;

    return (
      <TouchableOpacity
        key={k}
        style={[
          styles.key,
          {
            backgroundColor: themeStyles.keyNum.backgroundColor,
            height: dims.keyHeight,
            flex: 1,
            borderRadius: dims.isTablet ? 10 : 6,
          },
          isPressed && styles.keyPressed,
          styles.keyWithShadow,
        ]}
        onPress={() =>
          handleKeyPress(label, () => {
            onKey?.(label);
            setIsShift(false);
          })
        }
        activeOpacity={0.85}
      >
        <Text
          style={[
            styles.keyNumText,
            {
              color: themeStyles.keyNumText.color,
              fontSize: dims.fontSize,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.keyboardContainer}>
      <View
        style={[
          styles.wrap,
          themeStyles.wrap,
          {
            height: dims.totalHeight,
            padding: dims.padding,
            maxWidth: dims.maxKeyboardWidth,
          },
        ]}
      >
        {mode === "number" ? (
          <>
            {/* Number rows */}
            {numberRows.map((row, i) => (
              <View
                key={`nr-${i}`}
                style={[
                  styles.row,
                  {
                    gap: dims.gap,
                    marginBottom: i === numberRows.length - 1 ? dims.gap : dims.gap,
                  },
                ]}
              >
                {row.map(renderNumCell)}
              </View>
            ))}

            {/* Number control row */}
            <View
              style={[
                styles.ctrlRow,
                {
                  gap: dims.gap,
                  height: dims.ctrlHeight,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.ctrlKey,
                  {
                    backgroundColor: themeStyles.ctrlKey.backgroundColor,
                    height: dims.ctrlHeight,
                    borderRadius: dims.isTablet ? 10 : 6,
                  },
                ]}
                onPress={() => handleKeyPress("abc", () => setMode("letter"))}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.keyTextStrong,
                    {
                      color: themeStyles.keyText.color,
                      fontSize: dims.ctrlFontSize,
                    },
                  ]}
                >
                  ABC
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.spaceKey,
                  {
                    backgroundColor: themeStyles.spaceKey.backgroundColor,
                    height: dims.ctrlHeight,
                    borderRadius: dims.isTablet ? 10 : 6,
                  },
                ]}
                onPress={() => handleKeyPress("space", () => onKey?.(" "))}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.keyText,
                    {
                      color: themeStyles.keyText.color,
                      fontSize: dims.ctrlFontSize,
                    },
                  ]}
                >
                  Boşluk
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ctrlKey,
                  {
                    backgroundColor: themeStyles.keyConfirm.backgroundColor,
                    height: dims.ctrlHeight,
                    borderRadius: dims.isTablet ? 10 : 6,
                  },
                ]}
                onPress={() => handleKeyPress("enter-ctrl", onEnter)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.keyTextStrong,
                    {
                      color: themeStyles.keyConfirmText.color,
                      fontSize: dims.ctrlFontSize,
                    },
                  ]}
                >
                  Enter
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Letter rows */}
            {letterRows.map((row, i) => (
              <View
                key={`lr-${i}`}
                style={[
                  styles.row,
                  {
                    gap: dims.gap,
                    marginBottom: i === letterRows.length - 1 ? dims.gap : dims.gap,
                  },
                ]}
              >
                {row.map((key) => renderLetterKey(key, i))}
                {/* Son satıra backspace */}
                {i === letterRows.length - 1 && (
                  <TouchableOpacity
                    style={[
                      styles.key,
                      styles.wideKey,
                      {
                        backgroundColor: themeStyles.keyAction.backgroundColor,
                        height: dims.keyHeight,
                        borderRadius: dims.isTablet ? 10 : 6,
                      },
                      styles.keyWithShadow,
                    ]}
                    onPress={() => handleKeyPress("backspace-letter", onBackspace)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.keyActionText,
                        {
                          color: themeStyles.keyActionText.color,
                          fontSize: dims.fontSize + (dims.isTablet ? 4 : 2),
                        },
                      ]}
                    >
                      ⌫
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Letter control row */}
            <View
              style={[
                styles.ctrlRow,
                {
                  gap: dims.gap,
                  height: dims.ctrlHeight,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.ctrlKey,
                  {
                    backgroundColor: themeStyles.ctrlKey.backgroundColor,
                    height: dims.ctrlHeight,
                    borderRadius: dims.isTablet ? 10 : 6,
                  },
                ]}
                onPress={() => handleKeyPress("123", () => setMode("number"))}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.keyTextStrong,
                    {
                      color: themeStyles.keyText.color,
                      fontSize: dims.ctrlFontSize,
                    },
                  ]}
                >
                  123
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ctrlKey,
                  {
                    backgroundColor: isShift
                      ? themeStyles.keyConfirm.backgroundColor
                      : themeStyles.ctrlKey.backgroundColor,
                    height: dims.ctrlHeight,
                    borderRadius: dims.isTablet ? 10 : 6,
                  },
                ]}
                onPress={() => handleKeyPress("shift", () => setIsShift((s) => !s))}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.keyTextStrong,
                    {
                      color: isShift
                        ? themeStyles.keyConfirmText.color
                        : themeStyles.keyText.color,
                      fontSize: dims.ctrlFontSize + 2,
                    },
                  ]}
                >
                  ⇧
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.spaceKey,
                  {
                    backgroundColor: themeStyles.spaceKey.backgroundColor,
                    height: dims.ctrlHeight,
                    borderRadius: dims.isTablet ? 10 : 6,
                  },
                ]}
                onPress={() => handleKeyPress("space-letter", () => onKey?.(" "))}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.keyText,
                    {
                      color: themeStyles.keyText.color,
                      fontSize: dims.ctrlFontSize,
                    },
                  ]}
                >
                  Boşluk
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ctrlKey,
                  {
                    backgroundColor: themeStyles.keyConfirm.backgroundColor,
                    height: dims.ctrlHeight,
                    borderRadius: dims.isTablet ? 10 : 6,
                  },
                ]}
                onPress={() => handleKeyPress("enter-letter", onEnter)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.keyTextStrong,
                    {
                      color: themeStyles.keyConfirmText.color,
                      fontSize: dims.ctrlFontSize,
                    },
                  ]}
                >
                  Enter
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ctrlKey,
                  {
                    backgroundColor: themeStyles.keyActionAlt.backgroundColor,
                    height: dims.ctrlHeight,
                    borderRadius: dims.isTablet ? 10 : 6,
                  },
                ]}
                onPress={() => handleKeyPress("clear-letter", onClear)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.keyTextStrong,
                    {
                      color: themeStyles.keyActionAltText.color,
                      fontSize: dims.ctrlFontSize - 1,
                    },
                  ]}
                >
                  {dims.isTablet ? "Temizle" : "C"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
    elevation: 10,
  },
  wrap: {
    width: "100%",
    borderTopWidth: 1,
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
  key: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  keyWithShadow: {
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  keyPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  wideKey: {
    flex: 1.3,
  },
  keyNumText: {
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  keyActionText: {
    fontWeight: "700",
  },
  ctrlRow: {
    flexDirection: "row",
  },
  ctrlKey: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  spaceKey: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 1,
    shadowOffset: { width: 1, height: 1 },
  },
  keyText: {
    fontWeight: "400",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  keyTextStrong: {
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
});

export default React.memo(OnScreenKeyboard);