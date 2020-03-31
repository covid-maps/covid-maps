import { combineReducers } from "redux";

const initialState = {
  location: undefined,
  ip: undefined
};

export function location(state = initialState, action) {
  console.log(state, action);
  switch (action.type) {
    case "LOCATION_UPDATED_FULFILLED":
      return { ...state, ...action.payload };
    case "LOCATION_UPDATED_PENDING":
    default:
      return state;
  }
}

const appReducer = combineReducers({
  location
});

export default appReducer;
