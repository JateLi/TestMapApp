import { Location, LocationAction, DispatchType } from "../types";
import * as actionTypes from "./actionTypes";

export function addContact(contact: Location) {
  const action: LocationAction = {
    type: actionTypes.ADD_CONTACT,
    location: contact,
  };

  return simulateHttpRequest(action);
}

export function removeContact(contact: Location) {
  const action: LocationAction = {
    type: actionTypes.REMOVE_CONTACT,
    location: contact,
  };
  return simulateHttpRequest(action);
}

export function editContact(contact: Location) {
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
