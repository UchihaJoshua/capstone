import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import ccsLogo from "../../img/lck.png";

const MainLog = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Image style={styles.image} source={ccsLogo} />
        <Text style={styles.textTitle}>LOGIN AS</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("InstructorLoginScreen")}
        >
          <Text style={styles.buttonText}>Instructor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={styles.buttonText}>Student</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.infoText}>
        Unlock the door using the LockUp-Based management System. Check the availability of MAC Laboratory. Manage your schedule, attendance, seating arrangement, and reports.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 10,
  },
  
  textTitle: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  image: {
    width: 255,
    height: 200,
    alignSelf: "center",
    marginBottom: 40,
  },
  infoText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 40,
  },
});

export default MainLog;
