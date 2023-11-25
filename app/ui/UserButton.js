'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import {useSession, signIn, signOut} from 'next-auth/react';


export default function UserButton() {
    const {data: session} = useSession();

    return (
        <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className='hover:cursor-pointer'>
            <Avatar.Root className='bg-gray-500 
            text-sm flex items-center justify-center 
            rounded-full p-3 h-12 w-12'>
            <Avatar.Image />
            <Avatar.Fallback >
                User
            </ Avatar.Fallback>
            </Avatar.Root>
        </ DropdownMenu.Trigger>
    
        <DropdownMenu.Portal>
          <DropdownMenu.Content 
            className='bg-white rounded-md shadow-lg min-w-[95px] 
            text-black text-sm p-2 m-1'>
            {!session && (
                <DropdownMenu.Item className='hover:outline-none focus:none'>
                    <button onClick={() => signIn('github')}>Log in with Github</button>
                </DropdownMenu.Item>      
            )}

            {session && (
                <DropdownMenu.Item className='hover:outline-none focus:none'>
                    <button onClick={() => signOut()}>Log out</button>
                </DropdownMenu.Item>
            )}
          
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    )
}