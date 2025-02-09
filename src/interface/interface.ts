export interface Post {
  slug: string
  title: string
  description: string
  body: string
  createdAt: string
  updatedAt: string

  tagList: string[]
  favorited: boolean
  favoritesCount: number
  author: {
    username: string
    image: string
    following: boolean
  }
}

export interface User {
  username: string
  email: string
  token: string
  bio: string
  image: string | null
}


export interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  image?: string | null;
}

export interface FormData {
  title: string
  description: string
  body: string // изменено с text на body для соответствия API
}

export interface ArticleData extends FormData {
  tags: string[]
}

export interface PostsResponse {
  articles: Post[]
  articlesCount: number
}

export interface GetPostsArgs {
  offset?: number
  limit?: number
}

export interface Article {
  slug: string
  title: string
  description: string
  body: string
  tags: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: {
    username: string
    bio: string
    image: string
    following: boolean
  }
}
