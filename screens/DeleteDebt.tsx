// import React, { useState } from 'react';
// import { View, Text, Alert } from 'react-native';
// import { Input, Button, Icon } from 'react-native-elements';

// const Deletedebt = () => {
//   const [borrowerName, setBorrowerName] = useState<string>('');
//   const [phone, setPhone] = useState<string>('');
//   const [initialBalance, setInitialBalance] = useState<number>(0);

//   const deleteDebt = () => {
//     console.log({
//       borrowerName,
//       phone,
//       initialBalance,
//     });
//     Alert.alert('Başarıyla Silindi', 'Borç başarıyla silindi!');
//   };

//   return (
//     <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
//       {/* Başlık */}
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
//         <Button
//           icon={<Icon name="arrow-back" color="#fff" />}
//           buttonStyle={{ backgroundColor: '#ccc' }}
//           onPress={() => console.log('Geri git')}
//         />
//         <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Borç Sil</Text>
//       </View>

//       {/* Borçlu Adı */}
//       <Input
//         label="Borçlu Adı"
//         placeholder="Borçlu adı girin"
//         value={borrowerName}
//         onChangeText={(text: string) => setBorrowerName(text)}
//         containerStyle={{ marginBottom: 16 }}
//       />

//       {/* Telefon */}
//       <Input
//         label="Telefon"
//         placeholder="Telefon numarası girin"
//         value={phone}
//         onChangeText={(text: string) => setPhone(text)}
//         keyboardType="phone-pad"
//         containerStyle={{ marginBottom: 16 }}
//       />

//       {/* Başlangıç Bakiyesi */}
//       <Input
//         label="Başlangıç Bakiyesi"
//         placeholder="0"
//         value={String(initialBalance)}
//         onChangeText={(text: string) => setInitialBalance(Number(text))}
//         keyboardType="numeric"
//         containerStyle={{ marginBottom: 16 }}
//       />

//       {/* Sil Butonu */}
//       <Button
//         title="Sil"
//         onPress={deleteDebt}
//         buttonStyle={{ backgroundColor: '#dc3545' }}
//       />
//     </View>
//   );
// };

// export default Deletedebt;
