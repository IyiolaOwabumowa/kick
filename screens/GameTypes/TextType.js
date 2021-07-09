import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useInterval } from "../../src/helpers/useInterval";
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
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import BallOptions from "../Interactions/BallOptions";
import ProgressBar from "../Interactions/ProgressBar";
import TextOptions from "../Interactions/TextOptions";
import TextTypeFeedback from "../Feedback/TextTypeFeedback";
import { gameConstants } from "../../src/constants/gameConstants";
import { showMessage } from "react-native-flash-message";

const TextType = (props) => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const focused = useIsFocused();
  const player = useSelector((state) => state.userReducer.player);
  const token = useSelector((state) => state.authReducer.token);
  const go = useSelector((state) => state.gameReducer.gameObj);
  const totalAnsweredQuestions = useSelector(
    (state) => state.gameReducer.totalAnsweredQuestions
  );
  const gameplayId = go && go.gameplay;
  const totalPoints = go && go.game_session.points;
  const questionPoints =
    go && go.questions[totalAnsweredQuestions - 1].category.score;
  const questionId = go && go.questions[totalAnsweredQuestions - 1].id;
  const question = go && go.questions[totalAnsweredQuestions - 1].content;
  const options = go && go.questions[totalAnsweredQuestions - 1].options;
  const totalNumberOfQuestions = useSelector(
    (state) => state.gameReducer.totalNumberOfQuestions
  );
  const answerObj = useSelector((state) =>
    state.gameReducer.answerObj ? state.gameReducer.answerObj : null
  );
  const categories = useSelector((state) => state.gameReducer.categories);
  const [checkValues, setCheckValues] = useState([false, false, false, false]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [error, setError] = useState(null);
  const [barValue, setBarValue] = useState(null);

  const manageSelectedOption = (option, idx) => {
    setError(null);
    for (var i = 0; i < checkValues.length; i++) {
      if (i == idx) {
        checkValues[i] = true;
      } else {
        checkValues[i] = false;
      }
    }
    setSelectedOption(option);
    setSelectedIdx(idx);
  };

  const submitAnswer = () => {
    if (selectedOption == null) {
      showMessage({
        message: "You can't move on!",
        description: "Please select an option",
        type: "warning",
        duration: 4000,
        position: "top",
      });
    } else {
      setBarValue(0);
      dispatch(
        gameActions.submitAnswer(token, selectedOption, gameplayId, questionId)
      );
      setSelectedOption(null);
      // props.navigation.navigate("TextTypeFeedback");
    }
  };

  useEffect(() => {}, [selectedOption]);

  // useEffect(() => {
  //   if (answerObj) {

  //   }
  // }, [JSON.stringify(answerObj)]);

  useEffect(() => {
    const newVal = [];
    for (var i = 0; i < options.length; i++) {
      newVal.push(false);
    }
    setCheckValues(newVal);
  }, [focused]);

  useEffect(() => {}, [JSON.stringify(go), totalAnsweredQuestions]);

  const timeout = () => {
    dispatch(
      gameActions.submitAnswer(token, selectedOption, gameplayId, questionId)
    );
    props.navigation.navigate("TextTypeFeedback");
  };

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

  if (answerObj) {
    return <TextTypeFeedback navigation={props.navigation} />;
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
          duration={go && go.time_per_question * 1000}
          timeout={timeout}
          barValue={barValue}
        />

        <View
          style={{
            marginTop: 20,
            marginBottom: 0,
            alignItems: "center",

            height: "55%",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#25265A",
              width: "100%",
              borderRadius: 10,
              position: "absolute",
              paddingBottom: 60,
            }}
          >
            {/* <Text
              style={{
                color: "#ffffff90",
                textAlign: "center",
                marginTop: 20,
                marginBottom: error ? 20 : 0,
                fontSize: 13,
              }}
            >
              {error}
            </Text> */}
            <Text
              style={{
                color: "white",
                lineHeight: 24,
                marginBottom: 10,
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 15,
                paddingRight: 15,
                textAlign: "center",
                fontSize: 17,
              }}
            >
              {question.slice(0, 300)}
            </Text>

            {options.map((item, idx) => {
              return (
                <React.Fragment key={item.id}>
                  <TextOptions
                    option={item.content}
                    index={idx}
                    checked={checkValues[idx]}
                    manageSelectedOption={manageSelectedOption}
                    selectedIdx={selectedIdx}
                  />
                </React.Fragment>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            submitAnswer();
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

export default TextType;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    height: "150%",
    backgroundColor:"#10123A"
  },
});
