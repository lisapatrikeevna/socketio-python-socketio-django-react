import { baseApi } from "../base-api";
import type {LoginArgs, responseRegisterType, SignUpArgs} from "./auth.type.ts";



// const headers= {
//   'Authorization': `Bearer ${token}`,
//   'Content-Type': 'application/json',
// }


const authService=baseApi.injectEndpoints({
 endpoints: builder => ({

   me: builder.query<any, void>({
     query: () => {
       // debugger
       return {url: `/users/me/`, method: 'GET',
         // headers:{'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json',}
       }
     },
     extraOptions: {maxRetries: 0,},
     providesTags: ['Me'],
   }),

   login: builder.mutation<responseRegisterType, LoginArgs>({
     query: args => {
       return {url: `/users/login/`, method: 'POST', body: JSON.stringify(args),
         headers: {'Content-Type': 'application/json',},
       }
     },
     invalidatesTags: ['Me'],
   }),


   // signUp: builder.mutation<void, SignUpArgs>({
   signUp: builder.mutation<responseRegisterType, SignUpArgs>({
     query: args => {
       return { url: `/users/register/`, method: 'POST',body: args }
     },
     invalidatesTags: ['Me'],
   }),
   registerStudent: builder.mutation<responseRegisterType, SignUpArgs>({
     query: args => {
       return { url: `/users/register_student/`, method: 'POST',body: args }
     },
     // invalidatesTags: ['Me'],
   }),
   logOut: builder.mutation<void, void>({
     query: () => {
       // debugger
       return { url: `/users/logout/`, method: 'POST' }
     },
     invalidatesTags: ['Me'],
   }),
 }),
})

export const { useLoginMutation,useSignUpMutation,useMeQuery, useLogOutMutation, useRegisterStudentMutation } = authService



// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
//
// const initialState = {
//   itemsPerPage: 10,
//   currentPage: 1,
//   searchByName: '',
// }
//
// export const decksSlice = createSlice({
//   initialState,
//   name: 'decksSlice',
//   reducers: {
//     setItemsPerPage: (state, action: PayloadAction<number>) => {
//       state.itemsPerPage = action.payload
//     },
//     setCurrentPage: (state, action: PayloadAction<number>) => {
//       state.currentPage = action.payload
//     },
//     setSearchByName: (state, action: PayloadAction<string>) => {
//       state.searchByName = action.payload
//     },
//   },
// })
