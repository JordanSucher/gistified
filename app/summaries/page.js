'use client'

import SummaryCard from "../ui/Summaries/SummaryCard"
import prisma from '../prisma'
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import AddSubscriptionButton from "../ui/Subscriptions/AddSubscriptionButton"
import ReadFilter from "../ui/Summaries/ReadFilter"
import { SessionProvider } from 'next-auth/react'
import { useState, useEffect} from 'react'


export default function Summaries (Component) {
    return (
        <SessionProvider>
            <SummariesInner />
        </SessionProvider>
    )
}

function SummariesInner () {
    const [loading, setLoading] = useState(true)
    const { data: session } = useSession()
    const [summaries, setSummaries] = useState([])
    const [allExpanded, setAllExpanded] = useState(false)
    const [allRead, setAllRead] = useState(null)
    const [readFilter, setReadFilter] = useState(false)


    useEffect(() => {
        const grabSummaries = async () => {
            try {
                let response = await (await fetch('/api/summaries')).json()
                setSummaries(response)
                setLoading(false)
            }
            catch (error) {
                console.log("error", error.message)
            }
        }
        if(session) {
            grabSummaries()
        }
    }, [session])


    if (loading == true) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }
    
    else if (summaries.length > 0) {
        return (
            <div className='w-full h-full max-w-[1000px] self-center md:mr-24 overflow-y-auto'>
                <div className="fixed z-30 bg-gray-100 w-[100%] max-w-[1000px]">
                    <span className="z-30 bg-gray-100 flex-col flex justify-between items-start py-2 pr-4 mb-2">
                        <h1 className="text-xl m-0 p-0">Your Summaries</h1>
                        <span className="flex">
                        <ReadFilter readFilter={readFilter} setReadFilter={setReadFilter} />
                            <button className="SmallButton hidden md:block"
                            onClick={() => setAllExpanded(true)}>Expand all</button>
                            <button className="SmallButton hidden md:block"
                            onClick={() => setAllExpanded(false)}>Collapse all</button>
                            <button className="SmallButton hidden md:block"
                            onClick={() => setAllRead(true)}>Mark all as read</button>
                            <button className="SmallButton hidden md:block"
                            onClick={() => setAllRead(false)}>Mark all as unread</button>
                        </span>
                        <span>
                        </span>
                    </span>
                </div>
                <div className="w-full px-4 pt-4 mt-16 ">
                {summaries.map((summary) => {
                    return (
                    <>
                        <SummaryCard
                        key={summary.id}
                        summary={summary}
                        allExpanded={allExpanded}
                        setAllExpanded={setAllExpanded}
                        allRead={allRead}
                        setAllRead={setAllRead}
                        readFilter={readFilter}
                        setReadFilter={setReadFilter}
                        />
                        {/* <hr className="h-[1px] bg-gray-300"/> */}
                    </>
                    )
                }
                )}
                </div>
            </div>
        )
    }

    else {
        return (
            <div className='w-full max-w-[1000px] self-center flex justify-center items-center gap-4'>
                <p className="text-lg">No summaries available yet. </p> 
                <AddSubscriptionButton />
            </div>
        )
    }
}

