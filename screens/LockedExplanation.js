import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../src/actions/game.actions";
import { userActions } from "../src/actions/user.actions";
import CHeader from "./auth/CHeader";
import LeaderboardInline from "./UserPack/LeaderboardInline";
import AwardsInline from "./UserPack/AwardsInline";

const LockedExplanation = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const leaderboard = useSelector((state) =>
    state.gameReducer.leaderboard ? state.gameReducer.leaderboard : null
  );
  const player = useSelector((state) =>
    state.userReducer.player ? state.userReducer.player : null
  );
  var status = "not found";
  var mappingStatus = "initiated";
  var started = null;
  var ended = null;
  var position = null;
  var dp = null;

  useEffect(() => {
    dispatch(userActions.getPlayer());
  }, []);

  useEffect(() => {
    dispatch(gameActions.getLeaderboard(token));
  }, []);

  useEffect(() => {
    //console.log(leaderboard);
  }, [JSON.stringify(leaderboard)]);

  const LeftHeaderComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack(null);
        }}
        style={{
          width: "10%",
          height: "40%",
        }}
      >
        <Image
          source={require("../assets/back-button-game.png")}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableOpacity>
    );
  };
  const RightHeaderComponent = () => {
    return (
      <TouchableOpacity
        style={{
          width: "10%",
          height: "40%",
        }}
      ></TouchableOpacity>
    );
  };
  return (
    <ImageBackground
      source={require("../assets/settings-bg2.png")}
      style={styles.container}
    >
      <CHeader
        leftC={<LeftHeaderComponent />}
        middleC={""}
        rightC={<RightHeaderComponent />}
      />

      {/* <View
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
            const mark = item.gameplay.player.username == player.username;
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
              <React.Fragment key={item.gameplay.id}>
                <AwardsInline
                  award={badge}
                  playerName={item.gameplay.player.username}
                  dp={item.gameplay.player.profile.display_picture}
                />
              </React.Fragment>
            );
          })}
      </View> */}

      <View
        style={{
          flex: 1,
          backgroundColor: "#25265A40",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <View
          style={{ paddingLeft: 30, paddingRight: 30, alignItems: "center" }}
        >
          <Image
            source={require("../assets/ad1.png")}
            style={{ width: "100%" }}
          />

          <Text
            style={{
              color: "white",
              fontWeight: "700",
              fontSize: 20,
              lineHeight: 30,
              marginTop: 30,
              textAlign: "center",
            }}
          >
            Why does this say {"\n"} "resumes soon"?
          </Text>
          <Text
            style={{
              color: "white",

              fontSize: 13,
              lineHeight: 30,
              marginTop: 30,
              textAlign: "center",
            }}
          >
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </Text>
          <TouchableOpacity
            activeOpacity={0.89}
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Text
              style={{
                color: "#ffffff80",

                fontSize: 15,
                lineHeight: 30,
                marginTop: 30,
                textAlign: "center",
              }}
            >
              {" "}
              I understand this{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default LockedExplanation;

const styles = StyleSheet.create({
  container: {
    height: "105%",
  },
});
