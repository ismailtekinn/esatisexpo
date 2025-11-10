// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   ScrollView,
//   Dimensions,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const { height, width } = Dimensions.get("window");

// const CompactTabModal = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);

//   const tabs = [
//     { 
//       id: 0, 
//       title: "Genel", 
//       icon: "settings-outline",
//       content: "Genel ayarlar ve bilgiler burada yer alır. Bu sekme genel işlemler için kullanılır."
//     },
//     { 
//       id: 1, 
//       title: "Hesap", 
//       icon: "person-outline",
//       content: "Hesap bilgileri ve kullanıcı ayarları bu bölümde bulunur. Profil düzenlemeleri yapabilirsiniz."
//     },
//     { 
//       id: 2, 
//       title: "Güvenlik", 
//       icon: "shield-checkmark-outline",
//       content: "Güvenlik ayarları ve şifre değişiklikleri için bu sekmeyi kullanın."
//     },
//     { 
//       id: 3, 
//       title: "Bildirimler", 
//       icon: "notifications-outline",
//       content: "Push bildirimleri ve e-posta ayarları bu bölümde yer alır."
//     }
//   ];

//   const renderContent = () => {
//     const currentTab = tabs[activeTab];
//     return (
//       <View style={styles.contentSection}>
//         <Text style={styles.contentTitle}>{currentTab.title}</Text>
//         <Text style={styles.contentText}>{currentTab.content}</Text>
        
//         {/* Örnek içerik kartları */}
//         <View style={styles.exampleContent}>
//           <View style={styles.settingCard}>
//             <Text style={styles.settingTitle}>Örnek Ayar 1</Text>
//             <Text style={styles.settingDescription}>Bu bir örnek ayar açıklamasıdır.</Text>
//           </View>
          
//           <View style={styles.settingCard}>
//             <Text style={styles.settingTitle}>Örnek Ayar 2</Text>
//             <Text style={styles.settingDescription}>Bu başka bir örnek ayar açıklamasıdır.</Text>
//           </View>
          
//           <View style={styles.settingCard}>
//             <Text style={styles.settingTitle}>Örnek Ayar 3</Text>
//             <Text style={styles.settingDescription}>Üçüncü örnek ayar açıklaması.</Text>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Trigger Button */}
//       <TouchableOpacity
//         style={styles.openButton}
//         onPress={() => setIsVisible(true)}
//       >
//         <Text style={styles.openButtonText}>Modal'ı Aç</Text>
//       </TouchableOpacity>

//       {/* Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isVisible}
//         onRequestClose={() => setIsVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
            
//             {/* Header */}
//             <View style={styles.header}>
//               <Text style={styles.headerTitle}>Ayarlar</Text>
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => setIsVisible(false)}
//               >
//                 <Ionicons name="close" size={20} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {/* Tab Navigation */}
//             <View style={styles.tabContainer}>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.tabScrollContainer}
//               >
//                 {tabs.map((tab) => (
//                   <TouchableOpacity
//                     key={tab.id}
//                     style={[
//                       styles.tabButton,
//                       activeTab === tab.id && styles.activeTabButton
//                     ]}
//                     onPress={() => setActiveTab(tab.id)}
//                   >
//                     <Ionicons 
//                       name={tab.icon} 
//                       size={16} 
//                       color={activeTab === tab.id ? "#fff" : "#666"} 
//                     />
//                     <Text
//                       style={[
//                         styles.tabText,
//                         activeTab === tab.id && styles.activeTabText
//                       ]}
//                     >
//                       {tab.title}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>

//             {/* Content */}
//             <ScrollView style={styles.contentScrollView}>
//               {renderContent()}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   openButton: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 12,
//   },
//   openButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContainer: {
//     backgroundColor: "white",
//     height: height * 0.8,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     overflow: "hidden",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//     backgroundColor: "white",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   closeButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#f0f0f0",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   tabContainer: {
//     backgroundColor: "#f8f9fa",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   tabScrollContainer: {
//     paddingHorizontal: 4,
//   },
//   tabButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginHorizontal: 2,
//     backgroundColor: "transparent",
//   },
//   activeTabButton: {
//     backgroundColor: "#007AFF",
//     borderRadius: 8,
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#666",
//     marginLeft: 6,
//   },
//   activeTabText: {
//     color: "#fff",
//   },
//   contentScrollView: {
//     flex: 1,
//   },
//   contentSection: {
//     padding: 16,
//   },
//   contentTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 8,
//   },
//   contentText: {
//     fontSize: 16,
//     color: "#666",
//     lineHeight: 24,
//     marginBottom: 20,
//   },
//   exampleContent: {
//     gap: 12,
//   },
//   settingCard: {
//     backgroundColor: "#f8f9fa",
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#e9ecef",
//   },
//   settingTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 4,
//   },
//   settingDescription: {
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 20,
//   },
// });

// export default CompactTabModal;