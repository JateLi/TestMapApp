import { Location, LocationAction, DispatchType } from "../types";
import * as actionTypes from "./actionTypes";

export function addLocation(contact: Location) {
  const action: LocationAction = {
    type: actionTypes.ADD_CONTACT,
    location: contact,
  };

  return simulateHttpRequest(action);
}

export function removeLocation(contact: Location) {
  const action: LocationAction = {
    type: actionTypes.REMOVE_CONTACT,
    location: contact,
  };
  return simulateHttpRequest(action);
}

export function editLocation(contact: Location) {
  const action: LocationAction = {
    type: actionTypes.EDIT_CONTACT,
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
