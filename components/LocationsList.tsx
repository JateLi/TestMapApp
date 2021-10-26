import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { Location } from "../types";
import Swipeout from "react-native-swipeout";

type SearchBarProps = {
  locations: Location[];
  showLocations: boolean;
  removingLocationFromList: (location: Location) => void;
  onClickDestinations: () => void;
  onClickRemoveAll: () => void;
};

export const LocationsList: React.FC<SearchBarProps> = ({
  locations,
  showLocations = true,
  removingLocationFromList,
  onClickDestinations,
  onClickRemoveAll,
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
                style={{ backgroundColor: "lightgrey", borderRadius: 5 }}
                onPress={() => onClickRemoveAll()}
              >
                <Text style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                  {"Clear all"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: "lightgrey", borderRadius: 5 }}
                onPress={() => onClickDestinations()}
              >
                <Text style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                  {"DIRECTIONS"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      }
      renderItem={({ item, index }) => {
        return (
          <Swipeout left={swipeoutBtns} onOpen={() => setDeleteItem(item)}>
            <View style={predictionRow}>
              <Text
                numberOfLines={1}
                style={styles.rowText}
              >{`(${index}) ${item.title}`}</Text>
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
  headerHolder: {
    width: "90%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
