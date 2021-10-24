import React, { FunctionComponent } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { PredictionType } from "../types";

type SearchBarProps = {
  predictions: PredictionType[];
  showPredictions: boolean;
  onPredictionTapped: (placeId: string, description: string) => void;
};

export const PredictionList: FunctionComponent<SearchBarProps> = ({
  predictions,
  showPredictions,
  onPredictionTapped,
}) => {
  const { predictionsContainer, predictionRow } = styles;
  if (!showPredictions) return null;
  return (
    <FlatList
      data={predictions}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            style={predictionRow}
            onPress={() => onPredictionTapped(item.place_id, item.description)}
          >
            <Text numberOfLines={1}>{item.description}</Text>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item) => item.place_id}
      keyboardShouldPersistTaps="handled"
      style={[predictionsContainer]}
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
    height: "70%",
    width: "100%",
  },
  predictionRow: {
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
});
