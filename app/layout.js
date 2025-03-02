import { Inter } from 'next/font/google'
import './globals.css'
import Header from './ui/Header'
import Sidenav from './ui/Sidenav'
import LoggedOut from './ui/LoggedOut'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/authOptions'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gistified',
  description: 'Get the gist of podcast episodes',
}



export default async function RootLayout({ children }) {

  let session = await getServerSession(authOptions)

  if ( session ) return (
    <html lang="en" className='w-[100vw] m-0 p-0'>
      <body className={inter.className + ' flex flex-col bg-gray-100'}>
        <Header />
        <div className={`flex grow w-full mt-[90px]`}>
          <Sidenav />
          <div className='px-1 ml-[4px] md:ml-[100px] md:pr-20 w-full h-full flex flex-col items-center md:items-start'>
            {children}
          </div>
        </div>
      </body>
    </html>
  )

  return (
    <html lang="en">
      <body className={inter.className + ' flex flex-col bg-zinc-900 w-full'}>
        <LoggedOut />
      </body>
    </html>
  )

}
