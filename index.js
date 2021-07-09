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

RNPaystack.init({
  publicKey: "pk_test_0ad30bfa09d62c82b6744e581a2874dc5471b65a",
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

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message is handled in the background! ", remoteMessage);
  });

  if (isHeadless) {
    return null;
  }
  return <App />;
};

AppRegistry.registerComponent("kick", () => kickApp);
