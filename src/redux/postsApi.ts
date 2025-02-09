import { createSlice } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { useSelector } from 'react-redux'
import {
  Article,
  ArticleData,
  GetPostsArgs,
  Post,
  PostsResponse,
  User,
} from '../interface/interface'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: !!localStorage.getItem('token'),
  },
  reducers: {
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload
    },
  },
})

export const { setLoggedIn } = authSlice.actions
export default authSlice.reducer

export const postsApi = createApi({
  reducerPath: 'postsApi',
  tagTypes: ['Posts', 'User', 'Article'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Token ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: { token: string } },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: { user: credentials },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem('token', data.user.token)
          dispatch(setLoggedIn(true))
        } catch (error) {
          console.error('Login failed:', error)
        }
      },
    }),
    logout: builder.mutation<void, void>({
      queryFn: () => {
        localStorage.removeItem('token')
        return { data: null }
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        await queryFulfilled
        dispatch(setLoggedIn(false))
      },
    }),
    register: builder.mutation<
      { user: { token: string } },
      { username: string; email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/users',
        method: 'POST',
        body: { user: credentials },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem('token', data.user.token)
          dispatch(setLoggedIn(true)) // Обновляем состояние аутентификации
        } catch (error) {
          console.error('Registration failed:', error)
        }
      },
    }),
    getPosts: builder.query<PostsResponse, GetPostsArgs>({
      query: ({ offset = 0, limit = 5 } = {}) => ({
        url: '/articles',
        params: {
          offset,
          limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.articles.map(({ slug }) => ({
                type: 'Posts' as const,
                id: slug,
              })),
              { type: 'Posts' as const, id: 'LIST' },
            ]
          : [{ type: 'Posts' as const, id: 'LIST' }],
    }),
    getUser: builder.query<User, void>({
      query: () => '/user',
    }),
    addArticle: builder.mutation<{ article: Post }, Omit<ArticleData, 'slug'>>({
      query: (articleData) => ({
        url: '/articles',
        method: 'POST',
        body: articleData,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    getArticle: builder.query<Article, string>({
      query: (slug) => `/articles/${slug}`,
    }),
    getUserByUsername: builder.query<User, string>({
      query: (username) => `/profiles/${username}`,
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    updateArticle: builder.mutation<
      void,
      { slug: string; article: Omit<ArticleData, 'slug'> }
    >({
      query: ({ slug, article }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        body: article,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    favoriteArticle: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    unfavoriteArticle: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE',
      }),
    }),
    updateUser: builder.mutation<void, User>({
      query: (user) => ({
        url: '/user',
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetPostsQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetUserQuery,
  useAddArticleMutation,
  useGetArticleQuery,
  useGetUserByUsernameQuery,
  useDeleteArticleMutation,
  useUpdateArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
  useUpdateUserMutation,
} = postsApi

export const useAuth = () => {
  const isLoggedIn = useSelector(
    (state: { auth: { isLoggedIn: boolean } }) => state.auth.isLoggedIn
  ) // Получаем состояние из Redux
  return { isLoggedIn }
}
