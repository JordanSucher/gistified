'use client'

import UserButton from "./UserButton"
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { SessionProvider } from "next-auth/react"
import Link from "next/link"

export default function Header({mode = "loggedIn"}) {
    const bgColor = mode === "loggedIn" ? "bg-white" : "bg-zinc-900"
    const textColor = mode === "loggedIn" ? "text-black" : "text-white"
    const zIndex = mode === "loggedIn" ? "z-40" : "-z-12"
    return (
        <SessionProvider>
            <header className={`h-[90px] ${bgColor} px-4 md:px-7 py-4 flex justify-between items-center ${textColor} text-xxl fixed top-0 left-0 right-0 -z-20`}>
            <Link href="/" className="font-bold text-3xl z-5">Gistified</Link>
            
            { mode === "loggedIn" && <nav>
            <NavigationMenu.Root className="">
                <NavigationMenu.List className="flex space-x-4">
                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger asChild>
                            <UserButton />
                        </NavigationMenu.Trigger>
                    </NavigationMenu.Item>
                {/* Add more NavigationMenu.Items as needed */}
                </NavigationMenu.List>
            </NavigationMenu.Root>
            </nav> }

            </header>

        </SessionProvider>  
    )
}
