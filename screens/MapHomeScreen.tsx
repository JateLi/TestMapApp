import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Button,
} from "react-native";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

import { Text, View } from "../components/Themed";
import {
  Location as geoLocation,
  LocationState,
  PredictionType,
  RootStackScreenProps,
} from "../types";
import SearchBarWithAutocomplete from "../components/SearchBarWithAutocomplete";
import { useDebounce } from "../hooks/useDebounce";
import { SafeAreaView } from "react-native-safe-area-context";
import { PredictionList } from "../components/PredictionList";

import { GOOGLE_API_KEY as apiKey } from "@env";
import { LocationsList } from "../components/LocationsList";
import { Dispatch } from "redux";
import { addLocation } from "../store/actionCreator";

const markerSource = "../assets/pngwing.png";
const GOOGLE_PACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place";

export default function MapHomeScreen({
  navigation,
}: RootStackScreenProps<"NotFound">) {
  const [showFullScreen, setshowFullScreen] = useState(false);

  const [mapRegion, setmapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  });
  const [search, setSearch] = useState({ term: "", fetchPredictions: false });
  const [predictions, setPredictions] = useState<PredictionType[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  //const [showLocationList, setshowLocationList] = useState(false);

  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Wait, we are fetching you location..."
  );

  const locations: readonly geoLocation[] = useSelector(
    (state: LocationState) => state.locations,
    shallowEqual
  );

  console.log(apiKey);
  // console.log(locations);

  const dispatch: Dispatch<any> = useDispatch();

  const addingLocationToList = React.useCallback(
    (location: geoLocation) => dispatch(addLocation(location)),
    [dispatch]
  );

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

  const onChangeText = async () => {
    if (search.term.trim() === "") {
      setShowPredictions(false);
      setSearch({ term: "", fetchPredictions: false });
      return;
    }
    if (!search.fetchPredictions) return;

    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${apiKey}&input=${search.term}`;
    try {
      const result = await axios.request({
        method: "post",
        url: apiUrl,
      });
      if (result) {
        const {
          data: { predictions },
        } = result;
        setPredictions(predictions);
        setShowPredictions(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useDebounce(onChangeText, 1000, [search.term]);

  const onPredictionTapped = async (placeId: string, description: string) => {
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/details/json?key=${apiKey}&place_id=${placeId}`;
    try {
      const result = await axios.request({
        method: "post",
        url: apiUrl,
      });
      if (result) {
        const {
          data: {
            result: {
              geometry: { location },
            },
          },
        } = result;
        const { lat, lng } = location;
        // setSearch({ term: description, fetchPredictions: false });
        // TODO add new location in here
        console.log(placeId);
        const newLocationItem = {
          id: 123,
          title: description,
          body: description,
          latitude: lat,
          longitude: lng,
        };
        addingLocationToList(newLocationItem);
        setShowPredictions(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overTop}>
        <SearchBarWithAutocomplete
          value={search.term}
          onChangeText={(text) => {
            setSearch({ term: text, fetchPredictions: true });
          }}
          showPredictions={showPredictions}
          predictions={predictions}
          onPredictionTapped={onPredictionTapped}
        />
      </View>

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
      <View style={{ position: "absolute", bottom: 100 }}>
        <Button
          onPress={() => {
            // TODO convert to full screen mode
            getCurrentLocation();
          }}
          title={"++++"}
        />
      </View>
      <PredictionList
        predictions={predictions}
        showPredictions={showPredictions}
        onPredictionTapped={onPredictionTapped}
      />
      {locations && !showPredictions && <LocationsList locations={locations} />}
    </SafeAreaView>
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
  overTop: {
    zIndex: 5,
  },
  marker: {
    height: 50,
    width: 30,
    resizeMode: "contain",
  },
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
