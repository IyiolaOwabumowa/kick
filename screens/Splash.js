import React from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from "react-native";

const Splash = (props) => {
  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ActivityIndicator style={{ color: "white" }} size={30} />

      <Image
        source={require("../assets/balltext.png")}
        resizeMode="contain"
        style={{ width: "70%" }}
      />
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "120%",
  },
});
