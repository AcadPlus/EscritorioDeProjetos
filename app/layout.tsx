import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Header from './ui/header'
import Footer from './ui/footer'
// import Footer from './ui/footer'

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
      <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      <body className={poppins.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
