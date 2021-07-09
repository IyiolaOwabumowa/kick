import React, { useEffect } from "react";
import { createStackNavigator, useHeaderHeight } from "@react-navigation/stack";
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

const CHeader = (props) => {
  const headerHeight = useHeaderHeight();
  const dispatch = useDispatch();
  const player = useSelector((state) => state.userReducer.player);
  useEffect(() => {}, [JSON.stringify(player)]);
  return (
    <>
      <View
        style={{
          height: "8%",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",

          paddingLeft: 10,
          paddingRight: 20,
        }}
      >
        {props.leftC && props.leftC}

        <View>
          <Text style={{ color: "white", fontSize: 20 }}>
            {props.middleC && props.middleC}
          </Text>
        </View>

        {props.rightC && props.rightC}
      </View>
    </>
  );
};

export default CHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    height: "120%",
  },
});
