import { Metadata } from 'next'
import { generateMetadata, seoPages } from '@/lib/seo'

export const metadata: Metadata = generateMetadata(seoPages.privacy)

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}