import { configureStore } from '@reduxjs/toolkit'
import { postsApi } from './postsApi'
import authReducer from './postsApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware),
})
