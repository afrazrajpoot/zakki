import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080',
    prepareHeaders: (headers) => {
      // Retrieve the token from localStorage or any global store
      const token = JSON.parse(localStorage.getItem('token'));  // Or get it from your context/store

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);  // Set the token in the Authorization header
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: '/api/v1/login',
        method: 'POST',
        body: data,
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: '/api/v1/signup',
        method: 'POST',
        body: data,
      }),
    }),
    socialLogin: builder.mutation({
      query: (data) => ({
        url: '/api/v1/social-login',
        method: 'POST',
        body: data,
      }),
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: '/api/v1/update-user',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags:['payment']
    }),
    addPayment: builder.mutation({
      query: (data) => ({
        url: '/api/v1/add-payment',
        method: 'POST',
        body: data,
      }),
    }),
    getPaymentData: builder.query({
      query: () => ({
        url: '/api/v1/get-payment',
      }),
      providesTags:['payment']
      // transformResponse: (response) => response.data,
    })
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useAddPaymentMutation,
  useGetPaymentDataQuery,
  useUpdateUserMutation,
  useSocialLoginMutation
} = storeApi;
