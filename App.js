import React, { useState, useEffect, cloneElement } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import * as Font from "expo-font";
import { store } from "./store";
import NetInfo from "@react-native-community/netinfo";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  YellowBox,
  Platform,
  Alert,
} from "react-native";
import {
  NavigationContainer,
  useLinking,
  useNavigation,
} from "@react-navigation/native";
import { navigationRef } from "./RootNavigation";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";

import { createStackNavigator, useHeaderHeight } from "@react-navigation/stack";
import SplashScreen from "react-native-splash-screen";
import SplashOptions from "./screens/auth/SplashOptions";
import Login from "./screens/auth/Login";
import Splash from "./screens/Splash";
import Register from "./screens/auth/Register";
import RegisterSuccess from "./screens/Feedback/RegisterSuccess";
import SendReset from "./screens/auth/SendReset";
import Dashboard from "./screens/Dashboard";
import Leaderboard from "./screens/Leaderboard";
import Home from "./screens/Settings/Home";
import UpdateProfile from "./screens/Settings/UpdateProfile";
import BankDetails from "./screens/Settings/BankDetails";
import TandC from "./screens/Settings/TandC";
import HTP from "./screens/Settings/HTP";
import FAQ from "./screens/Settings/FAQ";
import FeedbackScreen from "./screens/Feedback/FeedbackScreen";
import LeaderboardWin from "./screens/Feedback/LeaderboardWin";
import PictorialType from "./screens/GameTypes/PictorialType";
import PictorialPointsWinFeedback from "./screens/Feedback/PictorialPointsWinFeedback";
import TextType from "./screens/GameTypes/TextType";
import TextTypeFeedback from "./screens/Feedback/TextTypeFeedback";
import CombinedType from "./screens/GameTypes/CombinedType";
import { authActions } from "./src/actions/auth.actions";
import LoadGame from "./screens/Interactions/LoadGame";
import NextGame from "./src/helpers/NextGame";
import CHeader from "./screens/auth/CHeader";
import PrivacyPolicy from "./screens/Settings/PrivacyPolicy";
import LeaderboardLimited from "./screens/LeaderboardLimited";
import LockedExplanation from "./screens/LockedExplanation";
import Notifications from "./screens/Notifications";
import PurchaseModal from "./screens/PurchaseModal";
import PurchaseKoin from "./screens/PurchaseKoin";
import PersonalWins from "./screens/PersonalWins";
import { userActions } from "./src/actions/user.actions";
import { gameActions } from "./src/actions/game.actions";
import NetworkAlert from "./screens/Interactions/NetworkAlert";
import messaging, { firebase } from "@react-native-firebase/messaging";
import axios from "axios";
import DeviceInfo from "react-native-device-info";

