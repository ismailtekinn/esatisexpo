import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';


type CustomKeyboardProps = {
  onTextChange: (text: string) => void;
  initialValue?: string;
};
const CustomKeyboard = ({ onTextChange, initialValue = '' }:CustomKeyboardProps) => {
  const [text, setText] = useState(initialValue);
  const [keyboardType, setKeyboardType] = useState('numeric'); // 'numeric' veya 'alpha'

  const numericKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', '⌫', '✓']
  ];

  const alphaKeys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫', '✓']
  ];

  const handleKeyPress = (key:string) => {
    let newText = text;
    
    if (key === '⌫') {
      // Silme işlemi
      newText = text.slice(0, -1);
    } else if (key === '✓') {
      // Onay işlemi
      onTextChange?.(text);
      return;
    } else {
      // Karakter ekleme
      newText = text + key;
    }
    
    setText(newText);
    onTextChange?.(newText);
  };

  const toggleKeyboard = () => {
    setKeyboardType(keyboardType === 'numeric' ? 'alpha' : 'numeric');
  };

  const clearText = () => {
    setText('');
    onTextChange?.('');
  };

  const renderNumericKeyboard = () => (
    <View style={styles.keyboardContainer}>
      {numericKeys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) => (
            <TouchableOpacity
              key={keyIndex}
              style={[
                styles.key,
                key === '⌫' ? styles.deleteKey : null,
                key === '✓' ? styles.confirmKey : null,
              ]}
              onPress={() => handleKeyPress(key)}
            >
              <Text style={[
                styles.keyText,
                key === '⌫' ? styles.deleteKeyText : null,
                key === '✓' ? styles.confirmKeyText : null,
              ]}>
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );

  const renderAlphaKeyboard = () => (
    <View style={styles.keyboardContainer}>
      {alphaKeys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) => (
            <TouchableOpacity
              key={keyIndex}
              style={[
                styles.key,
                styles.alphaKey,
                key === '⌫' ? styles.deleteKey : null,
                key === '✓' ? styles.confirmKey : null,
              ]}
              onPress={() => handleKeyPress(key)}
            >
              <Text style={[
                styles.keyText,
                key === '⌫' ? styles.deleteKeyText : null,
                key === '✓' ? styles.confirmKeyText : null,
              ]}>
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Giriş alanı */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={text}
          placeholder="Buraya yazın..."
          editable={false}
          multiline={false}
        />
        <TouchableOpacity style={styles.clearButton} onPress={clearText}>
          <Text style={styles.clearButtonText}>Temizle</Text>
        </TouchableOpacity>
      </View>

      {/* Klavye tipi değiştirme butonu */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleKeyboard}>
          <Text style={styles.toggleButtonText}>
            {keyboardType === 'numeric' ? '🔤 Harf' : '🔢 Rakam'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Klavye */}
      {keyboardType === 'numeric' ? renderNumericKeyboard() : renderAlphaKeyboard()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    fontSize: 18,
  },
  clearButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ff4444',
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  toggleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyboardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  key: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    margin: 2,
    height: 50,
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  alphaKey: {
    minWidth: 30,
    height: 45,
  },
  keyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteKey: {
    backgroundColor: '#ff6b6b',
  },
  deleteKeyText: {
    color: 'white',
  },
  confirmKey: {
    backgroundColor: '#4CAF50',
  },
  confirmKeyText: {
    color: 'white',
  },
});

export default CustomKeyboard