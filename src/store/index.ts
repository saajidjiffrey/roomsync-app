import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import counterReducer from './slices/counterSlice'

const rootReducer = combineReducers({
  counter: counterReducer,
})

const persistConfig = {
  key: 'roomSyncApp', // unique key for your app
  storage,
  whitelist: ['counter'], // include these reducers in persistence
  blacklist: [], // exclude these reducers from persistence
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch