import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSelector, shallowEqual } from "react-redux";

import { Text, View } from "../components/Themed";
import { Location, LocationState, RootStackScreenProps } from "../types";

export default function MapHomeScreen({
  navigation,
}: RootStackScreenProps<"NotFound">) {
  const locations: readonly Location[] = useSelector(
    (state: LocationState) => state.locations,
    shallowEqual
  );

  console.log(locations);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Modal")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
