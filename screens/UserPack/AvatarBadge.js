import React, { useEffect } from "react";
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
import { gameActions } from "../../src/actions/game.actions";
import { userActions } from "../../src/actions/user.actions";

const AvatarBadge = (props) => {
  const dispatch = useDispatch();
  // const player = useSelector((state) => state.userReducer.player);
  // useEffect(() => {}, [JSON.stringify(player)]);

  useEffect(() => {
  }, []);
  return (
    <>
      <Image
        // source={{uri:player ? player.profile.display_image}}
        source={
          props.dp != null
            ? { uri: props.dp }
            : require("../../assets/dummy_avatar.png")
        }
      resizeMode ="cover"
        style={{
          position: "absolute",
          width: "40%",
          height:"65%",
          marginLeft: 12,
          borderRadius: 50,
        }}
      />
      <Image
        source={props.badge}
        style={{
          position: "relative",
          width: 20,
          height: 20,
          top: -10,
          bottom: 0,
          left: 38,
          right: 0,
        }}
      />
    </>
  );
};

export default AvatarBadge;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
