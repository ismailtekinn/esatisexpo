// screens/ScrollableListScreen.tsx

import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

const data = Array.from({ length: 50 }, (_, index) => ({
  id: index.toString(),
  title: `Item ${index + 1}`,
}));

const ScrollableListScreen = () => {
  const renderItem = ({ item }: { item: { title: string } }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
  },
});

export default ScrollableListScreen;
