import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../src/actions/auth.actions";
import validateInput from "../../src/utils/validation";

const SendReset = (props) => {
  const dispatch = useDispatch();
  const serverError = useSelector((state) => state.authReducer.resetError);
  const resetMessage = useSelector((state) => state.authReducer.resetMessage);

  const loading = useSelector((state) => state.authReducer.sendingReq);
  const [email, setEmail] = useState("");
  const [emailE, setEmailE] = useState(null);
  const [error, setError] = useState(null);

  const sendLink = (email) => {
    dispatch(authActions.sendResetLink(email));
  };

  useEffect(() => {
    //console.log(serverError);
    setError(serverError);
  }, [serverError, resetMessage]);

  return (
    <ImageBackground
      source={require("../../assets/bg-register.png")}
      resizeMode="cover"
      style={styles.container}
    >
      {resetMessage && (
        <>
          <Text style={{ color: "white", marginTop: 5, padding: 20 }}>
            {resetMessage}
          </Text>
        </>
      )}
      {serverError && (
        <>
          <Text style={{ color: "white", marginTop: 5, padding: 20 }}>
            {serverError}
          </Text>
        </>
      )}
      <View style={{ marginTop: 50 }}></View>

      <View
        style={{
          borderBottomWidth: 1,
          width: "80%",
          height: 35,
          borderColor: "white",
        }}
      >
        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#fff"
          color="white"
          autoCapitalize="none"
          returnKeyType={ 'done' }
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
      </View>
      <View style={{ marginTop: 10 }}></View>
      {loading ? (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator color="white" size="large" />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ flexDirection: "row" }}
          onPress={() => {
            sendLink(email);
          }}
        >
          <Image
            source={require("../../assets/reset-button.png")}
            resizeMode="contain"
            style={{ width: "60%" }}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity activeOpacity={0.8}>
        <Text
          style={{
            color: "#cdcdcd",
            marginTop: 80,
            fontSize: 12,
            textAlign: "center",
          }}
        >
          By filling in your email, we'll send you a {"\n"}
          <Text style={{ fontWeight: "700" }}>
            reset link to recover your password
          </Text>
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default SendReset;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
