import React from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import HTML from "react-native-render-html";
import htmlContent from "../Settings/TCContent";

const TandC = (props) => {
  const contentWidth = useWindowDimensions().width;

  return (
    <ImageBackground
      source={require("../../assets/settings-bg2.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: "75%",
          borderRadius: 20,
          padding: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ flex: 0, flexDirection: "row", justifyContent: "flex-end" }}
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Image
            source={require("../../assets/cancel.png")}
            style={{ width: 25, height: 25 }}
          />
        </TouchableOpacity>

        <ScrollView style={{ flex: 1 }}>
          <HTML source={{ html: htmlContent }} contentWidth={contentWidth} />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default TandC;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    height: "130%",
  },
});
