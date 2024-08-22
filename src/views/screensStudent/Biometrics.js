import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from 'axios';

const Biometrics = () => {
  const [biometricRegistered, setBiometricRegistered] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (hasHardware && supportedTypes.length > 0) {
      console.log('Biometric sensor is available');
    } else {
      Alert.alert('Biometric sensor is not available on this device');
    }
  };

  const handleRegisterBiometrics = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Register your biometrics',
      fallbackLabel: 'Enter Passcode',
    });

    if (result.success) {
      setBiometricRegistered(true);
      const uid = generateUID(); // Generate a unique identifier
      sendBiometricDataToBackend(uid);
    } else {
      Alert.alert('Authentication failed', result.error);
    }
  };

  const generateUID = () => {
    // Generate a unique identifier for the biometric registration
    return 'user-' + new Date().getTime();
  };

  const sendBiometricDataToBackend = async (uid) => {
    try {
      const response = await axios.post('http://192.168.1.19:8000/api/register-biometrics', {
        user_id: 1, // Replace with actual user ID or data
        biometric_data: uid, // Send the UID instead of raw biometric data
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Biometrics registered successfully!');
      } else {
        Alert.alert('Error', 'Failed to register biometrics.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Register Your Biometrics</Text>
      <Button
        title={biometricRegistered ? 'Biometrics Registered' : 'Register Biometrics'}
        onPress={handleRegisterBiometrics}
        disabled={biometricRegistered}
      />
    </View>
  );
};

export default Biometrics;
