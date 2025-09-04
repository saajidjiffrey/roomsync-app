import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import counterReducer from './slices/counterSlice'
import authReducer from './slices/authSlice'
import propertyReducer from './slices/propertySlice'
import propertyAdReducer from './slices/propertyAdSlice'
import spinnerReducer from './slices/spinnerSlice'
import { errorToastMiddleware } from './middleware/errorToastMiddleware'

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  property: propertyReducer,
  propertyAd: propertyAdReducer,
  spinner: spinnerReducer,
})

const persistConfig = {
  key: 'roomSyncApp', // unique key for your app
  storage,
  whitelist: ['auth'], // include auth reducer in persistence
  blacklist: ['counter'], // exclude counter from persistence
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(errorToastMiddleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch