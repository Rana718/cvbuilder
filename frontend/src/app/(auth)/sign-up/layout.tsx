import { Metadata } from 'next'
import { generateMetadata, seoPages } from '@/lib/seo'

export const metadata: Metadata = generateMetadata(seoPages.signUp)

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}