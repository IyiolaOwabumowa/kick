import React, { useEffect, useState, useRef } from "react";
// import ReactNativeBiometrics from "react-native-biometrics";
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
  Keyboard,
  Button,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../src/actions/auth.actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Login = (props) => {
  const dispatch = useDispatch();
  const serverError = useSelector((state) => state.authReducer.loginError);
  const loading = useSelector((state) => state.authReducer.loggingIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const keyboardHeight = useRef(new Animated.Value(0)).current;
  // const imageHeight = useRef(new Animated.Value(200)).current;
  const isBoardLoading = useSelector((state) => state.gameReducer.lbLoading);

  useEffect(() => {
    setError(serverError);
  }, [serverError]);

  const loginUser = (email, password) => {
    if (email.length != 0 && password.length != 0) {
      dispatch(authActions.login(email, password));
    } else {
      setError("Please fill in your details");
    }
  };

  // useEffect(() => {
  //   console.log("app started");

  //   Keyboard.addListener("keyboardDidShow", keyboardDidShow);
  //   Keyboard.addListener("keyboardDidHide", keyboardDidHide);

  //   const keyboardDidShow = (event) => {
  //     console.log("keyboard shown");
  //     Animated.timing(imageHeight, {
  //       duration: event.duration,
  //       toValue: 150,
  //     }).start();
  //   };

  //   const keyboardDidHide = (event) => {
  //     console.log("keyboard hidden");
  //     Animated.timing(imageHeight, {
  //       duration: event.duration,
  //       toValue: 300,
  //     }).start();
  //   };

  //   return () => {
  //     Keyboard.removeListener("keyboardDidShow", keyboardDidShow);
  //     Keyboard.removeListener("keyboardDidHide", keyboardDidHide);
  //   };
  // }, []);

  // useEffect(() => {
  //   Keyboard.addListener("keyboardWillShow", _keyboardWillShow);
  //   Keyboard.addListener("keyboardWillHide", _keyboardWillHide);

  //   // cleanup function
  //   return () => {
  //     Keyboard.removeListener("keyboardWillShow", _keyboardWillShow);
  //     Keyboard.removeListener("keyboardWillHide", _keyboardWillHide);
  //   };
  // }, []);

  // const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  // const _keyboardWillShow = (event) => {
  //   Animated.timing(imageHeight, {
  //     duration: 500,
  //     useNativeDriver: false,
  //     toValue: 200,
  //   }).start();
  // };
  // const _keyboardWillHide = (event) => {
  //   Animated.timing(imageHeight, {
  //     duration: 500,
  //     useNativeDriver: false,
  //     toValue: 280,
  //   }).start();
  // };

  return (
    <ImageBackground
      source={require("../../assets/bg.png")}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        scrollEnabled={false}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="always"
      >
        <Animated.Image
          source={require("../../assets/balltext.png")}
          resizeMode="contain"
          style={{ width: 800, height: "30%" }}
        />

        <Text style={{ color: "white", marginBottom: 50 }}>{error}</Text>

        <View
          style={{
            borderBottomWidth: 1,
            width: "80%",
            height: 40,
            borderColor: "white",
          }}
        >
          <TextInput
            placeholder="Enter Email Address"
            placeholderTextColor="#fff"
            color="white"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
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
            placeholder="Enter Password"
            placeholderTextColor="#fff"
            secureTextEntry={true}
            color="white"
            value={password}
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
        </View>
        <View style={{ marginTop: 10 }}></View>
        {loading ? (
          <View style={{ marginTop: 40, marginBottom: 20 }}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ flexDirection: "row", marginBottom: 20 }}
            onPress={() => {
              loginUser(email, password);
            }}
          >
            <Image
              source={require("../../assets/login-button.png")}
              resizeMode="contain"
              style={{ width: "60%" }}
            />
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          initiateFaceID();
        }}
      >
        <Text style={{ color: "#fff", marginTop: 10, fontSize: 14 }}>
          Login with <Text style={{ fontWeight: "700" }}>Face ID</Text>
        </Text>
      </TouchableOpacity> */}
        <View style={{alignItems:"center",  marginBottom:30}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.navigate("Register");
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14 }}>
              New here? <Text style={{ fontWeight: "700" }}>Register</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.navigate("SendReset");
            }}
          >
            <Text style={{ color: "#fff", marginTop: 30, fontSize: 14 }}>
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "120%",
  },
});
