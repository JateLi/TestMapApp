import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Location as geoLocation, LocationState } from "../types";

const salesman = require("../util/salesman");

export default function ModalScreen() {
  const locations: readonly geoLocation[] = useSelector(
    (state: LocationState) => state.locations,
    shallowEqual
  );

  const sortingList = cloneDeep(locations).map((location) => {
    const latitude = location.latitude;
    const longitude = location.longitude;
    return new salesman.Point(longitude, latitude);
  });
  console.log(sortingList);
  const { predictionsContainer, predictionRow } = styles;
  //TODO remove Mock
  const tests = [
    [1, 10],
    [50, 11],
    [0, 1],
    [1, 2],
    [1, 9],
  ];

  const pathSolution = salesman.solve(sortingList);
  const newOrderedLocations = pathSolution.map((i) => locations[i]);

  useEffect(() => {
    // var points = tests.map(([x, y]) => new salesman.Point(x, y));
    // var solution = salesman.solve(points);
    // var ordered_points = solution.map((i) => points[i]);
  }, []);

  const renderEmptyContainer = () => {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20%",
        }}
      >
        <Text>The location list is empty</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={newOrderedLocations}
      ListEmptyComponent={renderEmptyContainer()}
      renderItem={({ item, index }) => {
        return (
          <View style={predictionRow}>
            <Text
              numberOfLines={1}
              style={styles.rowText}
            >{` ${item.title}`}</Text>
          </View>
        );
      }}
      style={predictionsContainer}
    />
  );
}

const styles = StyleSheet.create({
  predictionsContainer: {
    position: "absolute",
    bottom: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },
  predictionRow: {
    paddingVertical: 10,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    backgroundColor: "white",
    height: 50,
    justifyContent: "center",
  },
  rowText: {
    fontSize: 18,
    marginHorizontal: "5%",
  },
  header: {
    width: "100%",
    backgroundColor: "white",
    height: 60,
    borderColor: "lightgrey",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
