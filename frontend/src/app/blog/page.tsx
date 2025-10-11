import { Metadata } from 'next';
import BlogList from '@/components/blog/BlogList';

export const metadata: Metadata = {
  title: 'Resume & Career Tips Blog | AI Resume Builder',
  description: 'Expert tips on resume writing, career advice, job search strategies, and professional development. Stay updated with the latest trends in recruitment and career growth.',
  keywords: [
    'resume tips',
    'career advice',
    'job search',
    'professional development',
    'resume writing',
    'career growth',
    'interview tips',
    'job hunting',
    'CV tips',
    'career coaching',
    'job interview',
    'professional skills'
  ],
  authors: [{ name: 'AI Resume Builder Team' }],
  creator: 'AI Resume Builder',
  publisher: 'AI Resume Builder',
  openGraph: {
    title: 'Resume & Career Tips Blog | AI Resume Builder',
    description: 'Expert tips on resume writing, career advice, job search strategies, and professional development.',
    type: 'website',
    url: 'https://airezumebuilder.com/blog',
    siteName: 'AI Resume Builder',
    images: [{
      url: 'https://airezumebuilder.com/img/og-blog.jpg',
      width: 1200,
      height: 630,
      alt: 'AI Resume Builder Blog - Resume & Career Tips',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume & Career Tips Blog | AI Resume Builder',
    description: 'Expert tips on resume writing, career advice, job search strategies, and professional development.',
    images: ['https://airezumebuilder.com/img/og-blog.jpg'],
    creator: '@airesumebuilder',
  },
  alternates: {
    canonical: 'https://airezumebuilder.com/blog',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  category: 'Career Development',
};

export default function BlogPage() {
  // JSON-LD structured data for blog listing page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'AI Resume Builder Blog',
    description: 'Expert tips on resume writing, career advice, job search strategies, and professional development.',
    url: 'https://airezumebuilder.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'AI Resume Builder',
      logo: {
        '@type': 'ImageObject',
        url: 'https://airezumebuilder.com/img/logo.png'
      }
    },
    inLanguage: 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://airezumebuilder.com/blog'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogList />
    </>
  );
}
