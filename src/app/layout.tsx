import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import './globals.css'
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: 'UniRoom'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body style={{ fontFamily: 'Satoshi, sans-serif' }}>
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}
