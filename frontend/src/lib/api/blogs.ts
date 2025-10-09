import axiosInstance from '@/lib/axios';

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  author_id: number;
  category?: string;
  tags?: string[];
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface BlogListItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  tags?: string[];
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  reading_time: number;
  created_at: string;
  published_at?: string;
}

export interface CreateBlogData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  category?: string;
  tags?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  reading_time?: number;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {}

export interface BlogsResponse {
  blogs: BlogListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class BlogsAPI {
  // Public endpoints (cached)
  async getBlogs(page: number = 1, limit: number = 10, category?: string): Promise<BlogsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category) {
      params.append('category', category);
    }
    
    const response = await axiosInstance.get(`/api/blog/blogs?${params}`);
    return response.data;
  }

  async getBlogBySlug(slug: string): Promise<Blog> {
    const response = await axiosInstance.get(`/api/blog/blogs/${slug}`);
    return response.data;
  }

  async getBlogsByCategory(category: string, page: number = 1, limit: number = 10): Promise<BlogsResponse> {
    const response = await axiosInstance.get(`/api/blog/blogs/category/${category}`, {
      params: { page, limit }
    });
    return response.data;
  }

  // Admin endpoints
  async getAllBlogsAdmin(): Promise<Blog[]> {
    const response = await axiosInstance.get('/api/admin/blogs/');
    return response.data;
  }

  async createBlog(blogData: CreateBlogData): Promise<Blog> {
    const response = await axiosInstance.post('/api/admin/blogs/', blogData);
    return response.data;
  }

  async updateBlog(blogId: number, blogData: UpdateBlogData): Promise<Blog> {
    const response = await axiosInstance.put(`/api/admin/blogs/${blogId}`, blogData);
    return response.data;
  }

  async deleteBlog(blogId: number): Promise<void> {
    await axiosInstance.delete(`/api/admin/blogs/${blogId}`);
  }
}

export const blogsAPI = new BlogsAPI();
