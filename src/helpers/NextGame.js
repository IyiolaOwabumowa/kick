import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
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
import { compose } from "redux";
import CombinedType from "../../screens/GameTypes/CombinedType";
import PictorialType from "../../screens/GameTypes/PictorialType";
import TextType from "../../screens/GameTypes/TextType";
import LoadGame from "../../screens/Interactions/LoadGame";
import { gameActions } from "../actions/game.actions";
import { userActions } from "../actions/user.actions";



const NextGame = (props) => {
  const { playerId } = props.route.params.game;
  const { categoryId } = props.route.params.game;
  const { seasonId } = props.route.params.game;

  const token = useSelector((state) => state.authReducer.token);
  const loading = useSelector((state) => state.gameReducer.gameloading);
  const go = useSelector((state) => state.gameReducer.gameObj);
  const error = useSelector((state) => state.gameReducer.error);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const totalNumberOfQuestions = useSelector(
    (state) => state.gameReducer.totalNumberOfQuestions
  );
  const totalAnsweredQuestions = useSelector(
    (state) => state.gameReducer.totalAnsweredQuestions
  );
  const answerObj = useSelector((state) =>
    state.gameReducer.answerObj ? state.gameReducer.answerObj : null
  );
  const correct = answerObj && answerObj.correct;

  const [cachingDone, setCachingDone] = useState(false);
  const [localLoader, setLocalLoader] = useState(true);

  // useEffect(() => {
  //   if (correct) {
  //     dispatch(gameActions.addPoints(questionPoints));
  //   }
  // }, [correct]);

  useEffect(() => {
    dispatch(gameActions.startGame(token, categoryId, playerId, seasonId));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLocalLoader(false);
    }, 5000);
  }, []);



  useEffect(() => {}, [totalAnsweredQuestions]);

  if (localLoader) {
    return <LoadGame />;
  }

  if (go) {
    if (
      go.questions[totalAnsweredQuestions - 1].images.length > 0 &&
      go.questions[totalAnsweredQuestions - 1].options[0].image != null
    ) {
      return (
        <>
          <PictorialType navigation={props.navigation} />
        </>
      );
    } else if (
      go.questions[totalAnsweredQuestions - 1].images.length == 0 &&
      go.questions[totalAnsweredQuestions - 1].options[0].image == null
    ) {
      var initCheckValues = [];
      for (
        var i = 0;
        i < go.questions[totalAnsweredQuestions - 1].options.length;
        i++
      ) {
        initCheckValues.push(false);
      }
      return (
        <>
          <TextType
            initCheckValues={initCheckValues}
            navigation={props.navigation}
          />
        </>
      );
    } else if (
      go.questions[totalAnsweredQuestions - 1].images.length > 0 &&
      go.questions[totalAnsweredQuestions - 1].options[0].image == null
    ) {
      var initCheckValues = [];
      for (
        var i = 0;
        i < go.questions[totalAnsweredQuestions - 1].options.length;
        i++
      ) {
        initCheckValues.push(false);
      }
      return (
        <>
          <CombinedType
            initCheckValues={initCheckValues}
            navigation={props.navigation}
          />
        </>
      );
    }
  } else {
    return (
      <>
        <ImageBackground
          source={require("../../assets/gametype-bg.png")}
          style={styles.container}
        >
          <Text style={{ color: "white", marginTop: 30, textAlign: "center" }}>
            {error ? (
              error
            ) : (
              <>
                We're preparing your game questions {"\n"}Please try again later
              </>
            )}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              flexDirection: "row",
              marginTop: 20,
              borderRadius: 50,
              width: "60%",
              height: 60,
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              props.navigation.navigate("Dashboard");
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Back to Dashboard
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </>
    );
  }
};

export default NextGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "120%",
  },
});
