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
import NotificationItem from "./NotificationItem";
import LeaderboardInline from "./UserPack/LeaderboardInline";
import AwardsInline from "./UserPack/AwardsInline";
import axios from "axios";

const Notifications = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const leaderboard = useSelector((state) =>
    state.gameReducer.leaderboard ? state.gameReducer.leaderboard : null
  );
  const player = useSelector((state) =>
    state.userReducer.player ? state.userReducer.player : null
  );
  const [notifications, setNotifications] = useState([]);

  const LeftHeaderComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack(null);
        }}
        style={{
          width: "10%",
          height: "55%",
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

  useEffect(() => {
    axios
      .get(`https://kickgameapp.herokuapp.com/api/v1/notifications/player/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setNotifications(res.data.results);
      })
      .catch((e) => {
        console.log(e);
        // console.log("not confirmed", false);
      });
  }, []);
  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.container}
      blurRadius={20}
    >
      <View style={{ margin: 15 }}></View>
      <CHeader
        leftC={<LeftHeaderComponent />}
        middleC={"Notifications"}
        rightC={<RightHeaderComponent />}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 300 }}
        showsVerticalScrollIndicator={true}
        style={{
          padding: 20,
          marginTop: 10,
        }}
      >
        {notifications &&
          notifications.map((item, idx) => {
            return (
              <NotificationItem
                key={idx}
                title={item.title}
                content={item.content}
                timestamp={item.timestamp}
              />
            );
          })}

        {notifications && notifications.length == 0 ? (
          <Text style={{ color: "#ffffff", fontSize: 14 }}>
            Nothing to see here :)
          </Text>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    height: "105%",
  },
});
