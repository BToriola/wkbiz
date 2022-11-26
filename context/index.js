import { useReducer, createContext } from "react";
import { userID } from "./reducers/userID";
import { user } from "./reducers/user";
import { profile } from "./reducers/profile";
import { task } from "./reducers/task";

// initial state
const initialState = {
  userID: "",
  user: null,
  profile: null,
};

// create context
const Context = createContext({});

// combine reducer function
const combineReducers =
  (...reducers) =>
  (state, action) => {
    for (let i = 0; i < reducers.length; i++)
      state = reducers[i](state, action);
    return state;
  };

// context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(
    combineReducers(user, userID, profile, task),
    initialState
  );
  const value = { state, dispatch };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export { Context, Provider };
