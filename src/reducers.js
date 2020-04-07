// import { combineReducers } from "redux";

const initialState = {
  location: undefined
};

function location(state = initialState, action) {
  console.log(state, action);
  switch (action.type) {
    case "LOCATION_UPDATED_FULFILLED":
      return { ...state, ...action.payload };
    case "LOCATION_UPDATED_PENDING":
    default:
      return state;
  }
}

// export default combineReducers({
//   ...location
// });

export default location;
