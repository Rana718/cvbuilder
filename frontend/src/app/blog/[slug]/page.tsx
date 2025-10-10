import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetail from '@/components/blog/BlogDetail';
import { blogsAPI } from '@/lib/api/blogs';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const blog = await blogsAPI.getBlogBySlug(slug);
    
    const title = blog.meta_title || `${blog.title} | AI Resume Builder Blog`;
    const description = blog.meta_description || blog.excerpt || 'Expert resume writing and career tips to help you land your dream job.';
    const url = `https://airesumebuilder.com/blog/${slug}`;
    const publishedTime = blog.published_at || blog.created_at;
    const modifiedTime = blog.updated_at || publishedTime;
    
    return {
      title,
      description,
      keywords: blog.keywords?.join(', ') || 'resume tips, career advice, job search, professional development',
      authors: [{ name: 'AI Resume Builder Team' }],
      creator: 'AI Resume Builder',
      publisher: 'AI Resume Builder',
      openGraph: {
        title,
        description,
        type: 'article',
        url,
        siteName: 'AI Resume Builder',
        images: blog.featured_image ? [{
          url: blog.featured_image,
          width: 1200,
          height: 630,
          alt: blog.title,
        }] : [{
          url: 'https://airesumebuilder.com/img/og-blog.jpg',
          width: 1200,
          height: 630,
          alt: 'AI Resume Builder Blog',
        }],
        publishedTime,
        modifiedTime,
        section: blog.category || 'Career Tips',
        tags: blog.tags || ['resume', 'career', 'job search'],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: blog.featured_image ? [blog.featured_image] : ['https://airesumebuilder.com/img/og-blog.jpg'],
        creator: '@airesumebuilder',
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: blog.is_published,
        follow: blog.is_published,
        googleBot: {
          index: blog.is_published,
          follow: blog.is_published,
        },
      },
      category: blog.category || 'Career Tips',
    };
  } catch (error) {
    return {
      title: 'Blog Post | AI Resume Builder',
      description: 'Read our latest blog post about resume writing and career tips.',
      openGraph: {
        title: 'Blog Post | AI Resume Builder',
        description: 'Read our latest blog post about resume writing and career tips.',
        type: 'article',
        images: ['https://airesumebuilder.com/img/og-blog.jpg'],
      },
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  try {
    const { slug } = await params;
    const blog = await blogsAPI.getBlogBySlug(slug);
    
    // JSON-LD structured data for better SEO
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.excerpt,
      image: blog.featured_image || 'https://airesumebuilder.com/img/og-blog.jpg',
      datePublished: blog.published_at || blog.created_at,
      dateModified: blog.updated_at || blog.published_at || blog.created_at,
      author: {
        '@type': 'Organization',
        name: 'AI Resume Builder Team',
        url: 'https://airesumebuilder.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'AI Resume Builder',
        logo: {
          '@type': 'ImageObject',
          url: 'https://airesumebuilder.com/img/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://airesumebuilder.com/blog/${slug}`
      },
      articleSection: blog.category || 'Career Tips',
      keywords: blog.keywords?.join(', ') || blog.tags?.join(', ') || 'resume, career, job search',
      wordCount: blog.content?.replace(/<[^>]*>/g, '').split(' ').length || 0,
      timeRequired: `PT${blog.reading_time}M`,
      inLanguage: 'en-US'
    };
    
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BlogDetail blog={blog} />
      </>
    );
  } catch (error) {
    notFound();
  }
}
