import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://airesumebuilder.com'
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

  // You can add dynamic pages here if needed
  // For example, if you have public template pages or blog posts
  const dynamicPages: any[] = []

  // Template pages (if they are publicly accessible)
  const templateIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // Replace with actual template IDs
  const templatePages = templateIds.map(id => ({
    url: `${baseUrl}/template/${id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...templatePages,
    ...dynamicPages,
  ]
}