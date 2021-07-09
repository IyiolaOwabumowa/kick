import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
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

const LeaderboardLimited = (props) => {
  const currentCat = props.route.params.screenDetails.categories;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const categories = useSelector((state) => state.gameReducer.categories);
  const kickLeaderboard = useSelector(
    (state) => state.gameReducer.kickLeaderboard
  );
  const goalLeaderboard = useSelector(
    (state) => state.gameReducer.goalLeaderboard
  );
  const player = useSelector((state) =>
    state.userReducer.player ? state.userReducer.player : null
  );

  const leaderboard =
    currentCat.title.toLowerCase() == "kick"
      ? kickLeaderboard
      : goalLeaderboard;

  useEffect(() => {
    // dispatch(gameActions.getCategories(token));
    // dispatch(gameActions.getLeaderboard(token, currentCat));
  }, []);

  useEffect(() => {
    //console.log(leaderboard);
  }, [JSON.stringify(leaderboard)]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const LeftHeaderComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Dashboard");
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
        middleC={"Leaderboard"}
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

      <View style={{ paddingLeft: 30, paddingRight: 30 }}>
        <Image
          source={require("../assets/ad1.png")}
          style={{ width: "100%" }}
        />
      </View>

      <View
        style={{
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
          marginTop: 10,
        }}
      >
        <View
          style={{
            marginTop: 20,
            height: 50,
            paddingLeft: 15,
            paddingRight: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                marginTop: 10,
                textAlign: "left",
              }}
            >
              {currentCat.title}
            </Text>
            <Text
              style={{
                color: "grey",
                fontSize: 12,
                marginTop: 2,
                textAlign: "left",
              }}
            >
              {moment(
                currentCat.current_season.timestamp,
                "YYYYMMDD"
              ).fromNow()}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={{ height: 50 }}
            onPress={() => {
              props.navigation.navigate("NextGame", {
                game: {
                  categoryId: categories && currentCat.id,
                  playerId: player && player.id,
                },
              });
            }}
          >
            <Image
              source={require("../assets/start-game.png")}
              style={{ height: "100%", width: 180 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.89}
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 20,
            paddingRight: 30,
          }}
          onPress={() => {
            props.navigation.navigate("PersonalWins", {
              screenDetails: { categories: currentCat },
            });
          }}
        >
          <Text style={{ color: "white" }}>View Personal Wins</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.89}
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 30,
            paddingRight: 30,
          }}
          onPress={() => {
            props.navigation.navigate("Leaderboard", {
              screenDetails: { categories: currentCat },
            });
          }}
        >
          <Text style={{ color: "white" }}>Expand leaderboard</Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            backgroundColor: "#25265A80",
            marginTop: 20,

            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
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
          ) : null}

          {leaderboard &&
            leaderboard.map((entry, idx) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    height: "10%",
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    borderBottomWidth: 2,
                    borderBottomColor: "#25265A00",
                  }}
                  key={idx}
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
                      style={{ color: "white", marginLeft: 8, fontSize: 12 }}
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
                    <Image
                      source={
                        entry.player.profile.display_picture
                          ? { uri: entry.player.profile.display_picture }
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
                      style={{ color: "white", marginLeft: 10, fontSize: 13 }}
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
                    <Text
                      style={{ color: "white", fontSize: 13, marginTop: 5 }}
                    >
                      {entry.duration.slice(0, 8)}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 3,
                      }}
                    >
                      {/* <Image
                      source={require("../assets/coins-settings.png")}
                      style={{ height: 10, width: 15 }}
                      resizeMode="contain"
                    /> */}
                      <Text
                        style={{ color: "white", marginLeft: 4, fontSize: 12 }}
                      >
                        {entry.score} pts
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      </View>
    </ImageBackground>
  );
};

export default LeaderboardLimited;

const styles = StyleSheet.create({
  container: {
    height: "105%",
  },
});
