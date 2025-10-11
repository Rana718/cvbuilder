import { MetadataRoute } from 'next'
import { blogsAPI } from '@/lib/api/blogs'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://airezumebuilder.com'
  const lastModified = new Date()

  const staticPages = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/template`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cover-letter`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms/privacy`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms/policy`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms/refund`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // Template pages (if they are publicly accessible)
  const templateIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const templatePages = templateIds.map(id => ({
    url: `${baseUrl}/template/${id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Blog pages
  let blogPages: any[] = []
  try {
    const blogsResponse = await blogsAPI.getBlogs(1, 100) // Get first 100 blogs
    blogPages = blogsResponse.blogs.map(blog => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.published_at || blog.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  return [
    ...staticPages,
    ...templatePages,
    ...blogPages,
  ]
}
