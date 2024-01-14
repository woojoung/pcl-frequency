import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthSession from './authSession'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: '공동체 프로그램',
	description: '주님의 교회 공동체 프로그램',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthSession>
				<body className={inter.className}>{children}</body>
			</AuthSession>
    </html>
  )
}
