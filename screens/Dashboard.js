import { useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import moment from "moment";
import NativeAdView from "react-native-admob-native-ads";
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  getTrackingStatus,
  requestTrackingPermission,
} from "react-native-tracking-transparency";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import DeviceInfo from "react-native-device-info";
import useDeepCompareEffect, {
  useDeepCompareEffectNoCheck,
} from "use-deep-compare-effect";

import {
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Text,
  View,
  Easing,
  Image,
  ImageBackground,
  Platform,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Animated,
  Button,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../src/actions/game.actions";
import { userActions } from "../src/actions/user.actions";
import CHeader from "./auth/CHeader";
import LeaderboardInline from "./UserPack/LeaderboardInline";
import { collectFormValues } from "validate.js";
import Splash from "./Splash";
import { AdView } from "./AdView";

const Dashboard = (props) => {
  const dispatch = useDispatch();
  const nativeAdViewRef = useRef();
  const height = Dimensions.get("screen").height;
  const player = useSelector((state) =>
    state.userReducer.player ? state.userReducer.player : null
  );
  const isBoardLoading = useSelector((state) => state.gameReducer.lbLoading);
  const lbLoading = useSelector((state) => state.gameReducer.lbLoading);

  const kickLoading = useSelector((state) => state.gameReducer.kickLoading);

  const goalLoading = useSelector((state) => state.gameReducer.goalLoading);
  const bundles = useSelector((state) => state.gameReducer.bundles);
  const token = useSelector((state) => state.authReducer.token);
  const categories = useSelector((state) => state.gameReducer.categories);
  const loading = useSelector((state) => state.gameReducer.loading);
  const kickLeaderboard = useSelector(
    (state) => state.gameReducer.kickLeaderboard
  );
  const goalLeaderboard = useSelector(
    (state) => state.gameReducer.goalLeaderboard
  );
  const [bundlesList, setbundlesList] = useState([]);
  const isFocused = useIsFocused();
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinValue2 = useRef(new Animated.Value(0)).current;
  const arrrowAnimation = useState(new Animated.Value(0))[0];
  const arrrowAnimation2 = useState(new Animated.Value(5))[0];
  const [loader, setLoader] = useState(true);
  const [locked, setLocked] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const [test, settest] = useState("");
  const width = Dimensions.get("screen").width;
  const hasNotch = DeviceInfo.hasNotch();

  useEffect(() => {
    dispatch(userActions.getPlayer());
    dispatch(gameActions.getCategories(token));
    dispatch(gameActions.clearPayment());
    dispatch(gameActions.getWins(token));
    dispatch(gameActions.getKoinBundles(token));
    async () => {
      const trackingStatus = await requestTrackingPermission();
      if (trackingStatus === "authorized" || trackingStatus === "unavailable") {
        // enable tracking features
      }
    };
  }, []);

  const reload = (cat) => {
    dispatch(gameActions.getWins(token));

    if (cat == "kick") {
      dispatch(
        gameActions.getLeaderboard(token, categories && categories[0], cat)
      );
      showMessage({
        message: "Leaderboard",
        description: "The kick leaderboard has been refreshed!",
        type: "success",
        backgroundColor: "purple",
        duration: 4000,
      });
    } else {
      dispatch(
        gameActions.getLeaderboard(token, categories && categories[1], cat)
      );
      showMessage({
        message: "Leaderboard",
        description: "The goal leaderboard has been refreshed!",
        type: "success",
        backgroundColor: "purple",
        duration: 4000,
      });
    }
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrrowAnimation, {
          toValue: 10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(arrrowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrrowAnimation2, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(arrrowAnimation2, {
          toValue: 10,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useDeepCompareEffectNoCheck(() => {
    generateBundles();
  }, [bundles]);

  useDeepCompareEffectNoCheck(() => {
    if (categories != null) {
      dispatch(gameActions.getLeaderboard(token, categories && categories[0]));
      dispatch(gameActions.getLeaderboard(token, categories && categories[1]));
    
    }
  }, [categories]);

  const generateBundles = () => {
    const tempList = [];
    bundles &&
      bundles.map((bundle) => {
        tempList.push({
          label: `${bundle.coin_count} koins for ${bundle.price}${bundle.currency}`,
          value: bundle.id,
          price: bundle.price,
        });
      });
    setbundlesList(tempList);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const spin2 = spinValue2.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const RightHeaderComponent = () => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("PurchaseKoin", {
              koinDetails: JSON.stringify(bundlesList),
            });
          }}
          style={{
            flexDirection: "row",
            backgroundColor: "#ffffff20",
            justifyContent: "center",
            alignItems: "center",

            height: 30,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,

            marginRight: 10,
          }}
        >
          <Image
            source={require("../assets/coins-settings.png")}
            resizeMode="contain"
            style={{ width: 40, height: "55%" }}
          />
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 12,
              fontWeight: "700",
              marginRight: 10,
            }}
          >
            {categories && categories[0].coin_balance}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Notifications");
          }}
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
          }}
        >
          <Image
            source={require("../assets/notification-icon.png")}
            resizeMode="contain"
            style={{ width: "90%", height: "90%" }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Settings");
          }}
          style={{
            width: 30,
            height: 30,
          }}
        >
          <Image
            source={require("../assets/settings.png")}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const LeftHeaderComponent = () => {
    return (
      <>
        <TouchableOpacity
          style={{
            width: 55,
            height: 55,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            props.navigation.navigate("EditProfile");
          }}
        >
          {/* <Image
            source={
              player && player.profile.display_picture != null
                ? { uri: player.profile.display_picture }
                : require("../assets/dummy_avatar.png")
            }
            // onLoadStart={() => {
            //   setSpinner(true);
            // }}
            onError={(e) => {
              //dispatch(userActions.refreshPlayer(token, player.id));
            }}
            style={{ height: "60%", width: "60%", borderRadius: 40 }}
          /> */}
        </TouchableOpacity>
      </>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.container}
      blurRadius={15}
    >
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={{ marginTop: hasNotch ? 30 : 15 }}></View>
      <CHeader
        navigation={props.navigation}
        leftC={<LeftHeaderComponent />}
        rightC={<RightHeaderComponent />}
      />
      <View style={{ paddingLeft: 30, paddingRight: 30 }}>
        {/* <Image
          source={require("../assets/ad1.png")}
          style={{ width: "100%" }}
        /> */}
        {/* real ad unit id ca-app-pub-3278633831142834/4870980626 */}
        {/* <NativeAdView adUnitID="ca-app-pub-3940256099942544/2247696110">
          <View style={{ height: 100, width: 200 }}></View>
        </NativeAdView>
         */}

        {/* <AdView /> */}
      </View>
      <View
        style={{
          flex: 1,
          marginTop: 5,
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <View
          style={{
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
              {categories && categories[0].title}
            </Text>
            {categories && (
              <Text
                style={{
                  color: "grey",
                  fontSize: 12,
                  marginTop: 2,
                  textAlign: "left",
                }}
              >
                {moment(
                  categories && categories[0].current_season.timestamp,
                  "YYYYMMDD"
                ).fromNow()}
              </Text>
            )}
          </View>

          <View
            style={{
              flex: 1,
              height: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Animated.loop(
                  Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                  }),
                  {
                    iterations: 4,
                  }
                ).start(() => {
                  spinValue.setValue(0);
                  reload("kick");
                });
              }}
            >
              <Animated.Image
                source={require("../assets/refresh.png")}
                style={{
                  height: "50%",
                  width: 50,
                  transform: [{ rotate: spin }],
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={{ height: 50 }}
              onPress={() => {
                if (categories && categories[0].coin_balance == 0) {
                  Alert.alert(
                    "Insufficient Koins",
                    "You do not have sufficient koins to play this game",
                    [
                      {
                        text: "Buy Koins",
                        onPress: () => {
                          props.navigation.navigate("PurchaseKoin", {
                            koinDetails: {
                              koins: categories && categories[0].coin_balance,
                            },
                          });
                        },
                      },
                      {
                        text: "Cancel",
                        onPress: () => console.log("Go back"),
                        style: "cancel",
                      },
                    ]
                  );
                } else {
                  props.navigation.navigate("NextGame", {
                    game: {
                      categoryId: categories && categories[0].id,
                      seasonId: categories && categories[0].current_season.id,
                      playerId: player && player.id,
                    },
                  });
                }
              }}
            >
              <Image
                source={require("../assets/start-game.png")}
                style={{ height: "100%", width: 180 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 0.45,
            backgroundColor: "#25265A80",
            marginTop: 20,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          {kickLeaderboard && kickLeaderboard.length == 0 ? (
            <View
              style={{
                padding: 20,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>
                Start playing to appear on the leaderboard
              </Text>
            </View>
          ) : null}
          {kickLoading ? (
            <View
              style={{
                padding: 20,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator color="white" size="large" />
            </View>
          ) : (
            <>
              {kickLeaderboard &&
                kickLeaderboard.slice(0, 4).map((entry, idx) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        height: "25%",
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
                          style={[
                            styles.boardText,
                            { color: "white", marginLeft: 8 },
                          ]}
                        >
                          {entry.prize == 0
                            ? "--"
                            : numberWithCommas(entry.prize)}
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
                                  uri: entry.player.profile.display_picture.split(
                                    "?"
                                  )[0],
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
                            { color: "white", marginLeft: 10 },
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
                          marginTop: 3,
                        }}
                      >
                        <Text style={[styles.boardText, { color: "white" }]}>
                          {entry.duration.slice(0, 8)}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          <Text
                            style={[
                              styles.boardText,
                              { color: "white", marginTop: 4 },
                            ]}
                          >
                            {entry.score} pts
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
            </>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={{ height: 50, flexDirection: "row", justifyContent: "center" }}
          onPress={() => {
            props.navigation.navigate("Leaderboard", {
              screenDetails: { categories: categories[0] },
            });
          }}
        >
          <Animated.Image
            source={require("../assets/arrow-down.png")}
            style={{
              height: 30,
              width: 30,
              marginTop: 10,
              transform: [{ translateY: arrrowAnimation2 }],
            }}
          />
        </TouchableOpacity>

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
              {categories && categories[1].title}
            </Text>
            {categories && (
              <Text
                style={{
                  color: "grey",
                  fontSize: 12,
                  marginTop: 2,
                  textAlign: "left",
                }}
              >
                {categories && categories[1].current_season === null
                  ? ""
                  : moment(
                      categories && categories[1].current_season.timestamp,
                      "YYYYMMDD"
                    ).fromNow()}
              </Text>
            )}
          </View>
          <View
            style={{
              flex: 1,
              height: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Animated.loop(
                  Animated.timing(spinValue2, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                  }),
                  {
                    iterations: 4,
                  }
                ).start(() => {
                  spinValue2.setValue(0);
                  reload("goal");
                });
              }}
            >
              <Animated.Image
                source={require("../assets/refresh.png")}
                style={{
                  height: "50%",
                  width: 50,
                  transform: [{ rotate: spin2 }],
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{ height: 50 }}
              onPress={() => {
                if (categories && categories[1].coin_balance == 0) {
                  Alert.alert(
                    "Insufficient Koins",
                    "You do not have sufficient koins to play this game",
                    [
                      {
                        text: "Buy Koins",
                        onPress: () => {
                          props.navigation.navigate("PurchaseKoin", {
                            koinDetails: {
                              koins: categories && categories[1].coin_balance,
                            },
                          });
                        },
                      },
                      {
                        text: "Cancel",
                        onPress: () => console.log("Go back"),
                        style: "cancel",
                      },
                    ]
                  );
                } else {
                  props.navigation.navigate("NextGame", {
                    game: {
                      categoryId: categories && categories[1].id,
                      seasonId: categories && categories[1].current_season?.id,
                      playerId: player && player.id,
                    },
                  });
                }
              }}
            >
              <Image
                source={require("../assets/start-game.png")}
                style={{ height: "100%", width: 180 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 0.45,
            backgroundColor: "#25265A80",
            marginTop: 20,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          {categories && categories[1].current_season === null ? (
            <TouchableOpacity
              activeOpacity={0.89}
              onPress={() => {
                props.navigation.navigate("LockedExplanation");
              }}
              style={{ alignItems: "center" }}
            >
              <Image
                source={require("../assets/locked-model.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                }}
              />
              <Text
                style={{
                  position: "absolute",
                  marginTop: "30%",
                  color: "white",
                }}
              >
                This category resumes soon
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {goalLeaderboard && goalLeaderboard.length == 0 ? (
                <View
                  style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white" }}>
                    Start playing to appear on the leaderboard
                  </Text>
                </View>
              ) : null}
              {goalLoading ? (
                <View
                  style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator color="white" size="large" />
                </View>
              ) : (
                <>
                  {goalLeaderboard &&
                    goalLeaderboard.slice(0, 4).map((entry, idx) => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            height: "25%",
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
                              style={[
                                styles.boardText,
                                {
                                  color: "white",
                                  marginLeft: 8,
                                },
                              ]}
                            >
                              {entry.prize == 0
                                ? "--"
                                : numberWithCommas(entry.prize)}
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
                                      uri: entry.player.profile.display_picture.split(
                                        "?"
                                      )[0],
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
                              marginTop: 3,
                            }}
                          >
                            <Text
                              style={[styles.boardText, { color: "white" }]}
                            >
                              {entry.duration.slice(0, 8)}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
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
                        </View>
                      );
                    })}
                </>
              )}
            </>
          )}
        </View>
        <TouchableOpacity
          style={{ flexDirection: "row", justifyContent: "center" }}
          activeOpacity={0.89}
          onPress={() => {
            if (categories && categories[1].current_season === null) {
              props.navigation.navigate("LockedExplanation");
            } else {
              props.navigation.navigate("Leaderboard", {
                screenDetails: { categories: categories[1] },
              });
            }
          }}
        >
          <Animated.Image
            source={require("../assets/arrow-down.png")}
            style={{
              height: 30,
              width: 30,
              marginTop: 10,
              transform: [{ translateY: arrrowAnimation }],
            }}
          />
        </TouchableOpacity>

        {/* 
        <TouchableOpacity
          style={{
            width: "100%",
            position: "absolute",
            bottom: 0,
          }}
          activeOpacity={0.8}
          onPress={() => {
            leaderboard.length < 3
              ? console.log("null")
              : props.navigation.navigate("Leaderboard");
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 30 }}>
            <Text style={{ color: "white", fontSize: 20, textAlign: "left" }}>
              Leaderboard
            </Text>
            <Image
              source={require("../assets/leaderboard-expand.png")}
              resizeMode="contain"
              style={{ height: 25 }}
            />
          </View>

          <View
            style={{
              backgroundColor: "#25265A",
              width: "100%",
              height: height / 3,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              padding: 20,
            }}
          >
            {leaderboard &&
              leaderboard.length >= 1 &&
              leaderboard.slice(0, 3).map((item, idx) => {
                const me =
                  item.gameplay.player &&
                  item.gameplay.player.username == player.username;

                if (me) {
                  status = "found";
                }
                return (
                  <React.Fragment key={item.gameplay.id}>
                    <View
                      style={
                        me
                          ? {
                              height: "25%",
                              // paddingTop: 15,
                              // paddingBottom: 15,
                              backgroundColor: "#ffffff20",
                              borderRadius: 5,
                              justifyContent: "center",
                            }
                          : {
                              height: "25%",
                              // paddingTop: 15,
                              // paddingBottom: 15,
                              borderRadius: 5,
                              justifyContent: "center",
                            }
                      }
                    >
                      <View
                        style={{
                          height: "90%",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <LeaderboardInline
                          playerName={item.gameplay.player.username}
                          started={item.started_at}
                          ended={item.ended_at}
                          position={idx}
                          points={item.points}
                          dp={item.gameplay.player.profile.display_picture}
                        />
                      </View>
                    </View>
                  </React.Fragment>
                );
              })}
            {leaderboard &&
              leaderboard.length >= 1 &&
              leaderboard.map((item, idx) => {
                const me = item.gameplay.player.username == player.username;
                if (me) {
                  started = item.started_at;
                  ended = item.ended_at;
                  points = item.points;
                  position = idx;
                  dp = item.gameplay.player.profile.display_picture;
                }
              })}

            {status === "not found" ? (
              <>
                <View
                  style={{
                    height: "25%",
                    // paddingTop: 15,
                    // paddingBottom: 15,
                    backgroundColor: "#ffffff20",
                    borderRadius: 5,
                    justifyContent: "center",
                  }}
                >
                  <LeaderboardInline
                    playerName={player && player.username}
                    started={started}
                    ended={ended}
                    position={position}
                    points={points}
                    dp={dp}
                  />
                </View>
              </>
            ) : null}
          </View>
        </TouchableOpacity>
      */}
      </View>
    </ImageBackground>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "120%",
  },

  boardText: {
    fontSize: Dimensions.get("screen").height * 0.015,
  },
});
