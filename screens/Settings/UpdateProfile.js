import { useFocusEffect, useIsFocused } from "@react-navigation/native";
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
  Dimensions,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../src/actions/game.actions";
import { userActions } from "../../src/actions/user.actions";
import CHeader from "../auth/CHeader";
import LeaderboardInline from "../UserPack/LeaderboardInline";
import {
  launchCamera,
  launchImageLibrary,
  ImagePicker,
} from "react-native-image-picker";

import FeedbackScreen from "../Feedback/FeedbackScreen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FastImage from "react-native-fast-image";

const UpdateProfile = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const player = useSelector((state) =>
    state.userReducer.player ? state.userReducer.player : null
  );
  const token = useSelector((state) => state.authReducer.token);
  const loading = useSelector((state) => state.userReducer.updating);

  const toastMessage = useSelector((state) => state.userReducer.toastMessage);
  const errorMessage = useSelector((state) => state.userReducer.error);
  const categories = useSelector((state) => state.gameReducer.categories);
  const leaderboard = useSelector((state) => state.gameReducer.leaderboard);

  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const hasNotch = DeviceInfo.hasNotch();

  let options = {
    title: "Select Image",
    customButtons: [
      { name: "customOptionKey", title: "Choose Photo from Custom Option" },
    ],
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  };

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

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission",
          }
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        // console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "External Storage Write Permission",
            message: "App needs write permission",
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        // console.warn(err);
        // alert("Write permission err", err);
      }
      return false;
    } else return true;
  };

  const choosePhotoFromLibrary = async () => {
    // try {
    //   getPermissionAsync();
    //   let result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.All,
    //     allowsEditing: false,
    //     aspect: [4, 3],
    //     quality: 1,
    //   });
    //   if (!result.cancelled) {
    //     setImage(result.uri);
    //   }
    // } catch (E) {
    //   console.log(E);
    // }

    launchImageLibrary(options, (response) => {
      // console.log("Response = ", response);

      if (response.didCancel) {
        // alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        //alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        // alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        // alert(response.errorMessage);
        return;
      }

      setImage(response.assets[0].uri);
    });
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    setError(null);
    if (email == null || username == null || phoneNumber == null) {
      setError("Your email, username and phone number can't be empty ");
    } else {
      // const newDob = moment(dob, 'YYYY-MM-DD')
      // console.log(newDob);
      // moment(newDob).format('L');

      dispatch(
        userActions.updateProfile(
          email,
          username,
          phoneNumber,
          image,
          player && player.profile.id,
          player.id,
          token,
          oldPassword,
          newPassword
        )
      );
    }
  };

  useEffect(() => {
    setImage(player && player.profile.display_picture);
    setUsername(player && player.username);
    setEmail(player && player.email);
    setError(null);
    setPhoneNumber(player && player.phone);
  }, []);
  useEffect(() => {
    if (toastMessage) {
      dispatch(userActions.refreshPlayer(token, player.id));
    }
  }, [toastMessage]);

  if (toastMessage) {
    return (
      <FeedbackScreen
        navigation={props.navigation}
        emo="excitement"
        title={"Profile Update Successful"}
      />
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/settings-bg.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={{ marginTop: hasNotch ? 30 : 15 }}></View>
      <CHeader leftC={<LeftHeaderComponent />} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 400, alignItems: "center" }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {/* <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ flex: 1, alignItems: "center" }}
          scrollEnabled={true}
          extraScrollHeight={70}
          keyboardShouldPersistTaps="always"
        > */}
        <FastImage
          source={
            image != null
              ? {
                  uri: image.split("?")[0],
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }
              : require("../../assets/dummy_avatar.png")
          }
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,

            marginBottom: 30,
          }}
        />

        <TouchableOpacity
          style={
            error
              ? {
                  backgroundColor: "#ffffff20",
                  padding: 5,
                  borderRadius: 5,
                }
              : {
                  backgroundColor: "#ffffff20",
                  padding: 5,
                  borderRadius: 5,

                  marginBottom: 20,
                }
          }
          activeOpacity={0.8}
          onPress={() => {
            choosePhotoFromLibrary();
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Upload Avatar
          </Text>
        </TouchableOpacity>

        {error && (
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
              {error}
            </Text>
          </View>
        )}

        {errorMessage && (
          <View
            style={{
              backgroundColor: "#FF000030",
              marginBottom: 20,
              marginTop: 20,
              borderRadius: 5,
              width: "70%",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                textAlign: "center",

                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              {errorMessage}
            </Text>
          </View>
        )}

        <View
          style={{
            borderBottomWidth: 1,
            width: "80%",
            height: 40,
            borderColor: "white",
          }}
        >
          <TextInput
            placeholder="Change Username"
            placeholderTextColor="#fff"
            color="white"
            keyboardType="default"
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
            placeholder="Update Email"
            placeholderTextColor="#fff"
            keyboardType="email-address"
            autoCapitalize="none"
            color="white"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
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
            placeholder="Update Phone Number"
            placeholderTextColor="#fff"
            color="white"
            keyboardType="phone-pad"
            autoCapitalize="none"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
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
            placeholder="Old Password"
            placeholderTextColor="#fff"
            color="white"
            secureTextEntry={true}
            autoCapitalize="none"
            value={oldPassword}
            onChangeText={(text) => {
              setOldPassword(text);
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
            autoCapitalize="none"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
            }}
          />
        </View>
        <View style={{ marginTop: 20 }}></View>

        {loading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ flex: 1, flexDirection: "row" }}
            onPress={() => {
              Keyboard.dismiss();
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
        {/* </KeyboardAwareScrollView> */}
      </ScrollView>
    </ImageBackground>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    height: "130%",
  },
});
