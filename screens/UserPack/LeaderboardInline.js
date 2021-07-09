import React, { useEffect, useState } from "react";
import moment from "moment";

import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import AvatarBadge from "./AvatarBadge";

const LeaderboardInline = (props) => {
  const startDate = moment(props.started);
  const endDate = moment(props.ended);
  var rawTimeSpent = moment.duration(endDate.diff(startDate));
  var timeSpent =
    rawTimeSpent.seconds() + "." + rawTimeSpent.milliseconds() + "s";
  const [badge, setBadge] = useState(null);
  const [sideText, setSideText] = useState("");

  useEffect(() => {
    if (props.position != null) {
      if (props.position + 1 == 1) {
        setBadge(require("../../assets/first-badge.png"));
      }

      if (props.position + 1 == 2) {
        setBadge(require("../../assets/second-badge.png"));
      }

      if (props.position + 1 == 3) {
        setBadge(require("../../assets/third-badge.png"));
      }
    } else {
      setSideText("Not Ranked");
    }
  }, [props.position]);
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "30%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AvatarBadge badge={badge} dp={props.dp} />
        </View>

        <Text
          style={{
            color: "white",
            fontSize: 13,
            bottom: 0,
            right: 0,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "900",
              fontSize: 13,
              bottom: 0,
              right: 0,
            }}
          >
            {props.playerName}{" "}
          </Text>
          <Text
            style={{
              color: "#ffffff30",
              fontWeight: "500",
              fontSize: 13,
              bottom: 0,
              right: 0,
            }}
          >
            ({props.points ? props.points : 0}pts)
          </Text>
          {/* {props.position ? (
            <Text
              style={{
                color: "white",
                fontSize: 10,
                bottom: 0,
                right: 0,
              }}
            >
              {"\n"}
              {props.position == null ? `(you're not in the top 7)` : null}
            </Text>
          ) : null} */}
        </Text>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#00BD76",
              justifyContent: "center",
              borderRadius: 30,
              marginRight: 20,
            }}
          >
            <Text
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
                color: "white",
                fontSize: 11,

                bottom: 0,
              }}
            >
              {timeSpent === "NaN.NaNs" ? "Not played" : timeSpent}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default LeaderboardInline;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
