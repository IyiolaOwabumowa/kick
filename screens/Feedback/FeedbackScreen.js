import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import { userActions } from "../../src/actions/user.actions";
import CHeader from "../auth/CHeader";
import LeaderboardInline from "../UserPack/LeaderboardInline";

const FeedbackScreen = (props) => {
  const dispatch = useDispatch();
  const toastMessage = useSelector((state) => state.userReducer.toastMessage);
  const [emo, setEmo] = useState(null);
  const player = useSelector((state) =>
    state.userReducer.player ? state.userReducer.player : null
  );
  const token = useSelector((state) => state.authReducer.token);

  useEffect(() => {
    // dispatch(userActions.clearToastMessage());
    if (props.emo == "excitement") {
      setEmo(require("../../assets/excitement.png"));
    } else if (props.emo == "tears") {
      setEmo(require("../../assets/tears.png"));
    } else if (props.emo == "sadness") {
      setEmo(require("../../assets/sadness.png"));
    } else {
      setEmo(require("../../assets/wink.png"));
    }
  }, []);

  const nextScreen = () => {
    dispatch(userActions.clearToastMessage());
    dispatch(gameActions.clearPayment());

    props.navigation.navigate("Dashboard");
  };

  return (
    <>
      <ImageBackground
        source={require("../../assets/feedback-bg.png")}
        style={{
          flex: 1,
          width: "100%",
          height: "101%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={emo}
          style={{ width: 180, height: 180, marginBottom: 50 }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 23,
            fontWeight: "300",
            textAlign: "center",
            paddingLeft: 70,
            paddingRight: 70,
            marginBottom: 100,
          }}
        >
          {props.title}
        </Text>
        <TouchableOpacity
          onPress={() => {
            nextScreen();
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
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

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
