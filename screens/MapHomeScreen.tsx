import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useSelector, shallowEqual } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { Text, View } from "../components/Themed";
import {
  Location as geoLocation,
  LocationState,
  RootStackScreenProps,
} from "../types";

const markerSource = "../assets/pngwing.png";

export default function MapHomeScreen({
  navigation,
}: RootStackScreenProps<"NotFound">) {
  const [mapRegion, setmapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  });
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Wait, we are fetching you location..."
  );

  const locations: readonly geoLocation[] = useSelector(
    (state: LocationState) => state.locations,
    shallowEqual
  );

  console.log(locations);

  useEffect(() => {
    checkIfLocationEnabled();
  }, []);

  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        "Location Service not enabled",
        "Please enable your location services to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use location service.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      setmapRegion({
        latitude,
        longitude,
        latitudeDelta: mapRegion.latitudeDelta,
        longitudeDelta: mapRegion.longitudeDelta,
      });
      getDisplayAddress(response);
    }
  };

  const getDisplayAddress = (response: Location.LocationGeocodedAddress[]) => {
    for (let item of response) {
      let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
      setDisplayCurrentAddress(address);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={{ alignSelf: "stretch", height: "100%" }}
        region={mapRegion}
      >
        <Marker
          draggable
          coordinate={mapRegion}
          title={displayCurrentAddress}
          onDragEnd={(e) => {
            setmapRegion({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
              latitudeDelta: mapRegion.latitudeDelta,
              longitudeDelta: mapRegion.longitudeDelta,
            });
            setDisplayCurrentAddress("Something else");
          }}
        >
          <Image style={styles.marker} source={require(markerSource)} />
        </Marker>
      </MapView>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate("Modal")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  marker: {
    height: 50,
    width: 30,
    resizeMode: "contain",
  },
});
