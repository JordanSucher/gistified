'use client'

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import {HomeIcon, ListBulletIcon} from "@radix-ui/react-icons"
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
        <NavigationMenu.Root className="w-[400px] py-2 px-8 flex flex-col bg-gray-100 h-full text-black text-md">
            <hr className="h-[2px] mb-6 bg-gray-300" />
            <NavigationMenu.List>
            <NavigationMenu.Item className={"py-2 px-2 mb-2 rounded-md" + (currPage === "subscriptions" ? " bg-slate-200" : "")}>
                <NavigationMenu.Trigger asChild>
                    <span className={"flex items-center hover:text-blue-500" }>
                        <HomeIcon className="w-4 h-4 mr-2"/>
                        <Link
                        href={"/subscriptions"}
                        className="">Subscriptions</Link>
                    </span>
                </NavigationMenu.Trigger>
            </NavigationMenu.Item>
            <NavigationMenu.Item className={"py-2 px-2 mb-2 rounded-md" + (currPage === "summaries" ? " bg-slate-200" : "")}>
                    <NavigationMenu.Trigger asChild>
                        <span className="flex items-center hover:text-blue-500">
                            <ListBulletIcon className="w-4 h-4 mr-2" />
                            <Link 
                            href="/summaries" className="">Summaries</Link>
                        </span>
                    </NavigationMenu.Trigger>
                </NavigationMenu.Item>
                

            </NavigationMenu.List>
        </NavigationMenu.Root>
    )
}