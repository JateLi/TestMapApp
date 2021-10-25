import * as actionTypes from "./actionTypes";
import { cloneDeep } from "lodash";
import { Location, LocationAction, LocationState } from "../types";

// TODO Empty Mock Data
const initialState: LocationState = {
  locations: [
    {
      id: "11111",
      title: "John Smith Road",
      body: "libero tempore, cum soluta nobis est eligendi",
      latitude: 0,
      longitude: 0,
    },
    {
      id: "22222",
      title: "Jack Doe Road",
      body: "pedita distinctio quas molestias excepturi sint",
      latitude: 0,
      longitude: 0,
    },
    {
      id: "123321",
      title: "Walter White Road",
      body: "Harum quidem rerum folestias excepturi sint",
      latitude: 0,
      longitude: 0,
    },
    {
      id: "121",
      title: "Jesse Pinkman Road",
      body: "Harum quidem rerum f sint",
      latitude: 0,
      longitude: 0,
    },
  ],
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
        latitude: 0,
        longitude: 0,
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
