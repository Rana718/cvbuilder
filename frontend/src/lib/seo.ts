import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = 'https://airezumebuilder.com/img/banner.png',
    url = 'https://airezumebuilder.com',
    type = 'website',
    publishedTime,
    modifiedTime,
    authors = ['Ai-rezume builder Team'],
    section
  } = config;

  return {
    title,
    description,
    keywords: [...keywords, 'AI resume builder', 'CV creator', 'professional resume', 'cover letter generator'],
    authors: authors.map(name => ({ name })),
    openGraph: {
      title,
      description,
      url,
      siteName: 'Ai-rezume builder',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
        section,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@airesumebuilder',
      creator: '@airesumebuilder',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export const seoPages = {
  home: {
    title: 'Ai-rezume builder - Create Professional Resumes & Cover Letters Online',
    description: 'Create professional resumes and cover letters with our AI-powered CV builder. ATS-friendly templates, LinkedIn integration, and expert guidance. Build your perfect resume in minutes.',
    keywords: ['AI resume builder', 'online CV creator', 'professional resume templates', 'ATS friendly resume', 'cover letter generator'],
    url: 'https://airezumebuilder.com',
  },
  dashboard: {
    title: 'Dashboard - Manage Your Resumes & Cover Letters',
    description: 'Access your resume dashboard to create, edit, and manage your professional resumes and cover letters. Track your applications and upgrade to premium features.',
    keywords: ['resume dashboard', 'CV management', 'application tracking', 'premium features'],
    url: 'https://airezumebuilder.com/dashboard',
  },
  templates: {
    title: 'Professional Resume Templates - ATS-Friendly CV Designs',
    description: 'Choose from our collection of professional, ATS-friendly resume templates. Modern designs crafted by experts to help you land your dream job.',
    keywords: ['resume templates', 'CV templates', 'professional designs', 'ATS friendly templates', 'modern resume layouts'],
    url: 'https://airezumebuilder.com/template',
  },
  coverLetter: {
    title: 'AI Cover Letter Generator - Create Personalized Cover Letters',
    description: 'Generate personalized cover letters with AI assistance. Match your cover letter to job requirements and increase your chances of getting hired.',
    keywords: ['cover letter generator', 'AI cover letter', 'personalized cover letters', 'job application letters'],
    url: 'https://airezumebuilder.com/cover-letter',
  },
  profile: {
    title: 'Profile Settings - Manage Your Account',
    description: 'Manage your Ai-rezume builder profile, update personal information, and configure your account settings for the best resume building experience.',
    keywords: ['profile settings', 'account management', 'user preferences'],
    url: 'https://airezumebuilder.com/profile',
  },
  pricing: {
    title: 'Pricing Plans - Choose Your Resume Builder Plan',
    description: 'Affordable pricing plans for professional resume creation. Free basic features with premium upgrades for advanced templates and AI assistance.',
    keywords: ['pricing plans', 'resume builder cost', 'premium features', 'subscription plans'],
    url: 'https://airezumebuilder.com/pricing',
  },
  signIn: {
    title: 'Sign In - Access Your Resume Builder Account',
    description: 'Sign in to your Ai-rezume builder account to access your resumes, cover letters, and premium features. Secure login with multiple authentication options.',
    keywords: ['sign in', 'login', 'account access', 'user authentication'],
    url: 'https://airezumebuilder.com/sign-in',
  },
  signUp: {
    title: 'Sign Up - Create Your Free Resume Builder Account',
    description: 'Create your free Ai-rezume builder account and start building professional resumes today. Quick registration with instant access to templates and tools.',
    keywords: ['sign up', 'create account', 'free registration', 'get started'],
    url: 'https://airezumebuilder.com/sign-up',
  },
  privacy: {
    title: 'Privacy Policy - How We Protect Your Data',
    description: 'Learn how Ai-rezume builder protects your personal information and resume data. Our comprehensive privacy policy explains our data handling practices.',
    keywords: ['privacy policy', 'data protection', 'user privacy', 'data security'],
    url: 'https://airezumebuilder.com/terms/privacy',
  },
  terms: {
    title: 'Terms of Service - Usage Guidelines',
    description: 'Read our terms of service and usage guidelines for Ai-rezume builder. Understand your rights and responsibilities when using our platform.',
    keywords: ['terms of service', 'usage guidelines', 'user agreement'],
    url: 'https://airezumebuilder.com/terms/policy',
  },
  refund: {
    title: 'Refund Policy - Money-Back Guarantee',
    description: 'Our refund policy ensures your satisfaction with Ai-rezume builder. Learn about our money-back guarantee and refund process.',
    keywords: ['refund policy', 'money-back guarantee', 'customer satisfaction'],
    url: 'https://airezumebuilder.com/terms/refund',
  },
};

export function generateStructuredData(type: 'WebApplication' | 'Article' | 'Organization' | 'Product', data: any) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
  };

  switch (type) {
    case 'WebApplication':
      return {
        ...baseSchema,
        name: data.name || "Ai-rezume builder",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        url: data.url || "https://airezumebuilder.com",
        description: data.description,
        author: {
          "@type": "Organization",
          name: "Ai-rezume builder Team",
          url: "https://airezumebuilder.com"
        },
        offers: data.offers || {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        },
        featureList: data.features || [
          "AI-powered resume creation",
          "ATS-friendly templates",
          "Cover letter generator",
          "Multiple export formats"
        ],
        aggregateRating: data.rating || {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "1250"
        }
      };
    
    case 'Article':
      return {
        ...baseSchema,
        headline: data.title,
        description: data.description,
        author: {
          "@type": "Person",
          name: data.author || "Ai-rezume builder Team"
        },
        publisher: {
          "@type": "Organization",
          name: "Ai-rezume builder",
          logo: {
            "@type": "ImageObject",
            url: "https://airezumebuilder.com/img/logo.png"
          }
        },
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        image: data.image || "https://airezumebuilder.com/img/banner.png"
      };
    
    case 'Organization':
      return {
        ...baseSchema,
        name: "Ai-rezume builder",
        url: "https://airezumebuilder.com",
        logo: "https://airezumebuilder.com/img/logo.png",
        description: "Professional AI-powered resume and cover letter builder",
        sameAs: [
          "https://twitter.com/resumeaiworld",
          "https://linkedin.com/company/resumeaiworld",
          "https://facebook.com/resumeaiworld"
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-555-0123",
          contactType: "customer service",
          email: "support@airezumebuilder.com"
        }
      };
    
    default:
      return baseSchema;
  }
}