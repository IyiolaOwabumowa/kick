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

const PurchaseModal = (props) => {
  const contentWidth = useWindowDimensions().width;
  const { koins } = props.route.params.koinDetails;

  return (
    <ImageBackground
      source={require("../assets/settings-bg2.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: "50%",
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
            source={require("../assets/cancel.png")}
            style={{ width: 25, height: 25 }}
          />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 22,
              marginTop: 40,
              color: "#00000090",
              textAlign: "center",
            }}
          >
            Your koin balance
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Image
              source={require("../assets/coins-settings.png")}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                fontSize: 30,
                fontWeight: "700",
                marginLeft: 10,
                textAlign: "center",
                color: "#00000090",
              }}
            >
              {koins}
            </Text>
          </View>

          {/* <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <Image
              source={require("../assets/coins-settings.png")}
              resizeMode="contain"
              style={{ width: 40, height: 30 }}
            />

            <Text
              style={{
                fontSize: 22,

                marginLeft: 10,
                color: "#00000090",
              }}
            >
              1 {"  "}= {"  "}
            </Text>

            <Image
              source={require("../assets/naira.png")}
              resizeMode="contain"
              style={{ width: 40, height: 30 }}
            />

            <Text
              style={{
                fontSize: 22,
                color: "#00000090",
              }}
            >
              50
            </Text>
          </View> */}

          <TouchableOpacity
            activeOpacity={0.9}
            style={{ height: 50 }}
            onPress={() => {
              props.navigation.navigate("PurchaseKoin");
            }}
          >
            <Image
              source={require("../assets/buy-more.png")}
              style={{ height: "170%", width: 300, marginTop: 50 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PurchaseModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    height: "110%",
  },
});
