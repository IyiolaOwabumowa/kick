import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Switch,
  Image,
  ImageBackground,
  Platform,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import { userActions } from "../../src/actions/user.actions";
import { authActions } from "../../src/actions/auth.actions";
import CHeader from "../auth/CHeader";
import LeaderboardInline from "../UserPack/LeaderboardInline";
import FastImage from "react-native-fast-image";
import axios from "axios";
import DeviceInfo from "react-native-device-info";
import { showMessage } from "react-native-flash-message";
import { authService } from "../../src/services/auth.services";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = (props) => {
  const dispatch = useDispatch();
  const deviceId = DeviceInfo.getUniqueId();

  const player = useSelector((state) =>
    state.userReducer.player ? state.userReducer.player : null
  );
  const token = useSelector((state) => state.authReducer.token);
  const categories = useSelector((state) => state.gameReducer.categories);
  const leaderboard = useSelector((state) => state.gameReducer.leaderboard);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    axios
      .patch(
        `https://kickgameapp.herokuapp.com/api/v1/settings/player/${player.id}/`,
        {
          accept_notification: !isEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (isEnabled) {
          authService.saveItem("push", "0").then((push) => {});
          showMessage({
            message: "Push Notifications Disabled",
            description: "We won't send you push notifications anymore",
            type: "success",
            duration: 2500,
          });
        } else {
          authService.saveItem("push", "1").then((push) => {});
          showMessage({
            message: "Notifications Enabled",
            description: "We'll keep sending you push notifications",
            type: "success",
            duration: 2500,
          });
        }
      })
      .catch((e) => {
        // console.log("not confirmed", false);
      });
    setIsEnabled((previousState) => !previousState);
  };

  useEffect(() => {
    dispatch(userActions.refreshPlayer(token, player.id));
  }, []);
  useEffect(() => {
    if (player) {
      setIsEnabled(player.settings.accept_notification);
    }
  }, [player]);

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
          source={require("../../assets/back-button-game.png")}
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
      source={require("../../assets/leaderboard-bg.png")}
      style={styles.container}
    >
      <View style={{ marginTop: 30 }}></View>
      <CHeader
        navigation={props.navigation}
        leftC={<LeftHeaderComponent />}
        middleC={"Settings"}
        rightC={<RightHeaderComponent />}
      />
      <View
        style={{
          height: "70%",
          width: "100%",
          backgroundColor: "#25265A",
          marginTop: 100,
          borderRadius: 20,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "10%",
            width: "100%",
            backgroundColor: "#ffffff10",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginBottom: 4,
            padding: 10,
          }}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate("EditProfile");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "25%",
              height: "100%",
            }}
          >
            <FastImage
              source={
                player && player.profile.display_picture != null
                  ? {
                      uri: player.profile.display_picture.split("?")[0],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }
                  : require("../../assets/dummy_avatar.png")
              }
              resizeMode="cover"
              style={{
                width: "35%",
                height: "80%",
                marginLeft: 20,
                borderRadius: 50,
              }}
            />
          </View>
          <Text style={{ color: "white" }}>Profile</Text>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={require("../../assets/arrow-right-settings.png")}
              resizeMode="contain"
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "10%",
            width: "100%",
            backgroundColor: "#ffffff10",

            marginBottom: 4,
            padding: 10,
          }}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate("BankDetails");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "25%",
              height: "100%",
            }}
          >
            <Image
              source={require("../../assets/coins-settings.png")}
              resizeMode="contain"
              style={{ width: 30, height: 40, marginLeft: 20 }}
            />
          </View>
          <Text style={{ color: "white" }}>Bank Account </Text>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={require("../../assets/arrow-right-settings.png")}
              resizeMode="contain"
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "10%",
            width: "100%",
            backgroundColor: "#ffffff10",

            marginBottom: 15,
            padding: 10,
          }}
          activeOpacity={0.8}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "25%" }}
          >
            <Image
              source={require("../../assets/notification-settings.png")}
              resizeMode="contain"
              style={{ width: 30, height: 40, marginLeft: 20 }}
            />
          </View>
          <Text style={{ color: "white" }}>Notifications</Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Switch
              trackColor={{ false: "#000", true: "#00000020" }}
              thumbColor={isEnabled ? "#D4CC1D" : "#fff"}
              ios_backgroundColor="#4C4D7D"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "10%",
            width: "100%",
            backgroundColor: "#ffffff10",

            marginBottom: 4,
            padding: 10,
          }}
          onPress={() => {
            props.navigation.navigate("TandC");
          }}
          activeOpacity={0.8}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "25%" }}
          >
            <Image
              source={require("../../assets/lock-settings.png")}
              resizeMode="contain"
              style={{ width: 30, height: 40, marginLeft: 20 }}
            />
          </View>
          <Text style={{ color: "white" }}>Terms & Conditions</Text>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={require("../../assets/arrow-right-settings.png")}
              resizeMode="contain"
              style={{ width: 40, height: 20, marginRight: 0 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "10%",
            width: "100%",
            backgroundColor: "#ffffff10",
            marginBottom: 4,
            padding: 10,
          }}
          onPress={() => {
            props.navigation.navigate("PrivacyPolicy");
          }}
          activeOpacity={0.8}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "25%" }}
          >
            <Image
              source={require("../../assets/question-settings.png")}
              resizeMode="contain"
              style={{ width: 30, height: 40, marginLeft: 20 }}
            />
          </View>
          <Text style={{ color: "white" }}>Privacy Policy</Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={require("../../assets/arrow-right-settings.png")}
              resizeMode="contain"
              style={{ width: 40, height: 20, marginRight: 0 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            dispatch(gameActions.clearState());
            dispatch(authActions.deleteUserToken());
          }}
          style={{ padding: 40 }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: "110%",
  },
});
