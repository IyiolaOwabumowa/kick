import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  Animated,
} from "react-native";

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
    return () => {
      savedCallback.current = null;
    };
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    } else {
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
};
