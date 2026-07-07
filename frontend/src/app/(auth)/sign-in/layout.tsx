import { Metadata } from 'next'
import { generateMetadata, seoPages } from '@/lib/seo'

export const metadata: Metadata = generateMetadata(seoPages.signIn)

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}