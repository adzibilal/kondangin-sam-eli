import type { Metadata } from 'next'
import {
  Lexend_Deca,
  Public_Sans,
  Imperial_Script,
  Tangerine,
} from 'next/font/google'
import './globals.css'

const lexendDeca = Lexend_Deca({
  variable: '--font-lexend-deca',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const imperialScript = Imperial_Script({
  variable: '--font-imperial-script',
  subsets: ['latin'],
  weight: ['400'],
})

const tangerine = Tangerine({
  variable: '--font-tangerine',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Undangan Pernikahan Sam & Eli',
  description: 'Kami mengundang Anda untuk berbagi kebahagiaan di hari istimewa pernikahan kami.',
  keywords: ['undangan pernikahan', 'wedding invitation', 'Sam & Eli', 'pernikahan'],
  authors: [{ name: 'Sam & Eli' }],
  openGraph: {
    title: 'Undangan Pernikahan Sam & Eli',
    description: 'Kami mengundang Anda untuk berbagi kebahagiaan di hari istimewa pernikahan kami.',
    type: 'website',
    url: 'https://sam-eli.kondangin.id',
    images: [
      {
        url: '/gallery/AND02446.jpg',
        width: 1200,
        height: 630,
        alt: 'Sam & Eli Wedding',
      },
    ],
    siteName: 'Undangan Pernikahan Sam & Eli',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Undangan Pernikahan Sam & Eli',
    description: 'Kami mengundang Anda untuk berbagi kebahagiaan di hari istimewa pernikahan kami.',
    images: ['/gallery/AND02446.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexendDeca.variable} ${publicSans.variable} ${imperialScript.variable} ${tangerine.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
