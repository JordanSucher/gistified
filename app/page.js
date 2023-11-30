'use client'

import Image from 'next/image'
import { SessionProvider } from 'next-auth/react'
import {redirect} from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {

  useEffect(() => {
    redirect('/subscriptions')
  }, [])

  return (
    <SessionProvider>
    <main className="flex min-h-screen flex-col items-center justify-between p-10 md:p-24">
     <div>
     </div>
    </main>
    </SessionProvider>
  )
}
