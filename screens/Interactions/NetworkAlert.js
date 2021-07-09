import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import { userActions } from "../../src/actions/user.actions";

const NetworkAlert = (props) => {
  // const { playerId } = props.route.params.game;
  // const { categoryId } = props.route.params.game;
  const token = useSelector((state) => state.authReducer.token);
  const loading = useSelector((state) => state.gameReducer.gameloading);
  const go = useSelector((state) => state.gameReducer.gameObj);
  const totalNumberOfQuestions = useSelector(
    (state) => state.gameReducer.totalNumberOfQuestions
  );

  return (
    <ImageBackground
      source={require("../../assets/gametype-bg.png")}
      style={styles.container}
      blurRadius={10}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: "white",
          marginTop: 30,
          fontSize: 20,
        }}
      >
        Unstable Internet Connection
      </Text>
      <Text
        style={{
          color: "white",
          padding: 30,
          fontSize: 15,
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        Your internet connection seems weak. Please move to somewhere with a
        stronger connection while we reconnect you.
      </Text>

      <ActivityIndicator size="large" color="#fff" />
    </ImageBackground>
  );
};

export default NetworkAlert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "120%",
  },
});
