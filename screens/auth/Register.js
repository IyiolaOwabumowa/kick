import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  Keyboard,
  ImageBackground,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../src/actions/auth.actions";
import PasswordsMatch from "../../src/utils/PasswordsMatch";
import validateInput from "../../src/utils/validation";

const Register = (props) => {
  const dispatch = useDispatch();
  const registered = useSelector((state) => state.authReducer.registered);
  const loading = useSelector((state) => state.authReducer.registering);

  const serverError = useSelector((state) => state.authReducer.errorMessage);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordE, setPasswordE] = useState("");
  const [passwordME, setPasswordME] = useState("");
  const [emailE, setEmailE] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (registered) {
      props.navigation.navigate("RegisterSuccess");
    }

    return () => {
      dispatch(authActions.resetRegistered());
    };
  }, [registered]);
  useEffect(() => {
    if (serverError) {
      setError(serverError);
    }
  }, [serverError]);

  const registerUser = (username, email, password, confirmPassword) => {
    Keyboard.dismiss();
    setPasswordE(
      validateInput({
        type: "password",
        value: password,
      })
    );
    setEmailE(
      validateInput({
        type: "email",
        value: email,
      })
    );
    setPasswordME(PasswordsMatch(password, confirmPassword));
    if (emailE == null && passwordE == null && passwordME == null) {
      dispatch(authActions.signup(username, email, password));
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bg-register.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        scrollEnabled={false}
        extraScrollHeight={200}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ width: "80%", alignItems: "flex-start" }}>
          <Text style={{ color: "white" }}>{error}</Text>
          <Text style={{ color: "white", marginTop: 5 }}>{emailE}</Text>
          <Text style={{ color: "white", marginTop: 5 }}>{passwordE}</Text>
          <Text style={{ color: "white", marginTop: 5 }}>{passwordME}</Text>
        </View>

        <View style={{ marginTop: 50 }}></View>

        <View
          style={{
            borderBottomWidth: 1,
            width: "80%",
            height: 40,
            borderColor: "white",
          }}
        >
          <TextInput
            placeholder="Username"
            placeholderTextColor="#fff"
            color="white"
            returnKeyType={"done"}
            keyboardType="default"
            autoCapitalize="none"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
            }}
          />
        </View>
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
            placeholder="Email"
            placeholderTextColor="#fff"
            keyboardType="email-address"
            color="white"
            returnKeyType={"done"}
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmailE(
                validateInput({
                  type: "email",
                  value: text,
                })
              );
              setEmail(text);
            }}
          />
        </View>
        <View style={{ marginTop: 50 }}></View>
        {/* <View
        style={{
          borderBottomWidth: 1,
          width: "80%",
          height: 40,
          borderColor: "white",
        }}
      >
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#fff"
          color="white"
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
      </View> */}
        {/* <View style={{ marginTop: 50 }}></View> */}
        <View
          style={{
            borderBottomWidth: 1,
            width: "80%",
            height: 40,
            borderColor: "white",
          }}
        >
          <TextInput
            placeholder="Password"
            placeholderTextColor="#fff"
            color="white"
            secureTextEntry={true}
            returnKeyType={"done"}
            autoCapitalize="none"
            value={password}
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            onChangeText={(text) => {
              setPasswordE(
                validateInput({
                  type: "password",
                  value: password,
                })
              );
              setPassword(text);
            }}
          />
        </View>
        <View style={{ marginTop: 50 }}></View>
        <View
          style={{
            borderBottomWidth: 1,
            width: "80%",
            height: 40,
            borderColor: "white",
          }}
        >
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            color="white"
            secureTextEntry={true}
            returnKeyType={"done"}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            value={confirmPassword}
            onChangeText={(text) => {
              setPasswordME(PasswordsMatch(password, text));
              setConfirmPassword(text);
            }}
          />
        </View>
        <View style={{ marginTop: 20 }}></View>
        {loading ? (
          <View style={{ marginTop: 40 }}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 90,
            }}
            onPress={() => {
              registerUser(username, email, password, confirmPassword);
            }}
          >
            <Image
              source={require("../../assets/register-button.png")}
              resizeMode="contain"
              style={{ width: "60%" }}
            />
          </TouchableOpacity>
        )}
        <Image
          source={require("../../assets/line.png")}
          resizeMode="contain"
          style={{ width: "80%", marginTop: 50 }}
        />
        <TouchableOpacity activeOpacity={0.8}>
          <Text
            style={{
              color: "#cdcdcd",
              marginTop: 30,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            By signing up, you agree to our {"\n"}
            <Text style={{ fontWeight: "700" }}>
              Terms {"&"} Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
