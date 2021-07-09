import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { appSounds } from "../..";
import { gameActions } from "../../src/actions/game.actions";

const LeaderboardWin = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const player = useSelector((state) => state.userReducer.player);
  const go = useSelector((state) => state.gameReducer.gameObj);
  const gameplayId = go && go.gameplay;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.navigation.navigate("Dashboard");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );
  useEffect(() => {}, [JSON.stringify(go)]);

  useEffect(() => {
    appSounds.finalscore.play();
    appSounds.finalscore.setVolume(0.3);
    return () => {
      dispatch(gameActions.resetQA());
      dispatch(gameActions.clearAnswer());
      dispatch(gameActions.clearPayment());
    };
  }, []);
  return (
    <>
      <ImageBackground
        source={require("../../assets/reg-s-feedback.png")}
        style={styles.container}
      >
        <Image
          source={require("../../assets/leaderboard-win.png")}
          resizeMode="contain"
          style={{ height: "40%" }}
        />
        <Text style={{ color: "white", fontSize: 28 }}>{props.title}</Text>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            lineHeight: 30,
            padding: 40,
            textAlign: "center",
          }}
        >
          {props.content}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{ width: "100%", alignItems: "center" }}
          onPress={() => {
            dispatch(gameActions.resetQA());
            props.navigation.navigate("Dashboard");
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

export default LeaderboardWin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    height: "110%",
  },
});
