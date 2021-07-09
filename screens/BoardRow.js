import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import {
  Animated,
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
  Dimensions,
  Platform,
  PixelRatio,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../src/actions/game.actions";
import { userActions } from "../src/actions/user.actions";
import CHeader from "./auth/CHeader";
import LeaderboardInline from "./UserPack/LeaderboardInline";
import AwardsInline from "./UserPack/AwardsInline";
import FastImage from "react-native-fast-image";
import DeviceInfo from "react-native-device-info";
import { appSounds } from "..";
// import Sound from "react-native-sound";

const BoardRow = ({ idx, entry }) => {
  const dispatch = useDispatch();
  const hasNotch = DeviceInfo.hasNotch();
  const token = useSelector((state) => state.authReducer.token);
  const kickLeaderboard = useSelector(
    (state) => state.gameReducer.kickLeaderboard
  );
  const goalLeaderboard = useSelector(
    (state) => state.gameReducer.goalLeaderboard
  );
  const player = useSelector((state) =>
    state.userReducer.player ? state.userReducer.player : null
  );

  const opacity = useState(new Animated.Value(0))[0];
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {});
  }, []);

  return (
    <React.Fragment key={idx}>
      <Animated.View
        style={{
          opacity,
          flexDirection: "row",
          height: 50,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderBottomWidth: 2,
          borderBottomColor: "#25265A00",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff12",
            height: "100%",
            width: "25%",
            borderTopLeftRadius: idx == 0 ? 30 : 0,
          }}
        >
          <Image
            source={require("../assets/money.png")}
            style={{ height: 15, width: 15 }}
          />

          <Text
            style={[
              styles.boardText,
              {
                color: "white",
                marginLeft: 8,
              },
            ]}
          >
            {entry.prize == 0 ? "--" : numberWithCommas(entry.prize)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
            width: "50%",
          }}
        >
          <FastImage
            source={
              entry.player.profile.display_picture
                ? {
                    uri: entry.player.profile.display_picture.split("?")[0],
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                  }
                : require("../assets/dummy_avatar.png")
            }
            style={{
              marginLeft: 10,
              height: 25,
              width: 25,
              borderRadius: 30,
            }}
          />
          <Text
            style={[
              styles.boardText,
              {
                color: "white",
                marginLeft: 10,
              },
            ]}
          >
            {entry.player.username}
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",

            height: "100%",
            width: "25%",
            borderTopRightRadius: 30,
          }}
        >
          <Text style={[styles.boardText, { color: "white" }]}>
            {entry.duration.slice(0, 8)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 3,
            }}
          >
            <Text
              style={[
                styles.boardText,
                {
                  color: "white",
                  marginLeft: 4,
                },
              ]}
            >
              {entry.score} pts
            </Text>
          </View>
        </View>
      </Animated.View>
    </React.Fragment>
  );
};

export default BoardRow;

const styles = StyleSheet.create({
  container: {
    height: "120%",
  },
  boardText: {
    // fontSize: actuatedNormalize(10),
  },
  headerText: {
    fontSize: Dimensions.get("screen").height * 0.02,
  },
});
