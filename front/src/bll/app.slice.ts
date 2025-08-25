import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {UserType} from "./auth/auth.type.ts";

type initialStateType = {
    // listFields: Array<string>
    user: UserType | null
    successfully: string | null
    error: string | null
    isLoading: boolean
}
const initialState: initialStateType = {
    // listFields: [],
    user: null,
    error: null,
    successfully: null,
    isLoading: false,
}

const slice = createSlice({
    name: 'App',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserType>): void => {
            state.user = action.payload
        },
        setLogout: (state): void => {
            state.user = null
        },
        changeStatusError: (state, action: PayloadAction<string | null>): void => {
            state.error = action.payload
        },
        changeStatusSuccessfully: (state, action: PayloadAction<string | null>): void => {

            state.successfully = action.payload
        },
        changeStatusIsLoading: (state, action: PayloadAction<boolean>): void => {
            state.isLoading = action.payload
        },

    },
})
export const appAC = slice.actions
export const appReducer = slice.reducer
