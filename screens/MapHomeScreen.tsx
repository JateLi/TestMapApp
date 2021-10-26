import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { MaterialIcons } from "@expo/vector-icons";

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
import {
  addLocation,
  removeAllLocation,
  removeLocation,
} from "../store/actionCreator";
import { ConfirmButtonGroup } from "../components/ConfirmButtonGroup";
import {
  askNotification,
  handleNotification,
  onSubmitNotification,
} from "../hooks/useTimerNotification";

const markerSource = "../assets/pngwing.png";
const GOOGLE_PACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place";
//const apiKey = "AIzaSyD_rQ_p-oEGxmSB3wQ9y0BMlhcCYj8fk1E";

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 50 : 0;

export default function MapHomeScreen({
  navigation,
}: RootStackScreenProps<"NotFound">) {
  const [showFullScreen, setshowFullScreen] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const [mapRegion, setmapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  });
  const [markerLocation, setmarkerLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  });

  const [search, setSearch] = useState({ term: "", fetchPredictions: false });
  const [predictions, setPredictions] = useState<PredictionType[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [showMarker, setShowMarker] = useState(false);

  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Wait, we are fetching you location..."
  );

  const locations: readonly geoLocation[] = useSelector(
    (state: LocationState) => state.locations,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const addingLocationToList = React.useCallback(
    (location: geoLocation) => dispatch(addLocation(location)),
    [dispatch]
  );

  const removingLocationFromList = React.useCallback(
    (location: geoLocation) => dispatch(removeLocation(location)),
    [dispatch]
  );

  const removingAllLocationFromList = React.useCallback(
    () => dispatch(removeAllLocation()),
    [dispatch]
  );

  useEffect(() => {
    checkIfLocationEnabled();
  }, []);

  useEffect(() => {
    askNotification();
    // If we want to do something with the notification when the app
    // is active, we need to listen to notification events and
    // handle them in a callback
    const listener = Notifications.addNotificationReceivedListener(
      handleNotification
    );
    return () => listener.remove();
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
      setMapLoading(false);
      if (showFullScreen) {
        setmarkerLocation({
          latitude,
          longitude,
          latitudeDelta: mapRegion.latitudeDelta,
          longitudeDelta: mapRegion.longitudeDelta,
        });
        setShowMarker(true);
      }

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

        // Adding new location in here
        const newLocationItem = {
          id: placeId,
          title: description,
          body: description,
          latitude: lat,
          longitude: lng,
        };
        addingLocationToList(newLocationItem);
        // Add notification
        onSubmitNotification(60 * 5, description, description);
        setShowPredictions(false);
        setSearch({ term: "", fetchPredictions: false });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const returnNewName = () => {
    const locationTitle = locations.map(({ title }) => title);
    let index = 0;
    let newName = "Current Location";

    while (locationTitle.includes(newName)) {
      index = index + 1;
      newName = `Current Location ${index}`;
    }
    return newName;
  };

  const onConfirmLocationMarker = (type: "confirm" | "cancel") => {
    // Save location and clean the marker
    locations.find;

    if (type === "confirm") {
      const newName = returnNewName();

      const newLocationItem = {
        id: "-1",
        title: newName,
        body: newName,
        latitude: markerLocation.latitude,
        longitude: markerLocation.longitude,
      };
      console.log("adding", newLocationItem);
      addingLocationToList(newLocationItem);
    }
    setshowFullScreen(false);
    setShowMarker(false);
  };

  const onClickDestinations = () => {
    // display on result in modal screen
    navigation.navigate("Modal");
  };

  const activityIndicator = () => {
    return (
      <View style={styles.activityHeight}>
        <ActivityIndicator size="large" color={"black"} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!showFullScreen && (
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
      )}

      {mapLoading ? (
        activityIndicator()
      ) : (
        <MapView
          style={{ alignSelf: "stretch", height: "100%" }}
          region={mapRegion}
        >
          {markerLocation && showMarker && (
            <Marker
              draggable
              coordinate={mapRegion}
              title={displayCurrentAddress}
              onDragEnd={(e) => {
                const latitude = e.nativeEvent.coordinate.latitude;
                const longitude = e.nativeEvent.coordinate.longitude;
                setmarkerLocation({
                  latitude,
                  longitude,
                  latitudeDelta: markerLocation.latitudeDelta,
                  longitudeDelta: markerLocation.longitudeDelta,
                });
                setmapRegion({
                  latitude,
                  longitude,
                  latitudeDelta: markerLocation.latitudeDelta,
                  longitudeDelta: markerLocation.longitudeDelta,
                });
                const displayCoordinates = `GPS: Latitude:${latitude.toFixed(
                  4
                )} Longitude:${longitude.toFixed(4)}`;
                setDisplayCurrentAddress(displayCoordinates);
              }}
            >
              <Image style={styles.marker} source={require(markerSource)} />
            </Marker>
          )}
        </MapView>
      )}

      {locations && !showPredictions && !showFullScreen && (
        <LocationsList
          locations={locations}
          removingLocationFromList={removingLocationFromList}
          onClickDestinations={onClickDestinations}
          onClickRemoveAll={removingAllLocationFromList}
        />
      )}

      {!showFullScreen && (
        <View style={{ position: "absolute", bottom: "52%", right: 20 }}>
          <TouchableOpacity
            onPress={() => {
              setshowFullScreen(true);
              setShowMarker(true);
              getCurrentLocation();
            }}
          >
            <MaterialIcons name="my-location" size={35} color="black" />
          </TouchableOpacity>
        </View>
      )}
      <PredictionList
        predictions={predictions}
        showPredictions={showPredictions && !showFullScreen}
        onPredictionTapped={onPredictionTapped}
      />
      {showFullScreen && (
        <ConfirmButtonGroup
          onCancelPress={() => onConfirmLocationMarker("cancel")}
          onConfirmPress={() => onConfirmLocationMarker("confirm")}
        />
      )}
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
    position: "absolute",
    width: "100%",
    height: 100,
    marginTop: STATUSBAR_HEIGHT,
  },
  marker: {
    height: 50,
    width: 30,
    resizeMode: "contain",
  },
  activityHeight: { height: 30, marginTop: "30%" },
});
