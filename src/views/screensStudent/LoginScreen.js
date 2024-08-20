import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from "react-native-alert-notification";
import Input from "../components/Input"; // Assuming you already have an Input component for icons
import Button from "../components/Button"; // Assuming you already have a Button component for styling
import Loader from "../components/Loader"; // Loader for loading state
import ccsLogo from "../../img/lck.png"; // Assuming this is the logo

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://172.18.97.29:8000/api/student", {
        name,
        password,
      });

      if (response.status === 200) {
        // Store user data in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        // Navigate to QrScanner screen
        navigation.navigate("DrawerNavigatorStudent", { user: response.data });
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.values(validationErrors).flat().join("\n");
        setError(errorMessage);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Validation Error",
          textBody: errorMessage,
          button: "Close",
        });
      } else {
        setError("Failed to connect to the server");
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Failed to connect to the server",
          button: "Close",
        });
      }
      console.error("Network request failed:", error);
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
          <Text style={styles.textTitle}>LOGIN AS STUDENT</Text>
          <View style={styles.viewContainer}>
            <Input
              label="Username"
              iconName="user" // Assuming your Input component handles icons
              placeholder="Enter your Username"
              onChangeText={setName}
              onFocus={() => setError(null)}
              error={error} // Show any validation errors
            />
            <Input
              label="Password"
              iconName="lock" // Assuming your Input component handles icons
              password
              placeholder="Enter your Password"
              onChangeText={setPassword}
              onFocus={() => setError(null)}
              error={error} // Show any validation errors
            />
            <Button title="Login" onPress={handleLogin} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  svContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  spacer: {
    height: 50,
  },
  image: {
    width: 255,
    height: 200,
    alignSelf: "center",
    marginBottom: 40,
  },
  textTitle: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  viewContainer: {
    paddingVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default LoginScreen;
