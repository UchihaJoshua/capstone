import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import CustomPinInput from "../components/CustomPinInput"; // Import the new component
import Loader from "../components/Loader";
import axios from "axios"; // For sending API requests

import ccsLogo from "../../img/lck.png"; // Import the image

const LoginScreenInstructor = ({ navigation }) => {
  const [pin, setPin] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Automatically validate the PIN when it reaches 4 digits
  React.useEffect(() => {
    if (pin.length === 4) {
      validate();
    }
  }, [pin]);

  const validate = () => {
    if (!pin) {
      setError("Please Enter a 4-Digit PIN");
      return;
    } else if (pin.length !== 4) {
      setError("PIN Must Be 4 Digits");
      return;
    }

    login();
  };

  const login = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://10.0.0.53:8000/api/verify-pin", {
        pin: pin,
      });

      // Log the API response data
      console.log('API Response:', response.data);

      if (response.data.success) {
        // Log the user data
        console.log('User data received:', response.data.user);

        // Save user data to AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(response.data.user));

        // Navigate to the HomeScreen within DrawerNavigator
        navigation.navigate('DrawerNavigator', {
          screen: 'HomeScreen',
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "ERROR",
          textBody: response.data.message,
          button: "Close",
        });
      }
    } catch (error) {
      // Log the error
      console.log('Login error:', error);

      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "ERROR",
        textBody: error.response?.data?.message || error.message || error,
        button: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertNotificationRoot style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Loader visible={loading} />
        <ScrollView style={styles.svContainer}>
          <View style={styles.spacer} />
          <Image style={styles.image} source={ccsLogo} />
          <Text style={styles.textTitle}>LOGIN AS INSTRUCTOR</Text>
          <Text style={styles.textSubtitle}>Enter your 4-digit PIN</Text>
          <View style={styles.viewContainer}>
            <CustomPinInput
              value={pin}
              onChangeText={(text) => {
                setPin(text);
                setError(null);
              }}
              error={error}
            />
            {/* Remove the button if you want auto-login */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0", // Light background color
  },
  svContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  spacer: {
    height: 20, // Adjust height as needed
  },
  textTitle: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333", // Darker text for contrast
    marginBottom: 10,
  },
  textSubtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666", // Lighter gray text color
    marginBottom: -20, // Adjust space between the subtitle and the input
  },
  viewContainer: {
    paddingVertical: 20,
  },
  image: {
    width: 255,
    height: 200,
    alignSelf: "center",
    marginBottom: 25,
    marginTop: 70, // Add marginTop to move the image down
  },
});

export default LoginScreenInstructor;
