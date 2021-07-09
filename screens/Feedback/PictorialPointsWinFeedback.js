import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
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
  BackHandler,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import BallOptions from "../Interactions/BallOptions";
import ProgressBar from "../Interactions/ProgressBar";
import TextOptions from "../Interactions/TextOptions";
import LeaderboardWin from "./LeaderboardWin";

const PictorialPointsWinFeedback = (props) => {
  const answerImage = props.answerImage;
  //console.log(answerImage);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const player = useSelector((state) => state.userReducer.player);
  const totalPoints = useSelector((state) => state.gameReducer.points);
  const loading = useSelector((state) => state.gameReducer.loading);
  const go = useSelector((state) => state.gameReducer.gameObj);
  const to = useSelector((state) => state.gameReducer.timeObject);
  const totalAnsweredQuestions = useSelector(
    (state) => state.gameReducer.totalAnsweredQuestions
  );
  const totalNumberOfQuestions = useSelector(
    (state) => state.gameReducer.totalNumberOfQuestions
  );
  const answerObj = useSelector((state) =>
    state.gameReducer.answerObj ? state.gameReducer.answerObj : null
  );
  const questionPoints =
    go && go.questions[totalAnsweredQuestions - 1].category.score;
  const gameplayId = go && go.gameplay;
  const correct = answerObj && answerObj.correct == true ? true : false;
  const [checkValues, setCheckValues] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  // const [answerImg, setAnswerImg] = useState(go.questions[totalAnsweredQuestions - 1].images[1].image);
  const [error, setError] = useState(null);
  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const handleNextScreen = () => {
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

  useEffect(() => {}, [
    JSON.stringify(go),
    gameCompleted,
    totalAnsweredQuestions,
  ]);

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
        source={require("../../assets/gametype-feedback-bg.png")}
        style={styles.container}
        blurRadius={20}
      >
        <View style={{ flex: 0.7, justifyContent:"center" }}>
          <FastImage
            style={{  height: "50%" }}
            source={{
              uri: answerImage && answerImage.split("?")[0],
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          {loading ? (
            <React.Fragment>
              <ActivityIndicator size="large" color="#fff" />
            </React.Fragment>
          ) : (
            <>
              {correct ? (
                <>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      marginBottom: 20,
                      fontSize: 23,
                    }}
                  >
                    Goal !!!
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      marginBottom: 20,
                      fontSize: 18,
                    }}
                  >
                    You've won {questionPoints} points
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      marginBottom: 20,
                      fontSize: 23,
                      fontWeight: "700",
                    }}
                  >
                    Oops !!!
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      marginBottom: 20,
                      fontSize: 18,
                      lineHeight: 30,
                    }}
                  >
                    You missed, take a look {"\n"} at where the ball was.
                  </Text>
                </>
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            handleNextScreen();
          }}
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

export default PictorialPointsWinFeedback;

const styles = StyleSheet.create({
  container: {
    padding: 30,

    height: "150%",
    backgroundColor:"#10123A"
  },
});
