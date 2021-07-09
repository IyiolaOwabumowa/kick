/**
 * @format
 */
import React, { useEffect } from "react";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import RNPaystack from "react-native-paystack";
import messaging, { firebase } from "@react-native-firebase/messaging";
import Sound from "react-native-sound";
import { PAYSTACK_PUBLIC_KEY } from "react-native-dotenv";

RNPaystack.init({
  publicKey: PAYSTACK_PUBLIC_KEY,
});

export var appSounds = {};

const kickApp = ({ isHeadless }) => {
  useEffect(() => {
    appSounds.boarditem = new Sound(
      "boarditem.mp3",
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log("failed to load the sound", error);
        }
      }
    );
    appSounds.finalscore = new Sound(
      "finalscore.mp3",
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log("failed to load the sound", error);
        }
      }
    );
  }, []);

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {});

  if (isHeadless) {
    return null;
  }
  return <App />;
};

AppRegistry.registerComponent("kick", () => kickApp);
