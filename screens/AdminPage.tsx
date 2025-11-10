import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
};

const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Ali",
    lastName: "Yılmaz",
    phone: "+90 532 123 4567",
    createdAt: "2024-06-01",
  },
  {
    id: "2",
    firstName: "Ayşe",
    lastName: "Demir",
    phone: "+90 533 765 4321",
    createdAt: "2024-06-02",
  },
];

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const deleteUser = (id: string) => {
    Alert.alert(
      "Kullanıcı Sil",
      "Bu kullanıcıyı silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => {
            setUsers((prev) => prev.filter((user) => user.id !== id));
          },
        },
      ]
    );
  };

  const confirmUser = (id: string) => {
    Alert.alert("Onaylandı", "Kullanıcı başarıyla onaylandı.");
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.tableCell}>{item.phone}</Text>
      <Text style={styles.tableCell}>{item.createdAt}</Text>
      <View style={[styles.tableCell, styles.actionCell]}>
        <TouchableOpacity onPress={() => confirmUser(item.id)}>
          <AntDesign name="checkcircle" size={20} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteUser(item.id)}
          style={{ marginLeft: 10 }}
        >
          <AntDesign name="closecircle" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Ad Soyad</Text>
        <Text style={styles.headerCell}>Telefon</Text>
        <Text style={styles.headerCell}>Tarih</Text>
        <Text style={[styles.headerCell, styles.actionCell]}>İşlem</Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ margin: 12 }}>Henüz kullanıcı yok.</Text>
        }
      />
    </View>
  );
};

export default AdminPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff", // canlı mavi
    paddingVertical: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 6,
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff", // beyaz yazı
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // satırlar arası gri çizgi
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 6,
    fontSize: 13,
    textAlign: "center",
    color: "#333",
  },
  actionCell: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
