'use client'
import { signIn } from 'next-auth/react'
import { Noto_Serif, Fraunces } from 'next/font/google'
import { BookmarkFilledIcon, MagicWandIcon, BellIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import ParticlesBackground from './ParticlesBackground'
import Header from './Header'



const noto = Noto_Serif({ subsets: ['latin'] })
const fraunces = Fraunces({ subsets: ['latin'] })

export default function LoggedOut() {
  
    return (
        <div className='-mt-[85px] md:mt-[70px] ml-4 md:ml-[150px]'> 
            <div className="absolute inset-0 -z-10">
                <ParticlesBackground />
            </div>
            <Header mode='loggedOut'/>

            <div className={`flex flex-col gap-4 md:gap-2 mt-[200px] `}>
                <div className={`text-white text-4xl md:text-6xl font-semibold ${fraunces.className}`}>
                <p>no time for every podcast?</p>
                <p className="mt-2">thats okay.</p>
                </div>
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

            <div className='flex flex-col md:flex-row mt-[30px] w-full justify-start gap-4'>
                <p className={`text-gray-200 text-xl`}>
                    <button onClick={()=> signIn('google')} className={`bg-violet-700 px-2 py-1 rounded-md text-gray-100 font-bold active:bg-violet-900`}>Sign in</button> 
                    {` to continue.`}
                </p>
            </div> 

            <footer className='w-full bg-zinc-900 text-white h-fit fixed left-0 bottom-0 text-xs md:text-lg -z-20'>
                <div className='my-1 px-4 flex justify-start items-center gap-2'>
                    <span className=''>Built by <a className='text-gray-200 font-bold hover:text-indigo-400' href="https://www.linkedin.com/in/jordan-sucher/">Jordan Sucher</a></span>
                    <span className='text-black'>|</span>
                    <span><a className='font-bold' href="https://github.com/jordansucher/gistifier"><GitHubLogoIcon className='w-5 h-5 hover:text-indigo-400'/></a></span>

                </div>
            </footer>
        </div>
    )

}
