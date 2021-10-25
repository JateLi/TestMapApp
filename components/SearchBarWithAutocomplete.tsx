import React, { FunctionComponent } from "react";
import { StyleSheet, View, TextInput, ViewStyle } from "react-native";
import { PredictionType } from "../types";

type SearchBarProps = {
  value: string;
  style?: ViewStyle | ViewStyle[];
  onChangeText: (text: string) => void;
  predictions: PredictionType[];
  showPredictions: boolean;
  onPredictionTapped: (placeId: string, description: string) => void;
};

const SearchBarWithAutocomplete: FunctionComponent<SearchBarProps> = (
  props
) => {
  const { value, style, onChangeText } = props;

  const { container, inputStyle } = styles;

  return (
    <View style={container}>
      <TextInput
        style={inputStyle}
        placeholder="Search here"
        placeholderTextColor="black"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    position: "absolute",
    top: 0,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 10,
    backgroundColor: "white",
    opacity: 0.8,
    color: "black",
    fontSize: 16,
    width: "96%",
    textAlign: "center",
  },
});

export default SearchBarWithAutocomplete;
