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
} from "react-native";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import { userActions } from "../../src/actions/user.actions";

const AwardsInline = (props) => {
  const dispatch = useDispatch();
  const [badge, setBadge] = useState(null);
  const token = useSelector((state) => state.authReducer.token);
  const leaderboard = useSelector((state) => state.gameReducer.leaderboard);
  const player = useSelector((state) => state.userReducer.player);

  useEffect(() => {
    // dispatch(gameActions.getLeaderboard(token, props.category));
  }, []);

  useEffect(() => {}, [JSON.stringify(leaderboard)]);

  useEffect(() => {
    if (props.award == "gold") {
      setBadge(require("../../assets/gold-badge.png"));
    } else if (props.award == "silver") {
      setBadge(require("../../assets/silver-badge.png"));
    } else {
      setBadge(require("../../assets/bronze-badge.png"));
    }
  }, []);

  return (
    <>
      <View style={{ height: 130 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <FastImage
            source={
              props.dp != null
                ? {
                    uri: props.dp.split("?")[0],
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                  }
                : require("../../assets/dummy_avatar.png")
            }
            style={{
              width: 100,
              height: 100,
              marginRight: 15,
              marginLeft: 15,
              borderRadius: 50,
            }}
          />
          <Image
            source={badge}
            style={{ width: 40, height: 40, marginLeft: -50, top: 60 }}
          />
        </View>
        <View>
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "700" }}
          >
            {props.playerName}
          </Text>
        </View>
      </View>
    </>
  );
};

export default AwardsInline;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
