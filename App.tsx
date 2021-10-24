import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import reducer from "./store/reducer";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { LocationAction, LocationState, DispatchType } from "./types";

const store: Store<LocationState, LocationAction> & {
  dispatch: DispatchType;
} = createStore(reducer, applyMiddleware(thunk));

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
