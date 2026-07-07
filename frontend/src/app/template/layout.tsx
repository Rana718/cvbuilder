import { Metadata } from 'next'
import { generateMetadata, seoPages, generateStructuredData } from '@/lib/seo'

export const metadata: Metadata = generateMetadata(seoPages.templates)

export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = generateStructuredData('WebApplication', {
    name: "Resume Templates - Ai-rezume builder",
    description: seoPages.templates.description,
    url: seoPages.templates.url,
    features: [
      "Professional resume templates",
      "ATS-friendly designs",
      "Multiple format options",
      "Easy customization",
      "Modern layouts"
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