const App = () => {
  const dispatch = useDispatch();
  const deviceId = DeviceInfo.getUniqueId();
  const token = useSelector((state) =>
    state.authReducer.token ? state.authReducer.token : null
  );
  const isBoardLoading = useSelector((state) => state.gameReducer.lbLoading);
  const [isOnline, setOnlineStatus] = useState(null);
  const [hadDowntime, setHadDowntime] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  // const dispatch = useDispatch();
  // const Stack = createStackNavigator();
  const categories = useSelector((state) => state.gameReducer.categories);
  const ref = React.useRef();
  const Stack = createStackNavigator();
  const GameLoadStack = createStackNavigator();
  var fcmUnsubscribe = null;
  const fadeConfig = ({ current }) => {
    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  };
  useEffect(() => {
    if (!isBoardLoading) {
      SplashScreen.hide();
    } else {
      setTimeout(() => {
        SplashScreen.hide();
      }, 4000);
    }
  }, [isBoardLoading]);
  const registerToken = (pushToken) => {
    axios
      .post(
        "https://kickgameapp.herokuapp.com/api/v1/notifications/device/register/",
        {
          device_id: `${deviceId}`,
          registration_token: `${pushToken}`,
          device_type: `${Platform.OS}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // console.log(res);
      })
      .catch((e) => {
        // console.log(e);
      });
  };

  const confirmDevice = () => {
    return axios
      .get(
        `https://kickgameapp.herokuapp.com/api/v1/notifications/device/confirm/${deviceId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        // console.log(e);
        // console.log("not confirmed", false);
        return e;
      });
  };

  useEffect(() => {
    if (token) {
      // console.log(token !== null);
      // console.log("running once");
      messaging()
        .requestPermission()
        .then((authStatus) => {
          if (
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
          ) {
            messaging()
              .getToken()
              .then((token) => {
                confirmDevice()
                  .then((res) => {
                    // console.log(res);
                    if (res && res.data.is_registered) {
                      return null;
                    } else {
                      registerToken(token);
                    }
                  })
                  .catch((e) => {
                    // console.log(e);
                    return null;
                    // console.log("i  registered a token, device wasn't confirmed");
                    // registerToken(token);
                  });
              });

            messaging().onTokenRefresh((token) => {
              // console.log("Send refreshed token to bello", token);
              // registerToken(token);
            });

            fcmUnsubscribe = messaging().onMessage(async (remoteMessage) => {
              // console.log("A new message just arrived", remoteMessage);
              Alert.alert(
                remoteMessage.notification.title,
                remoteMessage.notification.body
              );
            });

            messaging().onNotificationOpenedApp((remoteMessage) => {
              // console.log(
              //   "Notification caused app to open from background",
              //   remoteMessage
              // );
            });

            messaging()
              .getInitialNotification()
              .then((remoteMessage) => {
                if (remoteMessage) {
                  // console.log(
                  //   "Notification caused app to open from quit state"
                  // );
                }
              });
          }
        })
        .catch((err) => {
          // console.log("Message request permission error", err);
        });
    }
  }, [token]);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnlineStatus(state.isConnected);
    });
    if (isOnline == false) {
      setHadDowntime(true);
      // showMessage({
      //   message: "No Internet Connection",
      //   description: "Change to a faster connection to enjoy using Kick",
      //   type: "danger",
      //   duration: 4000,
      // });
    }

    if (hadDowntime && isOnline) {
      showMessage({
        message: "You're Back!",
        description: "You're connected to the internet now!",
        type: "success",
        duration: 4000,
      });
    }
  }, [isOnline, hadDowntime]);

  useEffect(() => {
    dispatch(authActions.getUserToken());
  }, [token]);

  if (isOnline == false) {
    return <NetworkAlert />;
  } else {
    return (
      <NavigationContainer ref={navigationRef}>
        {token == undefined || token == null ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegisterSuccess"
              component={RegisterSuccess}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                headerTitle: "Register",
                headerStyle: {
                  backgroundColor: "#000000",
                  shadowColor: "#181818",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  color: "#fff",
                },
                headerBackTitle: "Back",
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="SendReset"
              component={SendReset}
              options={{
                headerTitle: "Forgot Password",
                headerStyle: {
                  backgroundColor: "#000000",
                  shadowColor: "#181818",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  color: "#fff",
                },
                headerBackTitle: "Back",
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTintColor: "#fff",
              }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{
                headerShown: false,
                cardStyleInterpolator: fadeConfig,
              }}
            />
            <Stack.Screen
              name="LoadGame"
              component={LoadGame}
              options={{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="CombinedType"
              component={CombinedType}
              options={{ headerShown: false, animationEnabled: false }}
            />
            <Stack.Screen
              name="PictorialType"
              component={PictorialType}
              options={{ headerShown: false, animationEnabled: false }}
            />
            <Stack.Screen
              name="TextType"
              component={TextType}
              options={{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="NextGame"
              component={NextGame}
              options={{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="Settings"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TextTypeFeedback"
              component={TextTypeFeedback}
              options={{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="PictorialPointsWinFeedback"
              component={PictorialPointsWinFeedback}
              options={{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="LeaderboardWin"
              component={LeaderboardWin}
              options={{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
              }}
            />

            <Stack.Screen
              name="Leaderboard"
              component={Leaderboard}
              options={{
                headerShown: false,
                cardStyleInterpolator: fadeConfig,
              }}
            />

            <Stack.Screen
              name="PersonalWins"
              component={PersonalWins}
              options={{
                headerShown: false,
                cardStyleInterpolator: fadeConfig,
              }}
            />

            <Stack.Screen
              name="LeaderboardLimited"
              component={LeaderboardLimited}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="LockedExplanation"
              component={LockedExplanation}
              options={{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
              }}
            />

            <Stack.Screen
              name="Notifications"
              component={Notifications}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="PurchaseModal"
              component={PurchaseModal}
              options={{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
              }}
            />

            <Stack.Screen
              name="PurchaseKoin"
              component={PurchaseKoin}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="FeedbackScreen"
              component={FeedbackScreen}
              options={{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
              }}
            />

            <Stack.Screen
              name="BankDetails"
              component={BankDetails}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="EditProfile"
              component={UpdateProfile}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="TandC"
              component={TandC}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicy}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="FAQ"
              component={FAQ}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="HTP"
              component={HTP}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        )}
        <FlashMessage position="top" />
      </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({});

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;

{
  /* <FeedbackScreen title="Goal!!!!!!" emo="excitement" /> */
}
{
  /* <FeedbackScreen title="You didn't choose a ball"  emo="sadness" /> */
}
{
  /* <FeedbackScreen title="You didn't select an option" emo="sadness" /> */
}
{
  /* <FeedbackScreen title="Let's try to get the next one right." emo="tears" /> */
}
{
  /* <FeedbackScreen title="Oh no!" emo="tears" /> */
}
{
  /* <FeedbackScreen title="Are you sure you want to leave the game?" emo="sadness" /> */
}
{
  /* <FeedbackScreen title="Profile Updated" emo="wink" /> */
}
