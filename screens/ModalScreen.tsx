import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Location as geoLocation, LocationState } from "../types";

const salesman = require("../util/salesman");

export default function ModalScreen() {
  const locations: readonly geoLocation[] = useSelector(
    (state: LocationState) => state.locations,
    shallowEqual
  );

  const { predictionsContainer, predictionRow } = styles;
  const tests = [
    [1, 1],
    [0, 1],
    [0, 1],
    [0, 2],
    [1, 9],
  ];

  useEffect(() => {
    var points = tests.map(([x, y]) => new salesman.Point(x, y));
    var solution = salesman.solve(points);
    var ordered_points = solution.map((i) => points[i]);
    console.log(solution);
    console.log(ordered_points);
  }, []);

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <Text numberOfLines={1}>{"DIRECTIONS"}</Text>
            <Button onPress={() => {}} title={"DIRECTIONS"} />
          </View>
        </>
      }
      renderItem={({ item, index }) => {
        return <View style={predictionRow}></View>;
      }}
      style={predictionsContainer}
    />
  );
}

const styles = StyleSheet.create({
  predictionsContainer: {
    position: "absolute",
    bottom: 0,
    height: "50%",
    width: "100%",
    backgroundColor: "white",
  },
  predictionRow: {
    paddingBottom: 15,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    backgroundColor: "white",
    height: 50,
  },
  header: {
    width: "100%",
    backgroundColor: "white",
    height: 60,
    borderColor: "lightgrey",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
