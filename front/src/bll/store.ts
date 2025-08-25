import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi} from "./base-api";
// import { baseApi, socketApi } from "./base-api";
import { appReducer } from "./app.slice";
// import { wsApi } from "./socket/socket.service";


export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware,
    // socketApi.middleware,
    // wsApi.middleware
  ),
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer ,
    // [wsApi.reducerPath]: wsApi.reducer,
    app: appReducer,
  },
})

setupListeners(store.dispatch)
export type AppDispatchType = typeof store.dispatch
export type RootStateType = ReturnType<typeof store.getState>



