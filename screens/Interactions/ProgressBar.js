import React, { useEffect, useRef, useState } from "react";
import { useInterval } from "../../src/helpers/useInterval";
import { useIsFocused } from "@react-navigation/native";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  Animated,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import DeviceInfo from "react-native-device-info";

const ProgressBar = (props) => {
  const [widthAnimation, setWidthAnimation] = useState(new Animated.Value(0));
  const colorAnimation = useRef(new Animated.Value(0));
  const dispatch = useDispatch();
  const go = useSelector((state) => state.gameReducer.gameObj);
  const totalPoints = go && go.game_session.points;
  const totalNumberOfQuestions = useSelector(
    (state) => state.gameReducer.totalNumberOfQuestions
  );
  const totalAnsweredQuestions = useSelector(
    (state) => state.gameReducer.totalAnsweredQuestions
  );
  const progressivePoints = useSelector(
    (state) => state.gameReducer.progressivePoints
  );
  const percentage = (totalAnsweredQuestions / totalNumberOfQuestions) * 100;
  const isFocused = useIsFocused();
  useEffect(() => {}, [JSON.stringify(go)]);

  const [progress, setProgress] = useState(0);

  useInterval(
    () => {
      if (progress <= props.duration / 1000) {
        setProgress(progress + 1);
      }

      if (progress > props.duration / 1000) {
        setProgress(0);
      }
    },
    props.duration != null ? 1000 : null
  );

  useEffect(() => {
    if (props.duration / 1000 - progress <= 15) {
      Animated.timing(colorAnimation.current, {
        toValue: 100,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }
  }, [progress]);

  useEffect(() => {
    if (!isFocused) {
      widthAnimation.setValue(0);
      colorAnimation.current.setValue(0);
      // Animated.timing(widthAnimation).reset();
    }

    Animated.timing(widthAnimation, {
      toValue: 100,
      duration: props.duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        props.timeout();
      }
    });

    // Animated.timing(widthAnimation, {
    //   toValue: 100,
    //   duration: props.duration,
    //   useNativeDriver: false,
    // }).stop();
  }, [isFocused, props.barValue, props.mounted, props.duration]);

  const width = props.duration
    ? widthAnimation.interpolate({
        inputRange: [0, 100],
        outputRange: ["4%", "96%"],
        extrapolate: "clamp",
      })
    : 0;

  const color = props.duration
    ? colorAnimation.current.interpolate({
        inputRange: [0, 100],
        outputRange: ["#38BD8B", "#ff073a"],
        extrapolate: "clamp",
      })
    : 0;

  const hasNotch = DeviceInfo.hasNotch();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: hasNotch ? "10%" : "1%",
        }}
      >
        <View
          style={{ flexDirection: "row", width: "20%", alignItems: "center" }}
        >
          <Image
            source={require("../../assets/questioncount.png")}
            resizeMode="contain"
            style={{ height: 20 }}
          />
          <Text style={{ color: "white" }}>
            {totalAnsweredQuestions}/{totalNumberOfQuestions}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            dispatch(gameActions.resetQA());
            dispatch(gameActions.clearAnswer());
            dispatch(gameActions.clearPayment());
            props.navigation.navigate("Dashboard");
          }}
          activeOpacity={0.9}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "30%",
            padding: 5,

            borderRadius: 2,
            backgroundColor: "#ffffff20",
          }}
        >
          <Text style={{ color: "white", fontSize: 14 }}>Go Home</Text>
        </TouchableOpacity>
        <View
          style={{ flexDirection: "row", width: "20%", alignItems: "center" }}
        >
          <Image
            source={require("../../assets/pointscount.png")}
            resizeMode="contain"
            style={{ height: 20 }}
          />
          <Text style={{ color: "white" }}>{progressivePoints}</Text>
        </View>
      </View>

      {props.disabled ? null : (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 50,
              borderColor: "#cdcdcd70",
              height: 30,
              width: "100%",
              marginTop: 25,
            }}
          >
            <Animated.View
              style={{
                borderWidth: 1,
                borderRadius: 50,
                backgroundColor: color,
                borderColor: color,
                height: 15,
                width,
                justifyContent: "center",
                top: 5.3,
                left: "2%",
                right: "2%",
              }}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
