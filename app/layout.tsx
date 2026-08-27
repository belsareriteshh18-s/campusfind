import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { CompareTray } from '@/components/compare-tray'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

export const metadata: Metadata = {
  title: 'CampusFind — Find your college fit',
  description: 'Compare Indian colleges, courses, costs, and student reviews in one clear place.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        <SiteHeader />
        <main className="min-h-[70vh] pb-28">{children}</main>
        <CompareTray />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
