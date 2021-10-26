import * as actionTypes from "./actionTypes";
import { cloneDeep } from "lodash";
import { Location, LocationAction, LocationState } from "../types";

// TODO Empty Mock Data
const initialState: LocationState = {
  locations: [],
};

const reducer = (
  state: LocationState = initialState,
  action: LocationAction
): LocationState => {
  switch (action.type) {
    case actionTypes.ADD_LOCATION:
      const newLocation: Location = {
        id: Math.random().toString(), // not really unique but it's just an example
        title: action.location.title,
        body: action.location.body,
        latitude: action.location.latitude,
        longitude: action.location.longitude,
      };
      return {
        ...state,
        locations: state.locations.concat(newLocation),
      };
    case actionTypes.REMOVE_LOCATION:
      const updatedContacts: Location[] = state.locations.filter(
        (contact) => contact.id !== action.location.id
      );
      return {
        ...state,
        locations: updatedContacts,
      };
    case actionTypes.EDIT_LOCATION:
      const contactPayload = action.location;
      const index = state.locations.findIndex(
        (contact) => contact.id === contactPayload.id
      );
      const updatedEditContacts = cloneDeep(state.locations);
      updatedEditContacts.splice(index, 1, action.location);
      return {
        ...state,
        locations: updatedEditContacts,
      };
  }
  return state;
};

export default reducer;
