import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import { Location } from "../types";
import Swipeout from "react-native-swipeout";

type SearchBarProps = {
  locations: Location[];
  showLocations: boolean;
  removingLocationFromList: (location: Location) => void;
  onClickDestinations: () => void;
};

export const LocationsList: React.FC<SearchBarProps> = ({
  locations,
  showLocations = true,
  removingLocationFromList,
  onClickDestinations,
}) => {
  const { predictionsContainer, predictionRow } = styles;
  const [deleteItem, setDeleteItem] = useState(null);

  const swipeoutBtns = [
    {
      text: " - Delete",
      onPress: () => {
        if (!deleteItem) return;
        removingLocationFromList(deleteItem);
      },
      backgroundColor: "red",
    },
  ];

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

  if (!showLocations) return null;
  return (
    <FlatList
      data={locations}
      ListEmptyComponent={renderEmptyContainer()}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <View style={styles.headerHolder}>
              <Text>{"Destinations"}</Text>
              <TouchableOpacity
                // style={{ height: 10, backgroundColor: "blue", width: 20 }}
                onPress={() => {
                  // TODO Solve Saleman question
                  onClickDestinations();
                }}
              >
                <Text>{"DIRECTIONS"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      }
      renderItem={({ item, index }) => {
        return (
          <Swipeout left={swipeoutBtns} onOpen={() => setDeleteItem(item)}>
            <View style={predictionRow}>
              <Text numberOfLines={1}>{`(${index}) ${item.title}`}</Text>
            </View>
          </Swipeout>
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
  headerHolder: {
    width: "90%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
