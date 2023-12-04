'use client'

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import {HomeIcon, ListBulletIcon, GearIcon, BookmarkIcon} from "@radix-ui/react-icons"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

import Link from "next/link"

export default function Sidenav() {
    const pathname = usePathname()
    
    const [currPage, setCurrPage] = useState("")
    useEffect(() => {
        console.log(pathname)
        setCurrPage(pathname.replace("/", ""))
    }, [pathname])
    
    
    return (
        <NavigationMenu.Root className="z-30 hidden md:w-[200px] lg:w-[400px] py-2 px-8 md:flex flex-col bg-gray-100 h-full text-black text-md">
            <hr className="h-[2px] fixed top-[90px] md:w-[150px] lg:w-[250px] mb-6 bg-gray-300" />
            <NavigationMenu.List className="fixed w-[100px] md:w-[150px] lg:w-[250px]">
            
            <NavigationMenu.Item className={"py-2 px-2 mb-2 rounded-md w-full" + (currPage === "subscriptions" ? " bg-slate-200" : "")}>
                <NavigationMenu.Trigger asChild>
                    <Link href={"/subscriptions"}>
                        <span className={"flex items-center hover:text-blue-500 w-full" }>
                            <HomeIcon className="w-4 h-4 mr-2"/>
                            Subscriptions
                        </span>
                    </Link>
                </NavigationMenu.Trigger>
            </NavigationMenu.Item>
            
            <NavigationMenu.Item className={"py-2 px-2 mb-2 rounded-md" + (currPage === "summaries" ? " bg-slate-200" : "")}>
                <NavigationMenu.Trigger asChild>
                    <Link href="/summaries">
                        <span className="flex items-center hover:text-blue-500">
                            <ListBulletIcon className="w-4 h-4 mr-2" />
                            Inbox
                        </span>
                    </Link>
                </NavigationMenu.Trigger>
            </NavigationMenu.Item>

            <NavigationMenu.Item className={"py-2 px-2 mb-2 rounded-md" + (currPage === "settings" ? " bg-slate-200" : "")}>
                <NavigationMenu.Trigger asChild>
                    <Link href="/settings">
                        <span className="flex items-center hover:text-blue-500">
                            <GearIcon className="w-4 h-4 mr-2" />
                            Settings
                        </span>
                    </Link>
                </NavigationMenu.Trigger>
            </NavigationMenu.Item>

            {/* <NavigationMenu.Item className={"py-2 px-2 mb-2 rounded-md" + (currPage === "highlights" ? " bg-slate-200" : "")}>
                <NavigationMenu.Trigger asChild>
                    <Link href="/highlights">
                        <span className="flex items-center hover:text-blue-500">
                            <BookmarkIcon className="w-4 h-4 mr-2" />
                            Highlights
                        </span>
                    </Link>
                </NavigationMenu.Trigger>
            </NavigationMenu.Item> */}


                

            </NavigationMenu.List>
        </NavigationMenu.Root>
    )
}