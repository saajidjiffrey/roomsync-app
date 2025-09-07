import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import counterReducer from './slices/counterSlice'
import authReducer from './slices/authSlice'
import propertyReducer from './slices/propertySlice'
import propertyAdReducer from './slices/propertyAdSlice'
import joinRequestReducer from './slices/propertyJoinRequestSlice'
import groupReducer from './slices/groupSlice'
import expenseReducer from './slices/expenseSlice'
import splitReducer from './slices/splitSlice'
import taskReducer from './slices/taskSlice'
import notificationReducer from './slices/notificationSlice'
import spinnerReducer from './slices/spinnerSlice'
import { errorToastMiddleware } from './middleware/errorToastMiddleware'

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  property: propertyReducer,
  propertyAd: propertyAdReducer,
  joinRequest: joinRequestReducer,
  group: groupReducer,
  expense: expenseReducer,
  split: splitReducer,
  tasks: taskReducer,
  notifications: notificationReducer,
  spinner: spinnerReducer,
})

const persistConfig = {
  key: 'roomSyncApp',
  storage,
  whitelist: ['auth'],
  blacklist: ['counter'],
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