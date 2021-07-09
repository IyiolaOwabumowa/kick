import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Animated,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const TextOptions = (props) => {
  const alpha = ["A", "B", "C", "D"];
  const buttonColors = ["#BF2577", "#17B56B", "#31B6CC", "#F29F35"];
  // const [clicked, setClicked] = useState(false);
  // const selectedOption =()=>{
  //   setClicked(!clicked)
  // }

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  let animation = useRef(new Animated.Value(0));
  let colorAnimation = useRef(new Animated.Value(0));

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ["25%", "100%"],
    extrapolate: "clamp",
  });

  const buttonColor = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ["#4C4D7D", buttonColors[props.index]],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (props.index != props.selectedIdx) {
      Animated.timing(animation.current, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [props.selectedIdx]);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          ReactNativeHapticFeedback.trigger("selection", options);
          Animated.timing(animation.current, {
            toValue: 100,
            duration: 300,
            useNativeDriver: false,
          }).start();
          props.manageSelectedOption(props.option, props.index);
        }}
        style={{
          height: props.combined ? "25%" : 50,
          marginBottom: props.combined ? 8 : 8,
          width: "90%",
          justifyContent: "center",
          borderWidth: 1,
          borderRadius: 30,
          borderColor: "#ffffff10",
        }}
      >
        <Animated.View
          style={{
            height: "100%",
            width,
            borderWidth: 0.6,
            borderRadius: 30,
            borderColor: "#4C4D7D",
            backgroundColor: "#4C4D7D",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              color: "#ffffff80",
              fontSize: 20,
              paddingLeft: 30,
            }}
          >
            {alpha[props.index]}
          </Text>
        </Animated.View>
        <Text
          style={{
            color: "#ffffff",
            fontSize: 17,
            paddingLeft: 90,
            position: "absolute",
          }}
        >
          {props.option}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default TextOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
