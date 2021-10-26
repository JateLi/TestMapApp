import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { PredictionType } from "../types";
import { FontAwesome } from "@expo/vector-icons";

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
          <View style={predictionRow}>
            <TouchableOpacity
              style={styles.circle}
              onPress={() =>
                onPredictionTapped(item.place_id, item.description)
              }
            >
              <FontAwesome name="plus-circle" size={25} color="green" />
            </TouchableOpacity>
            <Text numberOfLines={1}>{item.description}</Text>
          </View>
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
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: "absolute",
    bottom: 0,
    height: "70%",
    width: "100%",
  },
  predictionRow: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    backgroundColor: "white",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  circle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
});
