import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session"; // Import session storage
import userReducer from "./userSlice.js";
import groupReducer from "./groupSlice.js";
import taskReducer from "./taskSlice.js";

// Create a persist configuration with sessionStorage
const persistConfig = {
  key: "root",
  storage: storageSession, // Use sessionStorage instead of localStorage
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  groups: groupReducer,
  tasks: taskReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
