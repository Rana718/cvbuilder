import { Metadata } from 'next'
import { generateMetadata, seoPages } from '@/lib/seo'

export const metadata: Metadata = generateMetadata(seoPages.refund)

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}