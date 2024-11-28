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
    //PRUEBA
    <SessionProvider session={session}>
      <html lang="en">
      <head>
  {(process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview") && (
    // eslint-disable-next-line @next/next/no-sync-scripts
    <script
      data-recording-token="myydDlmA2lyTeQW3awBzZlOhSXpM7P3NIxxinCw5"
      data-is-production-environment="false"
      src="https://snippet.meticulous.ai/v1/meticulous.js"
    />
  )}
</head>

        <body style={{ fontFamily: 'Satoshi, sans-serif' }}>
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}
