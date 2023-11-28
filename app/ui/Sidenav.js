'use client'

import * as NavigationMenu from "@radix-ui/react-navigation-menu"

import Link from "next/link"

export default function Sidenav() {
    return (
        <NavigationMenu.Root className="py-2 px-8 flex flex-col bg-gray-100 w-40 h-full text-black text-lg">
            <NavigationMenu.List>
            <NavigationMenu.Item className="py-3">
                    <NavigationMenu.Trigger asChild>
                        <Link
                        href={"/subscriptions"}
                        className="hover:text-blue-500">Subscriptions</Link>
                    </NavigationMenu.Trigger>
                </NavigationMenu.Item>
            <NavigationMenu.Item className="py-3">
                    <NavigationMenu.Trigger asChild>
                        <Link 
                        href="/summaries" className="hover:text-blue-500">Summaries</Link>
                    </NavigationMenu.Trigger>
                </NavigationMenu.Item>
                

            </NavigationMenu.List>
        </NavigationMenu.Root>
    )
}