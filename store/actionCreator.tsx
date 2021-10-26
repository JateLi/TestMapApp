import { Location, LocationAction, DispatchType } from "../types";
import * as actionTypes from "./actionTypes";

export function addLocation(contact: Location) {
  const action: LocationAction = {
    type: actionTypes.ADD_LOCATION,
    location: contact,
  };

  return simulateHttpRequest(action);
}

export function removeLocation(contact: Location) {
  const action: LocationAction = {
    type: actionTypes.REMOVE_LOCATION,
    location: contact,
  };
  return simulateHttpRequest(action);
}

export function removeAllLocation() {
  const action: LocationAction = {
    type: actionTypes.REMOVE_ALL_LOCATION,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
}

export function editLocation(contact: Location) {
  const action: LocationAction = {
    type: actionTypes.EDIT_LOCATION,
    location: contact,
  };
  return simulateHttpRequest(action);
}

export function simulateHttpRequest(action: LocationAction) {
  return (dispatch: DispatchType) => {
    setTimeout(() => {
      dispatch(action);
    }, 500);
  };
}
