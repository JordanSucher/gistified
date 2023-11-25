'use client'

import UserButton from "./UserButton"
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { SessionProvider } from "next-auth/react"

export default function Header() {
    return (
        <SessionProvider>
            <header className="bg-gray-100 shadow-md p-4 flex justify-between items-center text-black">
            <div className="font-bold text-xl">Gistifier</div>
            <nav>
            <NavigationMenu.Root>
                <NavigationMenu.List className="flex space-x-4">
                {/* <NavigationMenu.Item>
                    <NavigationMenu.Trigger asChild>
                    <button className="hover:text-blue-500">Home</button>
                    </NavigationMenu.Trigger>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger asChild>
                    <button className="hover:text-blue-500">About</button>
                    </NavigationMenu.Trigger>
                </NavigationMenu.Item> */}
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger asChild>
                        <UserButton />
                    </NavigationMenu.Trigger>
                </NavigationMenu.Item>
                {/* Add more NavigationMenu.Items as needed */}
                </NavigationMenu.List>
            </NavigationMenu.Root>
            </nav>
            </header>
        </SessionProvider>  
    )
}