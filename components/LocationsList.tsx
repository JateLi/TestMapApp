import React, { FunctionComponent } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { Location } from "../types";

type SearchBarProps = {
  locations: Location[];
  showLocations: boolean;
};

export const LocationsList: FunctionComponent<SearchBarProps> = ({
  locations,
  showLocations = true,
}) => {
  const { predictionsContainer, predictionRow } = styles;
  if (!showLocations) return null;
  return (
    <FlatList
      data={locations}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity style={predictionRow} onPress={() => {}}>
            <Text numberOfLines={1}>{item.title}</Text>
          </TouchableOpacity>
        );
      }}
      style={predictionsContainer}
    />
  );
};

const styles = StyleSheet.create({
  predictionsContainer: {
    backgroundColor: "#cfcfcf",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: "absolute",
    bottom: 0,
    height: "40%",
    width: "100%",
  },
  predictionRow: {
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
});
