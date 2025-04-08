import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { logOut, setUser } from '../features/auth/authSlice';
import { toast } from 'sonner';
import {jwtDecode} from "jwt-decode";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BACKEND_BASE_URL}`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set('authorization', `${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error) {
    const error = result.error;

    // Handle 404 errors
    if (error?.status === 404) {
      toast.error('Resource not found');
    }

    // Handle 403 errors
    if (error.status === 403) {
      toast.error('Forbidden access');
    }

    // Handle 401 errors (token refresh logic)
    if (error.status === 401) {
      console.log('Sending refresh token');

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
        });

        const data = await res.json();

        if (data?.data?.accessToken) {
          const user = jwtDecode(data.data.accessToken);
          console.log('from baseApi', user);
          api.dispatch(
            setUser({
              user,
              token: data.data.accessToken,
            })
          );

          // Retry the original request with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
          toast.error('Session expired. Please log in again.');
        }
      } catch (refreshError) {
        console.log(refreshError);
        api.dispatch(logOut());
        toast.error('Failed to refresh token. Please log in again.');
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['auth'],
  endpoints: () => ({}),
});