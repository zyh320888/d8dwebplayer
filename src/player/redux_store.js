import { createStore, combineReducers } from "redux";

const globalReducer = function (state = {}, action) {
  //console.log("globalReducer: ", state, action);
  let tmpState = { ...state };
  if (action.type == "set") {
    if (action.hasOwnProperty("key") && action.key) {
      tmpState[action.key] = action.value;
    }
  }
  return tmpState;
};

let store = createStore(globalReducer);

export function setStore(key, value) {
  store.dispatch({
    type: "set",
    key,
    value
  });
}

export function getStore(key) {
  let state = store.getState();
  return state[key];
}

export default store;
