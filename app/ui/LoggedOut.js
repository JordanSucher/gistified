'use client'
import { signIn } from 'next-auth/react'
import { Noto_Serif } from 'next/font/google'
import { BookmarkFilledIcon, MagicWandIcon, BellIcon, GitHubLogoIcon } from '@radix-ui/react-icons'



const noto = Noto_Serif({ subsets: ['latin'] })

export default function LoggedOut() {
  
    return (
        <div className='-mt-[85px] md:mt-[100px] ml-4 md:ml-20'> 
        <div className={`flex flex-col gap-4 md:gap-2 mt-[200px] `}>
            <p className={`text-white text-4xl md:text-5xl font-semibold ${noto.className}`}>
            <p>That podcast you don't have time for? Get the gist.</p>
            </p>
            <p className={`text-white text-xl ${noto.className}`}>
            <button onClick={()=> signIn('google')} className={`bg-black px-2 py-1 rounded-md text-white font-bold active:bg-blue-900`}>Sign in</button> 
            {` to continue.`}
            </p>
        </div>
        
        <span className='flex flex-col md:flex-row  mt-[40px] w-full justify-start gap-4'>
            <div className="flex w-[250px] h-[100px] rounded-md bg-gray-200 m-2 p-3 px-6 font-extrabold text-lg items-center gap-3">
                <MagicWandIcon className='w-10 h-10'/>
                <p>AI-generated summaries</p>
            </div>

            <div className="flex w-[250px] h-[100px] rounded-md bg-gray-200 m-2 p-3 px-6 font-extrabold text-lg items-center gap-3">
                <BellIcon className='w-10 h-10'/>
                <p>Daily digest sent via email</p>
            </div>

            <div className="flex w-[250px] h-[100px] rounded-md bg-gray-200 m-2 p-3 px-6 font-extrabold text-lg items-center gap-3">
                <BookmarkFilledIcon className='w-10 h-10'/>
                <p>Save highlights for later</p>
            </div>


        </span>

        <footer className='w-full bg-white h-fit fixed left-0 bottom-0 text-xs md:text-lg'>
            <div className='my-1 px-4 flex justify-start items-center gap-2'>
                <span className='text-black'>© 2023, All rights reserved</span>
                <span className='text-black'>|</span>
                <span className='text-black'>Built by <a className='text-blue-800 font-bold' href="https://www.linkedin.com/in/jordan-sucher/">Jordan Sucher</a></span>
                <span className='text-black'>|</span>
                <span><a className='font-bold' href="https://github.com/jordansucher/gistifier"><GitHubLogoIcon className='w-5 h-5'/></a></span>

            </div>
        </footer>
        </div>
    )

}