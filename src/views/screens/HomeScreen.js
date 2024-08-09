import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [userDetails, setUserDetails] = React.useState();

  React.useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const userData = await AsyncStorage.getItem("userData");

    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.loggedIn) {
        console.log("Home Screen");
        console.log(parsedData);
      }
      setUserDetails(parsedData);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome, </Text>
        <Text style={styles.nameText}>{userDetails?.fullname}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16, // Add padding to give some space from the edges
  },
  welcomeContainer: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Center items vertically
    marginBottom: 20, // Space between the welcome text and any potential button
  },
  welcomeText: {
    fontSize: 20,
    color: "black",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
});

export default HomeScreen;
