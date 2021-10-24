import React from "react";
import { StatusBar } from "react-native";
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
        <StatusBar barStyle={"dark-content"} />
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
