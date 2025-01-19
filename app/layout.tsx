import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import HeaderWrapper from '@/lib/wrappers/head_wrapper'
import FooterWrapper from '@/lib/wrappers/footer_wrapper'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '600', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Escritório de Projetos e Parcerias da UFC',
  description: 'Faça parte da comunidade acadêmica!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="scroll-smooth" lang="en">
      <Analytics />
      <SpeedInsights />
      <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      <body className={`${poppins.className} flex flex-col min-h-screen`}>
        <HeaderWrapper />
        <main className="flex flex-1">
          <div className={'flex-1 p-6`'}>{children}</div>
          <Toaster />
        </main>
        <FooterWrapper />
      </body>
    </html>
  )
}
