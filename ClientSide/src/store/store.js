import { configureStore } from '@reduxjs/toolkit'
import userDetailsSlice from '../redux/slice/UserSlice'

// import storage from 'redux-persist/lib/storage' // defaults to localStorage
import storage from 'redux-persist/lib/storage/session' // Save to sessionStorage instead of localStorage
import { persistReducer, persistStore } from 'redux-persist'
import { combineReducers } from 'redux'

// Combine reducers
const rootReducer = combineReducers({
  userDetails: userDetailsSlice,
})

// Configure persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userDetails'], // which reducers you want to persist
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})

export const persistor = persistStore(store)