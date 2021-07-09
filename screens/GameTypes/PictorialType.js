import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { useInterval } from "../../src/helpers/useInterval";

import React, { useEffect, useState } from "react";
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
  Dimensions,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import BallOptions from "../Interactions/BallOptions";
import ProgressBar from "../Interactions/ProgressBar";
import TextOptions from "../Interactions/TextOptions";
import PictorialPointsWinFeedback from "../Feedback/PictorialPointsWinFeedback";

const PictorialType = (props) => {
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
  const featuredImage =
    go.questions[totalAnsweredQuestions - 1].images[0].image;

  const [checkValues, setCheckValues] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(null);

  const manageSelectedOption = (option, idx) => {
    setError(null);
    setSelectedOption(option);
  };

  const submitAnswer = () => {
    if (selectedOption == null) {
      setError("You have not chosen any ball");
    } else {
      dispatch(
        gameActions.submitAnswer(token, selectedOption, gameplayId, questionId)
      );
      setSelectedOption(null);
      // props.navigation.navigate("PictorialPointsWinFeedback", {
      //   answer: {
      //     answerImage: go.questions[totalAnsweredQuestions - 1].images[1].image,
      //   },
      // });
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
    props.navigation.navigate("PictorialPointsWinFeedback", {
      answer: {
        answerImage: go.questions[totalAnsweredQuestions - 1].images[1].image,
      },
    });
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
    return (
      <PictorialPointsWinFeedback
        navigation={props.navigation}
        answerImage={go.questions[totalAnsweredQuestions - 1].images[1].image}
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
          duration={go && go.time_per_question * 1000}
          timeout={timeout}
        />
        <View style={{ height: "50%", marginTop: 30 }}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 0,
              marginBottom: 20,
              fontSize: 20,
            }}
          >
            {question}
          </Text>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FastImage
              style={{ height: "90%", width: "100%" }}
              source={{
                uri: featuredImage.split("?")[0],
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        </View>

        <Text
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
          }}
        >
          {error}
        </Text>
        <View style={{ marginTop: 0, alignItems: "center" }}>
          <BallOptions
            options={options}
            selectedOption={manageSelectedOption}
          />
          <TouchableOpacity
            onPress={() => {
              submitAnswer();
            }}
            activeOpacity={0.9}
            style={{ width: "100%", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/nextgame.png")}
              resizeMode="contain"
              style={{ width: "70%", marginTop: 20 }}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

export default PictorialType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    height: "150%",
    backgroundColor:"#10123A"
  },
});
