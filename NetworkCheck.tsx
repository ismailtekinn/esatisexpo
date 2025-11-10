import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as Network from 'expo-network';

export default function NetworkCheck() {
  const [isConnected, setIsConnected] = useState(false); // Başlangıçta false

  useEffect(() => {
    checkNetwork();
  }, []);

  const checkNetwork = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      if (networkState.isConnected !== undefined) {
        setIsConnected(networkState.isConnected); // Yalnızca boolean değerini ayarlayın
      } else {
        setIsConnected(false); // Eğer değer undefined ise, false yapıyoruz
      }
    } catch (error) {
      console.error('Bağlantı kontrolü sırasında bir hata oluştu:', error);
      setIsConnected(false); // Hata durumunda false yapıyoruz
    }
  };

  return (
    <View>
      {isConnected === null ? (
        <Text>Bağlantı durumu kontrol ediliyor...</Text>
      ) : isConnected ? (
        <Text>İnternet bağlantısı mevcut!</Text>
      ) : (
        <Text>İnternet bağlantısı yok!</Text>
      )}

      <Button title="Bağlantı durumu kontrol et" onPress={checkNetwork} />
    </View>
  );
}
