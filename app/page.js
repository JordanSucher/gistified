'use client'

import Image from 'next/image'
import { SessionProvider } from 'next-auth/react'

export default function Home() {
  return (
    <SessionProvider>
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <div>
      Hello world
     </div>
    </main>
    </SessionProvider>
  )
}
