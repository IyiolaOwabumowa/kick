import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import FastImage from "react-native-fast-image";

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

const LoadGame = (props) => {
  // const { playerId } = props.route.params.game;
  // const { categoryId } = props.route.params.game;
  const token = useSelector((state) => state.authReducer.token);
  const loading = useSelector((state) => state.gameReducer.gameloading);
  const go = useSelector((state) => state.gameReducer.gameObj);
  const totalNumberOfQuestions = useSelector(
    (state) => state.gameReducer.totalNumberOfQuestions
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // useEffect(() => {
  //   dispatch(gameActions.startGame(token, categoryId, playerId));
  // }, []);

  // useEffect(() => {
  //   if (loading == false) {
  //      navigation.navigate("NextGame");
  //   }
  // }, [loading]);

  useEffect(() => {
    var urlOfImages = [];
    if (go) {
      go.questions.forEach((question) => {
        if (question.images) {
          question.images.forEach((imageObject) => {
            urlOfImages.push({
              uri: imageObject.image.split("?")[0],
            });
          });
        }
        if (question.options[0] && question.options[0].image) {
          question.options.forEach((options) => {
            urlOfImages.push({
              uri: options.image.split("?")[0],
            });
          });
        }
      });

      if (urlOfImages.length != 0) {
        // console.log(urlOfImages);
        FastImage.preload(urlOfImages);
      }
    }
  }, [go]);

  return (
    <ImageBackground
      source={require("../../assets/gametype-bg.png")}
      style={styles.container}
      blurRadius={20}
    >
      <ActivityIndicator size="large" color="#fff" />
      <Text style={{ color: "white", marginTop: 30 }}>
        Preparing you for greatness
      </Text>
    </ImageBackground>
  );
};

export default LoadGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#10123A",
    height: "130%",
  },
});
