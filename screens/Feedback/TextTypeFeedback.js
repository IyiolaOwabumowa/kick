import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import NextGame from "../../src/helpers/NextGame";
import BallOptions from "../Interactions/BallOptions";
import ProgressBar from "../Interactions/ProgressBar";
import TextOptions from "../Interactions/TextOptions";
import LeaderboardWin from "./LeaderboardWin";
import PictorialPointsWinFeedback from "./PictorialPointsWinFeedback";

const TextTypeFeedback = (props) => {
  const dispatch = useDispatch();
  const alpha = ["A", "B", "C", "D"];
  const player = useSelector((state) => state.userReducer.player);
  const token = useSelector((state) => state.authReducer.token);
  const go = useSelector((state) =>
    state.gameReducer.gameObj ? state.gameReducer.gameObj : null
  );
  const totalAnsweredQuestions = useSelector(
    (state) => state.gameReducer.totalAnsweredQuestions
  );
  const answerObj = useSelector((state) =>
    state.gameReducer.answerObj ? state.gameReducer.answerObj : null
  );
  const gameplayId = go && go.gameplay;
  const questionPoints =
    go && go.questions[totalAnsweredQuestions - 1].category.score;
  const questionId = go && go.questions[totalAnsweredQuestions - 1].id;
  const question = go && go.questions[totalAnsweredQuestions - 1].content;
  const options = go ? go.questions[totalAnsweredQuestions - 1].options : null;
  const userAnswer = answerObj && answerObj.answer ? answerObj.answer : null;
  const loading = useSelector((state) => state.gameReducer.loading);
  const correctAnswer = answerObj && answerObj.original_answer;
  const totalPoints = useSelector((state) => state.gameReducer.points);
  const correct = answerObj && answerObj.correct;
  const totalNumberOfQuestions = useSelector(
    (state) => state.gameReducer.totalNumberOfQuestions
  );
  const to = useSelector((state) => state.gameReducer.timeObject);
  const [mounted, setMounted] = useState(false);

  const [gameCompleted, setGameCompleted] = useState(false);
  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const handleNextScreen = () => {
    setMounted(true);
    if (totalAnsweredQuestions == totalNumberOfQuestions) {
      // redirect to the completed games message
      dispatch(gameActions.stopGame(gameplayId, token));
      setGameCompleted(true);
    } else {
      // increment
      dispatch(gameActions.incrementAnsweredQuestions(1));
      dispatch(gameActions.clearAnswer());
      props.navigation.navigate("NextGame");
    }
  };

  useEffect(() => {
    // console.log(options);
  }, [JSON.stringify(go), gameCompleted]);

  useEffect(() => {}, [JSON.stringify(to)]);

  useEffect(() => {
    if (correct) {
      dispatch(gameActions.addPoints(questionPoints));
      ReactNativeHapticFeedback.trigger("notificationSuccess", hapticOptions);
    }
    if (!correct & !loading) {
      ReactNativeHapticFeedback.trigger("notificationError", hapticOptions);
    }
  }, [correct, loading]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.navigation.navigate("Dashboard");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  useEffect(() => {}, [JSON.stringify(answerObj)]);

  // if (correct) {
  //   return <PictorialPointsWinFeedback image={false} questionPoints={questionPoints} />;
  // }

  if (gameCompleted && to) {
    return (
      <LeaderboardWin
        title={`Congratulations, ${player && player.username}! `}
        content={`You finished this round in ${to.timeSpent} with ${totalPoints} points`}
        navigation={props.navigation}
      />
    );
  }

  return (
    <>
      <ImageBackground
        source={require("../../assets/gametype-bg.png")}
        style={styles.container}
        blurRadius={20}
      >
        <ProgressBar
          navigation={props.navigation}
          disabled={true}
          mounted={mounted}
          timeout={() => {}}
        />

        <View
          style={{
            flex: 0.7,
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#435183",
              borderRadius: 10,
              width: "92%",
              position: "relative",
              top: 7,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          ></View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#25265A",
              paddingBottom: 30,
              width: "100%",
              borderRadius: 10,
              position: "absolute",
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "left",
                marginTop: 20,
                lineHeight: 24,
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 15,
                paddingRight: 15,
                textAlign: "center",
                fontSize: 17,
              }}
            >
              {question}
            </Text>

            {options
              ? options.map((item, idx) => {
                  if (correctAnswer == item.content) {
                    return (
                      <React.Fragment key={item.id}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          style={{
                            height: 50,
                            width: "90%",
                            borderWidth: 1,
                            borderRadius: 30,
                            borderColor: "#ffffff30",
                            backgroundColor: "green",
                            marginBottom: 15,
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#ffffff",
                              fontSize: 17,
                              paddingLeft: 90,
                            }}
                          >
                            {item.content}
                          </Text>
                          <View
                            style={{
                              height: "100%",
                              width: 75,
                              borderRadius: 30,
                              backgroundColor: "green",
                              justifyContent: "center",
                              alignItems: "flex-start",
                              position: "absolute",
                            }}
                          >
                            <Text
                              style={{
                                color: "#ffffff80",
                                fontSize: 20,
                                paddingLeft: 30,
                              }}
                            >
                              {alpha[idx]}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </React.Fragment>
                    );
                  }
                  if (userAnswer != null) {
                    if (correct == false && userAnswer == item.content) {
                      return (
                        <React.Fragment key={item.id}>
                          <TouchableOpacity
                            activeOpacity={0.9}
                            style={{
                              height: 50,
                              width: "90%",
                              borderWidth: 1,
                              borderRadius: 30,
                              borderColor: "#ffffff30",
                              backgroundColor: "#ffffff30",
                              marginBottom: 15,
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "#ffffff",
                                fontSize: 17,
                                paddingLeft: 90,
                              }}
                            >
                              {item.content}
                            </Text>
                            <View
                              style={{
                                height: "100%",
                                width: 75,
                                borderRadius: 30,
                                backgroundColor: "#ffffff30",
                                justifyContent: "center",
                                alignItems: "flex-start",
                                position: "absolute",
                              }}
                            >
                              <Text
                                style={{
                                  color: "#ffffff80",
                                  fontSize: 20,
                                  paddingLeft: 30,
                                }}
                              >
                                {alpha[idx]}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </React.Fragment>
                      );
                    }
                  }
                })
              : null}

            <View
              style={{
                flex: 0.6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <React.Fragment>
                  <ActivityIndicator size="large" color="#fff" />
                </React.Fragment>
              ) : null}
            </View>

            {correct == false && (
              <>
                <Text
                  style={{
                    color: "#ffffff50",
                    fontSize: 20,
                    marginTop: 70,
                    fontWeight: "700",
                  }}
                >
                  Yekpa!
                </Text>
                <Text
                  style={{
                    color: "#ffffff80",
                    fontSize: 16,
                    marginTop: 10,
                    paddingLeft: 15,
                    paddingRight: 15,
                    lineHeight: 25,
                  }}
                >
                  Correct Answer: {correctAnswer}
                </Text>
              </>
            )}

            {correct && (
              <>
                <Text
                  style={{
                    color: "#ffffff50",
                    fontSize: 23,
                    fontWeight: "700",
                    marginTop: 70,
                  }}
                >
                  Correct !!!
                </Text>
                <Text
                  style={{ color: "#ffffff80", fontSize: 16, marginTop: 10 }}
                >
                  You won {questionPoints} points
                </Text>
              </>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            handleNextScreen();
          }}
          activeOpacity={0.9}
          style={{
            width: "100%",
            postion: "absolute",
            bottom: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/nextgame.png")}
            resizeMode="contain"
            style={{ width: "70%" }}
          />
        </TouchableOpacity>
      </ImageBackground>
    </>
  );
};

export default TextTypeFeedback;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    // paddingTop: "20%",
    height: "150%",
    backgroundColor: "#10123A",
  },
});
