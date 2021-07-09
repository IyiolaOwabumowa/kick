import React from 'react';
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
} from 'react-native';

const SplashOptions = (props) => {
  return (
    <ImageBackground source={require('../../assets/bg.png')}
    style={styles.container}>
      <Image
        source={require('../../assets/balltext.png')}
        resizeMode="contain"
        style={{width: '90%', height: '45%'}}
      />



      <Text style={{color: 'white', fontSize: 19}}>Welcome Back</Text>
      <View
        style={{
          backgroundColor: 'black',
          width: 100,
          height: 100,
          borderRadius: 50,
          marginTop: 50,
        }}></View>
      <TouchableOpacity activeOpacity={0.8}>
        <Text style={{color: '#fff', marginTop: 60, fontSize: 15}}>
          Login with Face ID
        </Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8}>
        <Text style={{color: '#fff', marginTop: 20, fontSize: 15}}>
        Login with Username
        </Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8}>
      <Text style={{color: '#fff', marginTop: 100, fontSize: 14}}>
        Not you?
      </Text>
      </TouchableOpacity>
      </ImageBackground>
  );
};

export default SplashOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
