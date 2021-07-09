import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import { userActions } from "../../src/actions/user.actions";
import Banks from "../../src/utils/bank";
import CHeader from "../auth/CHeader";
import LeaderboardInline from "../UserPack/LeaderboardInline";
import FeedbackScreen from "../Feedback/FeedbackScreen";

const BankDetails = (props) => {
  const dispatch = useDispatch();
  const player = useSelector((state) =>
    state.userReducer.player ? state.userReducer.player : null
  );
  const token = useSelector((state) => state.authReducer.token);
  const categories = useSelector((state) => state.gameReducer.categories);
  const bankRes = useSelector((state) => state.gameReducer.bankRes);
  const loading = useSelector((state) => state.gameReducer.loading);

  const leaderboard = useSelector((state) => state.gameReducer.leaderboard);
  const [bankName, setBankName] = useState(null);
  const [bankCode, setBankCode] = useState(null);
  const [banks, setBanks] = useState([]);
  const [accountNumber, setAccountNumber] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (accountNumber == null || bankName == null) {
      setError("Please fill in your details");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } else {
      dispatch(
        gameActions.registerBank(token, bankName, accountNumber, bankCode)
      );
    }
  };

  useEffect(() => {
    const tempList = [];
    Banks.map((bank) => {
      tempList.push(bank);
    });
    setBanks(tempList);
  }, []);

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

  if (bankRes) {
    return (
      <FeedbackScreen
        navigation={props.navigation}
        emo="excitement"
        title={`You've successfully updated your bank information`}
      />
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/settings-bg.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={{ marginTop: 25 }}></View>
      <CHeader
        leftC={<LeftHeaderComponent />}
        middleC={"Bank Details"}
        rightC={<RightHeaderComponent />}
      />
      <View style={{ flex: 1, marginTop: 60, alignItems: "center" }}>
        {/* <Text
          style={{
            color: "white",
            fontSize: 14,
            textAlign: "center",
            marginBottom: 30,
            lineHeight: 20,
          }}
        >
          Where to send your prize money
        </Text> */}

        {error && (
          <View
            style={{
              backgroundColor: "#ffffff08",
              marginBottom: 20,

              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                textAlign: "center",

                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 5,
                paddingBottom: 5,
              }}
            >
              {error}
            </Text>
          </View>
        )}
        <View style={{ marginTop: 25 }}></View>
        <View style={{ alignItems: "center", width: "100%", zIndex: -5 }}>
          <View
            style={{
              borderBottomWidth: 1,
              width: "90%",
              height: 30,
              borderColor: "white",
            }}
          >
            <TextInput
              placeholder="Enter your account number"
              placeholderTextColor="#fff"
              color="white"
              keyboardType="phone-pad"
              autoCapitalize="none"
              maxLength={11}
              value={accountNumber}
              onChangeText={(text) => {
                setAccountNumber(text);
              }}
            />
          </View>
        </View>

        <View
          style={{
            width: "90%",
            marginTop: 25,
            marginBottom: 35,
          }}
        >
          <DropDownPicker
            items={banks}
            placeholder="Select your bank"
            defaultIndex={0}
            style={{ backgroundColor: "#ffffff50", borderColor: "#ffffff00" }}
            dropDownStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#ffffff00",
            }}
            itemStyle={{ alignItems: "flex-end" }}
            containerStyle={{ height: 40 }}
            activeItemStyle={{ color: "white" }}
            labelStyle={{ color: "#000" }}
            placeholderStyle={{ color: "#fff" }}
            onChangeItem={(item) => {
              setBankName(item.label);
              setBankCode(item.value);
            }}
          />
        </View>

        <View style={{ alignItems: "center", width: "100%", zIndex: -5 }}>
          {loading ? (
            <View style={{ marginTop: 10 }}>
              <ActivityIndicator color="white" size="large" />
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
              onPress={() => {
                handleSubmit();
              }}
            >
              <Image
                source={require("../../assets/update-button.png")}
                resizeMode="contain"
                style={{ width: "100%" }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default BankDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,

    height: "130%",
  },
});
