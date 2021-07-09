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
import moment from "moment";

const NotificationItem = ({ title, content, timestamp }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);

  return (
    <View
      style={{
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff20",
        paddingBottom:30,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>
        {title}
      </Text>
      <Text style={{ color: "white", marginTop: 10, paddingRight: 80 }}>
        {content}
      </Text>

      <Text style={{ color: "#ffffff90", marginTop: 10, paddingRight: 80 }}>
        {moment(timestamp, "YYYYMMDD").fromNow()}
      </Text>
    </View>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "105%",
  },
});
