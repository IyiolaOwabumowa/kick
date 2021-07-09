import React from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const RegisterSuccess = (props) => {
  return (
    <>
      <ImageBackground
        source={require("../../assets/reg-s-feedback.png")}
        style={{
          width: "100%",
          height: "101%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 28 }}>Hurray!!!</Text>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            textAlign: "center",
            lineHeight: 30,
            padding: 50,
          }}
        >
          Check your email for a confirmation link {"\n"}to start playing
        </Text>

        <TouchableOpacity
        activeOpacity={0.8}
        style={{flexDirection:"row", width:"100%"}}
          onPress={() => {
            props.navigation.navigate("Login");
          }}
        >
          <Image
            source={require("../../assets/next-button.png")}
            resizeMode="contain"
            style={{ width: "60%", marginTop: 10 }}
          />
        </TouchableOpacity>
      </ImageBackground>
    </>
  );
};

export default RegisterSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
