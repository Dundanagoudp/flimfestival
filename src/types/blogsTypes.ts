// Blog Category Types
export interface BlogCategory {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreateCategoryPayload {
  name: string
}

export interface UpdateCategoryPayload {
  name: string
}

// Blog Post Types
export interface BlogPost {
  _id: string
  category: string | BlogCategory
  title: string
  author: string
  imageUrl: string
  contentType: "blog" | "link"
  contents?: string
  link?: string
  publishedDate: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreateBlogPayload {
  title: string
  contentType: "blog" | "link"
  category: string
  contents?: string
  link?: string
  author: string
  publishedDate: string
  image: File
}

export interface UpdateBlogPayload {
  title?: string
  contentType?: "blog" | "link"
  category?: string
  contents?: string
  link?: string
  author?: string
  publishedDate?: string
  image?: File
}

// API Response Types
export interface CategoryCreateResponse {
  name: string
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface GetAllCategoriesResponse extends Array<BlogCategory> {}

export interface SimpleMessageResponse {
  message: string
}

export interface GetAllBlogsResponse extends Array<BlogPost> {}

export interface GetContentBlogsResponse extends Array<BlogPost> {}

export interface GetLinkBlogsResponse extends Array<BlogPost> {}

export interface GetLatestBlogsResponse extends Array<BlogPost> {}

export interface SingleBlogResponse extends BlogPost {}

// Blog Post with Embedded Category (for responses that include full category object)
export interface BlogPostWithCategory extends Omit<BlogPost, 'category'> {
  category: BlogCategory
}
