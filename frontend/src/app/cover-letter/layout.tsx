import { Metadata } from 'next'
import { generateMetadata, seoPages, generateStructuredData } from '@/lib/seo'

export const metadata: Metadata = generateMetadata(seoPages.coverLetter)

export default function CoverLetterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = generateStructuredData('WebApplication', {
    name: "AI Cover Letter Generator - Ai-rezume builder",
    description: seoPages.coverLetter.description,
    url: seoPages.coverLetter.url,
    features: [
      "AI-powered cover letter generation",
      "Job-specific customization",
      "Professional templates",
      "Personalized content",
      "Industry-specific examples"
    ]
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  )
}