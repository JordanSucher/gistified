'use client'
import { signIn } from 'next-auth/react'


export default function LoggedOut() {
  
    return (
        <div className={`flex grow mt-[100px] ml-4 md:ml-20`}>
            <p>
            {`Get AI-generated summaries of the podcasts you subscribe to. Please `}
            <button onClick={()=> signIn('google')} className='text-blue-700 hover:underline'>sign in</button> 
            {` to continue.`}
            </p>
        </div>
    )

}