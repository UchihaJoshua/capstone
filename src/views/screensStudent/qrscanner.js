import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';

const QrScanner = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(true);

  const handleBarCodeScanned = ({ data }) => {
    setIsScanning(false);
    Alert.alert("QR Code Scanned", `Data: ${data}`, [
      {
        text: "OK",
        onPress: () => setIsScanning(true),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {isScanning ? (
        <RNCamera
          style={styles.camera}
          onBarCodeRead={handleBarCodeScanned}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
        >
          <View style={styles.cameraOverlay}>
            <Text style={styles.scanText}>Scan QR Code</Text>
          </View>
        </RNCamera>
      ) : (
        <View style={styles.scannedContainer}>
          <Text style={styles.scannedText}>QR Code Scanned!</Text>
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => setIsScanning(true)}
          >
            <Icon name="refresh" size={24} color="#fff" />
            <Text style={styles.buttonText}>Rescan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  scannedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  scannedText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default QrScanner;
