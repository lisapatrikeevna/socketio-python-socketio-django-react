import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createApi } from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:12345',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).app?.user?.access;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Students', 'Me', 'Choices', 'CheckboxList', 'Employee'],
  baseQuery: baseQuery,
  endpoints: () => ({}), // refetchOnFocus: true,
})



