import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';

interface User {
  name: string;
  surname: string;
  phone: string;
  id: number;
}

const AdminHome = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleActivate = (id: number) => {
    setSuccessMessage(`User with ID ${id} activated.`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: User[] = [
          { id: 1, name: 'Ali', surname: 'Yılmaz', phone: '1234567890' },
          { id: 2, name: 'Ayşe', surname: 'Kara', phone: '0987654321' },
        ];
        setUserData(data);
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      
      {error && <Text style={styles.errorText}>{error}</Text>}
      {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

      <View style={styles.header}>
        <Text style={styles.headerText}>ID</Text>
        <Text style={styles.headerText}>Ad</Text>
        <Text style={styles.headerText}>Soyad</Text>
        <Text style={styles.headerText}>Numara</Text>
        <Text style={styles.headerText}>İşlem</Text>
      </View>

      <FlatList
        data={userData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.id}</Text>
            <Text style={styles.rowText}>{item.name}</Text>
            <Text style={styles.rowText}>{item.surname}</Text>
            <Text style={styles.rowText}>{item.phone}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Onayla" onPress={() => handleActivate(item.id)} />
              <Button title="Sil" color="red" onPress={() => console.log('Sil button clicked')} />
            </View>
          </View>
        )}
      />
      {userData.length === 0 && <Text>No inactive users found.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  successText: {
    color: 'green',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    padding: 8,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  rowText: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 2,
  },
});

export default AdminHome;
