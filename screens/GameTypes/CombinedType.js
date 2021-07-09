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
import TextTypeFeedback from "../Feedback/TextTypeFeedback";
import { showMessage } from "react-native-flash-message";

const CombinedType = (props) => {
  const scheight = Dimensions.get("window").height;
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
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
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [error, setError] = useState(null);

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
      setError("You have not selected any option");
      showMessage({
        message: "You can't move on!",
        description: "Please select an option",
        type: "warning",
        duration: 4000,
        position:"top"
        
      });
    } else {
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

  useEffect(() => {
    // console.log(go);
  }, [JSON.stringify(go), totalAnsweredQuestions]);

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
        <ScrollView
          style={{ height: "90%" }}
          contentContainerStyle={{ paddingBottom: 400 }}
          showsVerticalScrollIndicator={false}
        >
          <ProgressBar
            navigation={props.navigation}
            duration={go && go.time_per_question * 1000}
            timeout={() => {}}
          />

          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 20,
                marginBottom: 20,
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
                style={{
                  height: scheight / 3.5,
                  width: "100%",
                }}
                source={{
                  uri: featuredImage && featuredImage.split("?")[0],
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                resizeMode="contain"
              />
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
              marginBottom:30,
              alignItems: "center",
              height: 170,
            }}
          >
            {options.map((item, idx) => {
              return (
                <React.Fragment key={item.id}>
                  <TextOptions
                    option={item.content}
                    index={idx}
                    checked={checkValues[idx]}
                    manageSelectedOption={manageSelectedOption}
                    selectedIdx={selectedIdx}
                    combined
                  />
                </React.Fragment>
              );
            })}
          </View>

          {/* <Text
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 13,
              fontSize: 13,
            }}
          >
            {error}
          </Text> */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              width: "100%",
              alignItems: "center",
            }}
            onPress={() => {
              submitAnswer();
            }}
          >
            <Image
              source={require("../../assets/nextgame.png")}
              resizeMode="contain"
              style={{ height: "35%" }}
            />
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default CombinedType;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    height: "150%",
    backgroundColor:"#10123A"
  },
});
