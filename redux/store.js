import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices";
import taskReducer from "./slices/tasksSlices";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  timeout: 1000,
  version: 1,
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedTaskReducer = persistReducer(persistConfig, taskReducer );

//Global store
// export const store = configureStore({
//   reducer: {
//     //reducers are defined here
//     user: persistedReducer,
//   },
// });
export const store = configureStore({
  reducer: { user:persistedUserReducer, tasks: persistedTaskReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
