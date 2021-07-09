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
import BoardRow from "./BoardRow";
import { appSounds } from "..";

const Leaderboard = (props) => {
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
  const [animatedBoard, setAnimatedBoard] = useState([]);
  const [stateIndex, setStateIndex] = useState(0);

  const currentCat = props.route.params.screenDetails.categories;
  const leaderboard =
    currentCat.title.toLowerCase() == "kick"
      ? kickLeaderboard
      : goalLeaderboard;

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
    "window"
  );
  var temp = [];
  var index = 0;
  var faded = [];

  useEffect(() => {
    appSounds.boarditem.setVolume(0.05);
    appSounds.boarditem.play();
    const interval = setInterval(() => {
      if (index != leaderboard.length - 1) {
        appSounds.boarditem.stop();
      }
      if (index == leaderboard.length) {
        clearInterval(interval);
      } else {
        faded.push(index);
        temp = [...temp, { ...leaderboard[index] }];
        setAnimatedBoard(temp);
        index = index + 1;
        setStateIndex(index);
        if (index > 13) {
          appSounds.boarditem.stop();
        } else {
          appSounds.boarditem.play();
        }
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const LeftHeaderComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack(null);
        }}
        style={{
          alignItems: "flex-start",
          justifyContent: "center",

          width: "25%",
          height: "50%",
        }}
      >
        <Image
          source={require("../assets/back-button-game.png")}
          resizeMode="contain"
          style={{ width: "40%", height: "90%" }}
        />
      </TouchableOpacity>
    );
  };
  const RightHeaderComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("PersonalWins");
        }}
        style={{ width: "25%" }}
      >
        <Text style={[{ color: "white", fontSize: 19, textAlign: "right" }]}>
          My Wins
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.container}
      blurRadius={10}
    >
      <View style={{ marginTop: hasNotch ? 30 : 15 }}></View>
      <CHeader
        leftC={<LeftHeaderComponent />}
        middleC={"Leaderboard"}
        rightC={<RightHeaderComponent />}
      />
      {leaderboard && leaderboard.length == 0 ? (
        <View
          style={{
            padding: 20,

            flex: 0.8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>
            Start playing to appear on the leaderboard
          </Text>
        </View>
      ) : (
        <>
          <View
            style={{
              height: 100,
              marginTop: 20,
              marginBottom: 50,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {leaderboard &&
              leaderboard.map((item, idx) => {
                var badge = "";

                if (idx == 0) {
                  badge = "gold";
                }
                if (idx == 1) {
                  badge = "silver";
                }

                if (idx == 2) {
                  badge = "bronze";
                }
                if (idx >= 3) {
                  return null;
                }
                return (
                  <React.Fragment key={item.id}>
                    <AwardsInline
                      award={badge}
                      playerName={item.player.username}
                      dp={item.player.profile.display_picture}
                      category={currentCat}
                    />
                  </React.Fragment>
                );
              })}
          </View>

          <Animated.View
            style={{
              // marginLeft: 15,
              // marginRight: 15,
            
              height: "72%",
              bottom: 0,
              left: 0,
              right: 0,
              position: "absolute",
            }}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 300 }}
              showsVerticalScrollIndicator={true}
              style={{
                height: "100%",
                backgroundColor: "#25265A80",
                marginTop: 10,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
            >
              {animatedBoard.map((entry, idx) => {
                return <BoardRow key={idx} idx={idx} entry={entry} />;
              })}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </ImageBackground>
  );
};

export default Leaderboard;

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
