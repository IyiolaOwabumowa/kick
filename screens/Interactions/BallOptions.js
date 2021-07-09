import React, { useState, useRef, useEffect } from "react";
import FastImage from "react-native-fast-image";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
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

const BallOptions = (props) => {
  let animation = useRef(new Animated.Value(90));
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const width = animation.current.interpolate({
    inputRange: [0, 90],
    outputRange: ["0%", "90%"],
    extrapolate: "clamp",
  });

  const [toggleVisibility, setToggleVisibility] = useState(false);
  const [ball, setBall] = useState(null);
  useEffect(() => {
    // console.log(width);
  }, []);
  return (
    <>
      <Animated.View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#ffffff10",
          width,
          height: "25%",
          borderRadius: 100,
          padding: 2,
        }}
      >
        {!toggleVisibility ? (
          <>
            {props.options.map((item) => {
              return (
                <React.Fragment key={item.id}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        setToggleVisibility(!toggleVisibility);
                        setBall(item.content);
                        props.selectedOption(item.content, item.id);
                        ReactNativeHapticFeedback.trigger("selection", options);
                        Animated.spring(animation.current, {
                          toValue: 45,
                          duration: 300,
                          friction: 6,
                          useNativeDriver: false,
                        }).start();
                      }}
                      activeOpacity={0.8}
                      style={{
                        width: 80,
                        height: "75%",
                      }}
                    >
                      <FastImage
                        style={{ height: "90%", width: "100%" }}
                        source={{
                          uri: item.image.split("?")[0],
                          priority: FastImage.priority.high,
                          cache: FastImage.cacheControl.immutable,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <>
            {props.options.map((item) => {
              if (item.content == ball) {
                return (
                  <React.Fragment key={item.id}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ width: "40%", height: "70%" }}
                      >
                        <FastImage
                          style={{ height: "90%", width: "100%" }}
                          source={{
                            uri: item.image.split("?")[0],
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setToggleVisibility(!toggleVisibility);
                          setBall(null);
                          props.selectedOption(null, item.id);
                          Animated.spring(animation.current, {
                            toValue: 87,
                            duration: 300,
                            friction: 6,
                            useNativeDriver: false,
                          }).start();
                        }}
                        activeOpacity={0.8}
                        style={{ width: "40%", height: "70%" }}
                      >
                        <Image
                          source={require("../../assets/back-button-game.png")}
                          resizeMode="contain"
                          style={{ height: "90%", width: "100%" }}
                        />
                      </TouchableOpacity>
                    </View>
                  </React.Fragment>
                );
              }
            })}
          </>
        )}
      </Animated.View>
    </>
  );
};

export default BallOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
