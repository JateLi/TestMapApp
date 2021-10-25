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

type SearchBarProps = {
  locations: Location[];
  showLocations: boolean;
};

const itemHeight = 50;
const maxListHeight = 300;

export const LocationsList: FunctionComponent<SearchBarProps> = ({
  locations,
  showLocations = true,
}) => {
  const { predictionsContainer, predictionRow } = styles;
  if (!showLocations) return null;
  return (
    <FlatList
      data={locations}
      ListHeaderComponent={
        <>
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              height: 60,
              borderColor: "lightgrey",
              borderBottomWidth: 1,
            }}
          >
            <Text numberOfLines={1}>{"item.title"}</Text>
            <Button
              onPress={() => {
                // TODO convert to full screen mode
              }}
              title={"++++"}
            />
          </View>
        </>
      }
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            style={predictionRow}
            onPress={() => {}}
          >
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
});
