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
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../src/actions/game.actions";
import { userActions } from "../src/actions/user.actions";
import CHeader from "./auth/CHeader";
import LeaderboardInline from "./UserPack/LeaderboardInline";
import AwardsInline from "./UserPack/AwardsInline";
import FastImage from "react-native-fast-image";
import DeviceInfo from "react-native-device-info";


const PersonalWins = (props) => {
  const dispatch = useDispatch();
  const hasNotch = DeviceInfo.hasNotch();

  const token = useSelector((state) => state.authReducer.token);
  const personalWins = useSelector((state) => state.gameReducer.personalWins);

  const player = useSelector((state) =>
    state.userReducer.player ? state.userReducer.player : null
  );

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
      source={require("../assets/bg.png")}
      style={styles.container}
      blurRadius={20}
    >
      <View style={{ marginTop: hasNotch ? 30 : 15 }}></View>
      <CHeader
        leftC={<LeftHeaderComponent />}
        middleC={"My Personal Wins"}
        rightC={<RightHeaderComponent />}
      />
      {personalWins && personalWins.length == 0 ? (
        <View
          style={{
            padding: 20,

            flex: 0.8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>
            Start playing to see your personal wins
          </Text>
        </View>
      ) : (
        <View
          style={{
            // marginLeft: 15,
            // marginRight: 15,

            height: "85%",
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
            {personalWins &&
              personalWins.map((entry, idx) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      height: 50,
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
                        borderTopLeftRadius: idx == 0 ? 30 : 0,
                        alignItems: "center",
                        backgroundColor: "#ffffff12",
                        height: "100%",
                        width: "30%",
                      }}
                    >
                      {/* <Image
                        source={require("../assets/gold-badge.png")}
                        style={{ height: 15, width: 15 }}
                      /> */}

                      <Text
                        style={{ color: "white", marginLeft: 2, fontSize: 13 }}
                      >
                        {/* {entry.prize == 0 ? "--" : entry.prize} */}
                        {entry.season.title.length > 13
                          ? entry.season.title.slice(0, 13)
                          : entry.season.title}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        height: "100%",
                        width: "45%",
                      }}
                    >
                      <FastImage
                        source={
                          player && player.profile.display_picture != null
                            ? {
                                uri: player.profile.display_picture.split(
                                  "?"
                                )[0],
                                priority: FastImage.priority.high,
                                cache: FastImage.cacheControl.immutable,
                              }
                            : require("../assets/dummy_avatar.png")
                        }
                        style={{
                          height: 25,
                          width: 25,
                          borderRadius: 30,
                          marginLeft: 20,
                        }}
                      />
                      <Text
                        style={{ color: "white", marginLeft: 10, fontSize: 13 }}
                      >
                        {player && player.username}
                      </Text>
                    </View>

                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",

                        height: "100%",
                        width: "20%",
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
                        style={{ width: 15, height:20}}
                        resizeMode="contain"
                      /> */}
                        <Text
                          style={{
                            color: "white",
                            marginLeft: 4,
                            fontSize: 12,
                          }}
                        >
                          {entry.score} pts
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      )}
    </ImageBackground>
  );
};

export default PersonalWins;

const styles = StyleSheet.create({
  container: {
    height: "130%",
  },
});
