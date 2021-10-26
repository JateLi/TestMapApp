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

type ConfirmButtonGroupProps = {
  onCancelPress: () => void;
  onConfirmPress: () => void;
};

export const ConfirmButtonGroup: FunctionComponent<ConfirmButtonGroupProps> = ({
  onCancelPress,
  onConfirmPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onCancelPress}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onConfirmPress}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
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
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 20,
    paddingHorizontal: 20,
  },
});
