import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from '@/components/providers'
import Nav from '@/components/Nav/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'rooms',
  description: 'chat-rooms',
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <Provider>
        <body className={inter.className}>
          <Nav />
          {children}
        </body>
      </Provider>
    </html>
  )
}
