import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import { Location } from "../types";

type ConfirmButtonGroupProps = {};

export const ConfirmButtonGroup: FunctionComponent<ConfirmButtonGroupProps> = ({}) => {
  return (
    <View style={styles.container}>
      <Button onPress={() => {}} title={"++++"} />
      <Button onPress={() => {}} title={"----"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    height: "10%",
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
  },
  predictionRow: {
    paddingBottom: 15,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    backgroundColor: "white",
    height: 50,
  },
});
