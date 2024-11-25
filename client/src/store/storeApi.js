import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8081',
    prepareHeaders: (headers) => {
      // Retrieve the token from localStorage or any global store
      const token = JSON.parse(localStorage.getItem('token')); // Or get it from your context/store
      console.log(token,'my token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Set the token in the Authorization header
      }

      return headers;
    },
  }),
  tagTypes: ['price', 'payment', 'spot','token'], // Define all used tags here
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
      invalidatesTags: ['payment'], // Invalidate 'payment' tag
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
      providesTags: ['payment'], // Provide 'payment' tag
    }),
    addPrice: builder.mutation({
      query: (data) => ({
        url: '/api/v1/add-price',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['price'], // Invalidate 'price' tag
    }),
    addToken: builder.mutation({
      query: (data) => ({
        url: '/api/v1/add-token',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['token'], // Invalidate 'token' tag
    }),
    getPrice: builder.query({
      query: () => ({
        url: '/api/v1/get-price',
      }),
      providesTags: ['price'], // Provide 'price' tag
    }),
    addSpot: builder.mutation({
      query: (data) => ({
        url: '/api/v1/add-spot',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['spot'], // Invalidate 'spot' tag
    }),
    getSpot: builder.query({
      query: () => ({
        url: '/api/v1/get-spot',
      }),
      providesTags: ['spot'], // Provide 'spot' tag
    }),
    getToken: builder.query({
      query: () => ({
        url: '/api/v1/get-token',
      }),
      providesTags: ['token'], // Provide 'spot' tag
    }),
    getTop: builder.query({
      query: () => ({
        url: '/api/v1/top-user',
      }),
   
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useAddPaymentMutation,
  useGetPaymentDataQuery,
  useUpdateUserMutation,
  useSocialLoginMutation,
  useAddPriceMutation,
  useAddTokenMutation,
  useGetPriceQuery,
  useAddSpotMutation,
  useGetSpotQuery,
  useGetTokenQuery,
  useGetTopQuery,
} = storeApi;
