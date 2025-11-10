import React from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
const UrunCard = ( ) => {
  return (
    <View style={styles.urunCard}>
      <Text style={styles.urunTitle}>{urun.isim}</Text>

      <View style={styles.adetRow}>
        <Text style={styles.adetLabel}>Adet:</Text>

        <TouchableOpacity onPress={adetAzalt} style={styles.counterButton}>
          <Text>-</Text>
        </TouchableOpacity>

        <Text style={styles.adet}>{urun.adet}</Text>

        <TouchableOpacity onPress={adetArttir} style={styles.counterButton}>
          <Text>+</Text>
        </TouchableOpacity>

        <View style={styles.birimFiyatContainer}>
          <Text style={styles.label}>Birim Fiyatı:</Text>
          <TextInput
            style={styles.birimFiyat}
            value={urun.birimFiyat.toString()}
            editable={false}
          />
        </View>
      </View>
    </View>
  )
}

export default UrunCard

const styles = {
      urunCard: {
    backgroundColor: '#eee',
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  urunTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  adetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  adetLabel: {
    marginRight: 10,
  },
  counterButton: {
    padding: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 4,
  },
  adet: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  birimFiyatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  label: {
    marginRight: 5,
  },
  birimFiyat: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 50,
  },
}