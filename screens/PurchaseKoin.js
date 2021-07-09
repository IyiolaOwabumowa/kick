import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import FeedbackScreen from "./Feedback/FeedbackScreen";
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
  useWindowDimensions,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { gameActions } from "../src/actions/game.actions";
import CHeader from "./auth/CHeader";
import useDeepCompareEffect, {
  useDeepCompareEffectNoCheck,
} from "use-deep-compare-effect";

const PurchaseKoin = (props) => {
  const contentWidth = useWindowDimensions().width;
  const bundlesList = JSON.parse(props.route.params.koinDetails);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const email = useSelector((state) => state.userReducer.player.email);

  const payment = useSelector((state) =>
    state.gameReducer.payment ? state.gameReducer.payment : null
  );
  const loading = useSelector((state) => state.gameReducer.koinsLoading);

  const errorMessage = useSelector((state) => state.gameReducer.error);

  const [amount, setAmount] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [expiryMonth, setExpiryMonth] = useState(null);
  const [expiryYear, setExpiryYear] = useState(null);
  const [cvv, setCvv] = useState(null);
  const [vendor, setVendor] = useState("PAYSTACK");
  const [bundle, setBundle] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [error, setError] = useState(null);

  const buyKoins = () => {
    setError(null);
    // console.log(accountName, cardNumber, cvv, amount, vendor, bundle, expiry);
    if (
      amount == null ||
      cardNumber == null ||
      cvv == null ||
      bundle == null ||
      expiryMonth == null ||
      expiryYear == null
    ) {
      setError("Please recheck and fill in the details below ");
    } else {
      dispatch(
        gameActions.buyKoins(
          token,
          cardNumber,
          cvv,
          amount,
          vendor,
          bundle,
          expiryMonth,
          expiryYear,
          email
        )
      );
    }
  };

  const LeftHeaderComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Dashboard");
        }}
        style={{
          width: "10%",
          height: "55%",
        }}
      >
        <Image
          source={require("../assets/back-button-game.png")}
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

  useDeepCompareEffectNoCheck(() => {
    if (payment) {
      dispatch(gameActions.getCategories(token));
    }
  }, [payment]);

  if (payment) {
    return (
      <FeedbackScreen
        navigation={props.navigation}
        emo="excitement"
        title={`You've successfully purchased ${payment.bundle.coin_count} koins`}
      />
    );
  }

  return (
    <ImageBackground
      source={require("../assets/settings-bg2.png")}
      resizeMode="cover"
      style={styles.container}
      blurRadius={20}
    >
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{ flex: 1, alignItems: "center" }}
        scrollEnabled={false}
        extraScrollHeight={70}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ margin: 15 }}></View>
        <CHeader
          leftC={<LeftHeaderComponent />}
          middleC="Buy Koins"
          rightC={<RightHeaderComponent />}
        />

        {errorMessage && (
          <View
            style={{
              backgroundColor: "#ffffff08",
              marginBottom: 20,
              marginTop: 20,
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
              {errorMessage}
            </Text>
          </View>
        )}
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

        <Text
          style={{
            color: "white",
            fontSize: 14,
            textAlign: "center",

            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          All details are securely encrypted by PayStack. {"\n"}We will not
          store any of your banking information.
        </Text>
        <View
          style={{
            width: "82%",
            marginBottom: 0,
            marginTop: 30,
          }}
        >
          <DropDownPicker
            items={bundlesList && bundlesList}
            placeholder="Select a koin package"
            defaultIndex={0}
            style={{ backgroundColor: "#ffffff20", borderColor: "#ffffff00" }}
            dropDownStyle={{
              backgroundColor: "#ffffff20",
              borderColor: "#ffffff00",
              position: "absolute",
            }}
            itemStyle={{ alignItems: "flex-end" }}
            containerStyle={{ height: 40 }}
            activeItemStyle={{ color: "white" }}
            labelStyle={{ color: "#fff" }}
            placeholderStyle={{ color: "#fff" }}
            onChangeItem={(item) => {
              setAmount(item.price);
              setBundle(item.value);
            }}
          />
        </View>
        <View style={{ alignItems: "center", width: "100%", zIndex: -5 }}>
          <View
            style={{
              borderBottomWidth: 1,
              width: "80%",
              height: 40,
              borderColor: "white",
              marginTop: 40,
            }}
          >
            <TextInput
              placeholder="Card Number"
              placeholderTextColor="#fff"
              keyboardType="number-pad"
              maxLength={16}
              returnKeyType={"done"}
              autoCapitalize="none"
              color="white"
              value={cardNumber}
              onChangeText={(text) => {
                setCardNumber(text);
              }}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              width: "80%",
              height: 40,
              marginTop: 40,
              borderColor: "white",
            }}
          >
            <TextInput
              placeholder="CVV"
              placeholderTextColor="#fff"
              color="white"
              returnKeyType={"done"}
              keyboardType="number-pad"
              maxLength={3}
              autoCapitalize="none"
              value={cvv}
              onChangeText={(text) => {
                setCvv(text);
              }}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              width: "80%",
              height: 40,
              marginTop: 40,
              borderColor: "white",
            }}
          >
            <TextInput
              placeholder="Expiry Month"
              placeholderTextColor="#fff"
              color="white"
              returnKeyType={"done"}
              keyboardType="number-pad"
              maxLength={2}
              autoCapitalize="none"
              value={expiryMonth}
              onChangeText={(text) => {
                setExpiryMonth(text);
              }}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              width: "80%",
              height: 40,
              marginTop: 40,
              borderColor: "white",
            }}
          >
            <TextInput
              placeholder="Expiry Year"
              placeholderTextColor="#fff"
              color="white"
              returnKeyType={"done"}
              keyboardType="phone-pad"
              maxLength={2}
              autoCapitalize="none"
              value={expiryYear}
              onChangeText={(text) => {
                setExpiryYear(text);
              }}
            />
          </View>
          {loading ? (
            <View style={{ marginTop: 40 }}>
              <ActivityIndicator color="white" size="large" />
            </View>
          ) : (
            <View style={{ marginTop: 40 }}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{ height: 50 }}
                onPress={() => {
                  Keyboard.dismiss();
                  buyKoins();
                }}
              >
                <Image
                  source={require("../assets/buy.png")}
                  style={{ height: "140%", width: 250 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default PurchaseKoin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "150%",
  },
});
